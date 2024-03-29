import _ from 'array-foreach-async';
import clone from 'clone';
import ev from './expressions.mjs';
import types from './AttributeTypes.mjs';
import EFFECT_TYPES from './EffectTypes.mjs';

export default async function(defs) {
    const groundValues = await buildGroundValues(defs);
    
    const allDefs = clone(defs);
    delete allDefs.$helpers;
    
    return new AttributeTable(allDefs, groundValues,
            buildHelperFunctions(defs.$helpers));
}

async function buildGroundValues(defs) {
    const groundValueResolvers = {};
    const helperFunctions = buildHelperFunctions(defs.$helpers);
    
    const attrNames = Object.keys(defs);
    attrNames.forEach(attrName => {
        if (!attrName.startsWith('$')) {
            groundValueResolvers[attrName] = async (symbolLookupFn) => {
                const attrDef = defs[attrName];
                const attrTypeDef = types[attrDef.type];
                
                if (!attrTypeDef) {
                    throw new Error('No such attribute type: ' + attrDef.type);
                }
                
                return await attrTypeDef.buildGroundValue(
                        attrDef, symbolLookupFn);
            };
        }
    });
    
    const symbolTable = new LoopDetectingSymbolTable(groundValueResolvers);
    symbolTable.pushOverrides(helperFunctions);
    
    const lookupFn = symbolTable.lookupFn();
    for (let i = 0; i < attrNames.length; i++) {
        const attrName = attrNames[i];

        if (!attrName.startsWith('$')) {
            // Let's make sure each attribute in turn is loaded up into the
            // symbol table's cache.
            await lookupFn(attrName);
        }
    }
    
    return symbolTable.cachedValues;
}

function buildHelperFunctions(rawHelpers) {
    rawHelpers = rawHelpers || {};
    
    let result = {};
    Object.keys(rawHelpers).forEach(rawHelperName => {
        result[`%${rawHelperName}`] = rawHelpers[rawHelperName];
    });
    
    return result;
}

class AttributeTable {
    constructor(defs, groundValues, helperFunctions) {
        if (helperFunctions === undefined) {
            throw new Error();
        }
        
        this.attrDefs = defs;
        this.groundValues = groundValues;
        this.helperFunctions = helperFunctions;
    }
    
    async step(activeEffects) {
        const currentValues = await this.currentValues(activeEffects);
        
        Object.keys(this.helperFunctions).forEach(key => {
            currentValues[key] = { value: this.helperFunctions[key] };
        });
        
        function valueGetter(key) {
            let result;
            
            if (currentValues[key]) {
                result = currentValues[key].value;
            }
        
            return result;
        }
        
        const newGroundValues = {};
        
        const attrNames = Object.keys(this.attrDefs);
        for (let i = 0; i < attrNames.length; i++) {
            const attrName = attrNames[i];
            const currentGroundValue = this.groundValues[attrName];
            const attrDef = this.attrDefs[attrName];
            const attrTypeDef = types[attrDef.type];
            
            const nextValue = await attrTypeDef.step(
                    currentGroundValue, attrDef, valueGetter);
            
            newGroundValues[attrName] = nextValue;
        };
        
        this.groundValues = newGroundValues;
    }
    
