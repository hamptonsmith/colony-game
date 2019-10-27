'use strict';

import clone from 'clone';
import grammar from './expression.ne.js';
import nearley from 'nearley';

export default {
    evaluate: async (expressionString, environment) => {
        return await evaluateExpression(parse(expressionString), environment);
    },
    bindTemplate: async (expressionString, environment) => {
        return await bindTemplate(parse(expressionString), environment);
    }
};

function parse(input) {
    let result;

    if (typeof input === 'string') {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        parser.feed(input);
        
        if (parser.results.length > 1) {
            throw new Error('Ambiguous grammar! '
                    + JSON.stringify(parser.results, null, 4));
        }
        else if (parser.results.length === 0) {
            throw new Error('Invalid expression: ' + expressionString);
        }
        
        result = parser.results[0];
    }
    else {
        result = input;
    }
    
    return result;
}

async function bindTemplate(expressionAst, environment) {
    let result = expressionAst;
    
    switch (expressionAst.type) {
        case 'number':
        case 'symbol': {
            break;
        }
        case 'parenthetical': {
            expressionAst.value =
                    await bindTemplate(expressionAst.value, environment);
            break;
        }
        case 'call': {
            expressionAst.function =
                    await bindTemplate(expressionAst.function, environment);
        
            for (let i = 0; i < expressionAst.arguments.arguments.length; i++) {
                expressionAst.arguments.arguments[i] = await bindTemplate(
                        expressionAst.arguments.arguments[i],
                        environment);
            }
            
            break;
        }
        case 'binaryOp': {
            expressionAst.left =
                    await bindTemplate(expressionAst.left, environment);
            expressionAst.right =
                    await bindTemplate(expressionAst.right, environment);
            break;
        }
        case 'template': {
            result = await evaluateExpression(expressionAst.value, environment);
            
            if (typeof result !== 'number') {
                throw new Error('Only number templates are allowed currently.');
            }
            
            result = {
                type: 'number',
                text: '' + result,
                offset: expressionAst.value.offset,
                line: expressionAst.value.line,
                col: expressionAst.value.col
            };
            break;
        }
        default: {
            throw new Error('Unknown AST type: ' + expressionAst.type);
        }
    }
    
    return result;
}

async function getFromEnvironment(environment, name) {
    let result;
    
    if (typeof environment === 'function') {
        result = await Promise.resolve(environment(name));
    }
    else {
        result = environment[name];
    }
    
    return result;
}

async function evaluateExpression(expressionAst, environment) {
    let result;
    
    switch (expressionAst.type) {
        case 'number': {
            result = evaluateNumber(expressionAst.text);
            break;
        }
        case 'symbol': {
            result = await getFromEnvironment(environment, expressionAst.text);
            
            if (result === undefined) {
                throw new Error(
                        `No symbol ${JSON.stringify(expressionAst.text)}.`);
            }
            
            break;
        }
        case 'parenthetical': {
            result = await evaluateExpression(expressionAst.value, environment);
            break;
        }
        case 'call': {
            const fn = await evaluateExpression(
                    expressionAst.function, environment);
            
            if (typeof fn !== 'function') {
                throw new Error('Not a function.');
            }
            
            const args = [];
            for (let i = 0; i < expressionAst.arguments.arguments.length; i++) {
                args.push(await evaluateExpression(
                        expressionAst.arguments.arguments[i],
                        environment));
            }
            
            result = await fn(...args);
            break;
        }
        case 'binaryOp': {
            result = await evaluateBinop(expressionAst, environment);
            break;
        }
        case 'template': {
            throw new Error('Template expression not permitted here.');
        }
        default: {
            throw new Error('Unknown AST type: ' + expressionAst.type);
        }
    }
    
    return result;
}

async function evaluateBinop(expressionAst, environment) {
    const left = await evaluateExpression(expressionAst.left, environment);
    const right = await evaluateExpression(expressionAst.right, environment);

    let result;
    switch (expressionAst.operator.value) {
        case '+': {
            result = left + right;
            break;
        }
        case '-': {
            result = left - right;
            break;
        }
        case '*': {
            result = left * right;
            break;
        }
        case '/': {
            result = left / right;
            break;
        }
        case '^': {
            result = left ^ right;
            break;
        }
        default: {
            throw new Error(
                    'Unknown operator: ' + expressionAst.operator.value);
        }
    }
    
    return result;
}

function evaluateNumber(numberString) {
    let number = Number.parseFloat(numberString);
    
    switch (numberString.charAt(numberString.length - 1)) {
        case 'b': {
            number *= 1000000000;
            break;
        }
        case 'm': {
            number *= 1000000;
            break;
        }
        case 'k': {
            number *= 1000;
            break;
        }
        default: {
            // No problem, just leave the number alone.
            break;
        }
    }
    
    return number;
}
