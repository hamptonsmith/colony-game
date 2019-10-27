import attrs from './ColonyAttributeDefinitions.mjs';
import rng from './Rng.mjs';

export default class Colony {
    constructor() {
        this.name = 'A Super Cool Colony';
        this.popK = 2.2;
        this.outputs = {
            production: 0,
            culture: 0,
            innovation: 0
        };
        this.aspects = [];
        
        this.groundAttributeValues = {};
        Object.keys(attrs).forEach(attr => {
            this.groundAttributeValues[attr] = attrs[attr].initialValue();
        });
    }
    
    step() {
        const oldAttributes = synthesizeAttributeValues();
    
        const currentGrowthRate = this.idealGrowthRate
                * ((this.capacityK - this.popK) / this.capacityK);
    
        this.popK += (this.popK * currentGrowthRate);
        
        const newAttributes = synthesizeAttributeValues();
        
        const outputAllocations = newAttributes.size - oldAttributes.size;
        
        while (outputAllocations < 0) {
            const output = rng.pick(Object.keys(this.outputs));
            this.outputs[output]--;
            
            outputAllocations++;
        }
        
        while (outputAllocations > 1) {
            const targetProduction
            
            outputAllocations--;
        }
    }
    
    desc() {
        return {
            name: this.name,
            popK: this.popK,
            derived: this.derivedAttributes(),
            outputs: this.outputs
        };
    }
    
    derivedAttributes() {
        return {
            size: Math.floor(Math.log2(this.popK / 2))
        };
    }
    
    synthesizeAttributes() {
        const result = synthesizedAttributeTableBeforeEffects(this);
        this.aspects.forEach(aspect => aspect.applyTo(result));
        
        Object.keys(attrs).forEach(name => {
            const def = attrs[name];
            
            let value;
            switch (def.type) {
                case 'bfb': {
                    const effects = result[name].accumulatedEffects;
                
                    value = effects.base * effects.factor + effects.bonus;
                    break;
                }
                default: {
                    throw new Error('Unknown attribute type: ' + def.type);
                }
            }
            
            result[name].value = value;
        });
        
        return result;
    }
    
    synthesizeAttributeValues() {
        const synthesizedAttributesTable = this.synthesizeAttributes();
        
        const result = {};
        Object.keys(attrs).forEach(name => {
            result[name] = synthesizedAttributesTable[name].value;
        });
    }
}

function synthesizedAttributeTableBeforeEffects(c) {
    const result = {};
    attrs.forEach(name => {
        const def = attrs[name];
        
        let accumulatedEffects;
        switch (def.type) {
            case 'bfb': {
                accumulatedEffects = {
                    base: c.groundAttributeValues[name],
                    factor: 1,
                    bonus: 0
                };
                
                break;
            }
            default: {
                throw new Error('Unknown attribute type: ' + def.type);
            }
        }
        
        result[name] = {
            accumulatedEffects: accumulatedEffects,
            relevantEffects: []
        };
    });
}


// Colonies produce these resources:
//   - Production
//   - Culture
//   - Innovation

// Colonies require these for smooth functioning:
//   - Justice to match Cohesion

// Desirability