    async currentValues(activeEffects) {
        if (!activeEffects) {
            throw new Error('Must provide active effects.');
        }
    
        const valueResolvers = {};
        const effectTable = {};
        const totalEffects = {};
        
        const attrNames = Object.keys(this.attrDefs);
        attrNames.forEach(attrName => {
            if (attrName.startsWith('$')) {
                throw new Error('asdfasdfsafads');
            }
        
            if (!attrName.startsWith('$')) {
                valueResolvers[attrName] = async (symbolLookupFn) => {
                    const attrDef = this.attrDefs[attrName];
                    const attrTypeDef = types[attrDef.type];
                    
                    if (!attrTypeDef) {
                        throw new Error(
                                'No such attribute type: ' + attrDef.type);
                    }
                    
                    const accum = await attrTypeDef.buildAccumulator(
                            this.groundValues[attrName], attrDef,
                            symbolLookupFn);
                    
                    effectTable[attrName] = [];
                    
                    await activeEffects.forEachAsync(async e => {
                        if (EFFECT_TYPES[e.type].appliesTo(
                                e, attrName, accum, symbolLookupFn)) {
                            effectTable[attrName].push(e);
                            await EFFECT_TYPES[e.type].accumulate(
                                    e, attrName, accum, symbolLookupFn);
                        }
                    });
                    
                    totalEffects[attrName] = clone(accum);
                    
                    return await attrTypeDef.extractValue(
                            accum, attrDef, symbolLookupFn);
                };
            }
        });
        
        const symbolTable = new LoopDetectingSymbolTable(valueResolvers);
        symbolTable.pushOverrides(this.helperFunctions);
        
        const lookupFn = symbolTable.lookupFn();
        for (let i = 0; i < attrNames.length; i++) {
            const attrName = attrNames[i];

            if (!attrName.startsWith('$')) {
                // Let's make sure each attribute in turn is loaded up into the
                // symbol table's cache.
                await lookupFn(attrName);
            }
        }
        
        const result = {};
        Object.keys(symbolTable.cachedValues).forEach(k => {
            result[k] = {
                value: symbolTable.cachedValues[k],
                totalEffects: totalEffects[k],
                activeEffects: effectTable[k]
            };
        });
        
        return result;
    }
}

class LoopDetectingSymbolTable {
    constructor(valueResolvers) {
        this.overridesStack = [];
        this.valueResolvers = valueResolvers;
        this.cachedValues = {};
        this.symbolSet = {};
        this.symbolStack = [];
    }
    
    pushOverrides(overrides) {
        if (overrides === undefined) {
            throw new Error();
        }
    
        this.overridesStack.push(overrides);
    }
    
    popOverrides() {
        this.overridesStack.pop();
    }
    
    // Returns undefined if it can't be found.
    searchOverrides(name) {
        let result;
        let stackIndex = this.overridesStack.length - 1;
        while (stackIndex >= 0 && result === undefined) {
            result = this.overridesStack[stackIndex][name];
            stackIndex--;
        }
        
        return result;
    }
    
    lookupFn() {
        return async symbolName => {
            let result = this.searchOverrides(symbolName);
            
            if (result === undefined) {
                if (!this.valueResolvers[symbolName]) {
                    throw new Error('No such symbol: ' + symbolName);
                }
                else if (this.cachedValues[symbolName]) {
                    result = this.cachedValues[symbolName];
                }
                else {
                    if (this.symbolSet[symbolName]) {
                        throw new Error('Circular definition.  '
                                + this.symbolStack.join(' -> ')
                                + ' -> ' + symbolName + '.');
                    }
                    
                    this.symbolStack.push(symbolName);
                    this.symbolSet[symbolName] = true;
                    
                    result = await this.valueResolvers[symbolName](
                            this.lookupFn(), this);

                    this.cachedValues[symbolName] = result;

                    this.symbolStack.pop();                
                    delete this.symbolSet[symbolName];
                }
            }
            
            if (typeof result === 'object') {
                this.symbolStack.push(symbolName);
                this.symbolSet[symbolName] = true;
            
                result = await ev.evaluate(result, this.lookupFn(), this);
                
                this.symbolStack.pop();                
                delete this.symbolSet[symbolName];
            }
            
            return result;
        };
    }
}

function buildResolvers(template, builder) {
    const result = {};
    
    Object.keys(template).forEach(key => {
        const value = template[key];
        
        const valueResolver = builder(key, value);
        
        if (valueResolver !== undefined) {
            result[key] = valueResolver;
        }
    });
    
    return result;
}

async function resolveAll(resolvers, helperFunctions) {
    const symbolTable = new LoopDetectingSymbolTable(resolvers);
    symbolTable.pushOverrides(helperFunctions);

    const attrNames = Object.keys(resolvers);    
    const lookupFn = symbolTable.lookupFn();
    for (let i = 0; i < attrNames.length; i++) {
        const attrName = attrNames[i];

        // Let's make sure each attribute in turn is loaded up into the
        // symbol table's cache.
        await lookupFn(attrName);
    }
    
    return symbolTable.cachedValues;
}
