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

expression -> (or | if) {% ([[exp]]) => exp %}

if -> (or "if" or ","):+ or "otherwise" {% ([ifs,otherwise]) => ({
    type: 'if',
    conditionalBranches: ifs.map(([value,,condition]) => ({
        condition: condition,
        value: value
    })),
    otherwise: otherwise
})%}

binop[NEXT, OP] -> $NEXT ($OP $NEXT):* {% parse => binaryOp(parse) %}

or      -> binop[and, ("or")] {% ([or]) => or %}
and     -> binop[not, ("and")] {% ([and]) => and %}

not -> ("not"):? compare {% ([not, compare]) => {
    let result = compare;
    
    if (not) {
        result = {
            type: 'not',
            value: result,
            offset: not.offset,
            line: not.line,
            col: not.col
        };
    }
    
    return result;
}%}

compare -> binop[add, ("=" | "<=" | "<" | ">" | ">=")]
           {% ([compare]) => compare %}
add     -> binop[mult, ("+" | "-")] {% ([add]) => add %}
mult    -> binop[power, ("*" | "/")] {% ([mult]) => mult %}
power   -> binop[chained, ("^")] {% ([power]) => power %}

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
  | "true" {% (t) => ({
        type: 'literal',
        value: true,
        offset: t.offset,
        line: t.line,
        col: t.col
    })%}
  | "false" {% (t) => ({
        type: 'literal',
        value: false,
        offset: t.offset,
        line: t.line,
        col: t.col
    })%}
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
