@{%
    const lexer = require('./expression-lexer.js');
    
    function binaryOp([[first], others]) {
        let result = first;
        
        others.forEach(([[[operator]], [operand]]) => {
            result = {
                type: 'binaryOp',
                operator: operator,
                left: result,
                right: operand
            };
        });
        
        return result;
    }
%}

@lexer lexer

expression -> add {% ([exp]) => exp %}

binop[NEXT, OP] -> $NEXT ($OP $NEXT):* {% parse => binaryOp(parse) %}

add   -> binop[mult, ("+" | "-")] {% ([add]) => add %}
mult  -> binop[power, ("*" | "/")] {% ([mult]) => mult %}
power -> binop[chained, "^"] {% ([power]) => power %}

chained -> bounded arguments:* {% ([bounded, callChain]) => {
    let result = bounded;
    
    for (let i = 0; i < callChain.length; i++) {
        result = {
            type: 'call',
            function: result,
            arguments: callChain[i]
        };
    }
    
    return result;
}%}

arguments -> "(" argList:? ")" {% ([open, args]) => ({
    type: 'arguments',
    arguments: args,
    offset: open.offset,
    line: open.line,
    col: open.col
})%}

argList -> expression ("," expression):* {% ([first, rest]) => {
    const result = [first];
    rest.forEach(([,other]) => {
        result.push(other);
    });
    return result;
}%}

bounded ->
    symbol {% ([symbol]) => symbol %}
  | number {% ([number]) => number %}
  | "(" expression ")" {% ([open, expression]) => ({
        type: 'parenthetical',
        value: expression,
        offset: open.offset,
        line: open.line,
        col: open.col
    })%}
  | "{{" expression "}}" {% ([open, expression]) => ({
        type: 'template',
        value: expression,
        offset: open.offset,
        line: open.line,
        col: open.col
    })%}

symbol -> %word {% ([word]) => ({
    type: 'symbol',
    text: word.text,
    offset: word.offset,
    line: word.line,
    col: word.col
})%}

number -> %num {% ([num]) => ({
    type: 'number',
    text: num.text,
    offset: num.offset,
    line: num.line,
    col: num.col
})%}
