// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "expression", "symbols": ["add"], "postprocess": ([exp]) => exp},
    {"name": "add$macrocall$2", "symbols": ["mult"]},
    {"name": "add$macrocall$3$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "add$macrocall$3$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "add$macrocall$3", "symbols": ["add$macrocall$3$subexpression$1"]},
    {"name": "add$macrocall$1$ebnf$1", "symbols": []},
    {"name": "add$macrocall$1$ebnf$1$subexpression$1", "symbols": ["add$macrocall$3", "add$macrocall$2"]},
    {"name": "add$macrocall$1$ebnf$1", "symbols": ["add$macrocall$1$ebnf$1", "add$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "add$macrocall$1", "symbols": ["add$macrocall$2", "add$macrocall$1$ebnf$1"], "postprocess": parse => binaryOp(parse)},
    {"name": "add", "symbols": ["add$macrocall$1"], "postprocess": ([add]) => add},
    {"name": "mult$macrocall$2", "symbols": ["power"]},
    {"name": "mult$macrocall$3$subexpression$1", "symbols": [{"literal":"*"}]},
    {"name": "mult$macrocall$3$subexpression$1", "symbols": [{"literal":"/"}]},
    {"name": "mult$macrocall$3", "symbols": ["mult$macrocall$3$subexpression$1"]},
    {"name": "mult$macrocall$1$ebnf$1", "symbols": []},
    {"name": "mult$macrocall$1$ebnf$1$subexpression$1", "symbols": ["mult$macrocall$3", "mult$macrocall$2"]},
    {"name": "mult$macrocall$1$ebnf$1", "symbols": ["mult$macrocall$1$ebnf$1", "mult$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "mult$macrocall$1", "symbols": ["mult$macrocall$2", "mult$macrocall$1$ebnf$1"], "postprocess": parse => binaryOp(parse)},
    {"name": "mult", "symbols": ["mult$macrocall$1"], "postprocess": ([mult]) => mult},
    {"name": "power$macrocall$2", "symbols": ["chained"]},
    {"name": "power$macrocall$3", "symbols": [{"literal":"^"}]},
    {"name": "power$macrocall$1$ebnf$1", "symbols": []},
    {"name": "power$macrocall$1$ebnf$1$subexpression$1", "symbols": ["power$macrocall$3", "power$macrocall$2"]},
    {"name": "power$macrocall$1$ebnf$1", "symbols": ["power$macrocall$1$ebnf$1", "power$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "power$macrocall$1", "symbols": ["power$macrocall$2", "power$macrocall$1$ebnf$1"], "postprocess": parse => binaryOp(parse)},
    {"name": "power", "symbols": ["power$macrocall$1"], "postprocess": ([power]) => power},
    {"name": "chained$ebnf$1", "symbols": []},
    {"name": "chained$ebnf$1", "symbols": ["chained$ebnf$1", "arguments"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "chained", "symbols": ["bounded", "chained$ebnf$1"], "postprocess":  ([bounded, callChain]) => {
            let result = bounded;
            
            for (let i = 0; i < callChain.length; i++) {
                result = {
                    type: 'call',
                    function: result,
                    arguments: callChain[i]
                };
            }
            
            return result;
        }},
    {"name": "arguments$ebnf$1", "symbols": ["argList"], "postprocess": id},
    {"name": "arguments$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "arguments", "symbols": [{"literal":"("}, "arguments$ebnf$1", {"literal":")"}], "postprocess":  ([open, args]) => ({
            type: 'arguments',
            arguments: args,
            offset: open.offset,
            line: open.line,
            col: open.col
        })},
    {"name": "argList$ebnf$1", "symbols": []},
    {"name": "argList$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "expression"]},
    {"name": "argList$ebnf$1", "symbols": ["argList$ebnf$1", "argList$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "argList", "symbols": ["expression", "argList$ebnf$1"], "postprocess":  ([first, rest]) => {
            const result = [first];
            rest.forEach(([,other]) => {
                result.push(other);
            });
            return result;
        }},
    {"name": "bounded", "symbols": ["symbol"], "postprocess": ([symbol]) => symbol},
    {"name": "bounded", "symbols": ["number"], "postprocess": ([number]) => number},
    {"name": "bounded", "symbols": [{"literal":"("}, "expression", {"literal":")"}], "postprocess":  ([open, expression]) => ({
            type: 'parenthetical',
            value: expression,
            offset: open.offset,
            line: open.line,
            col: open.col
        })},
    {"name": "bounded", "symbols": [{"literal":"{{"}, "expression", {"literal":"}}"}], "postprocess":  ([open, expression]) => ({
            type: 'template',
            value: expression,
            offset: open.offset,
            line: open.line,
            col: open.col
        })},
    {"name": "symbol", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess":  ([word]) => ({
            type: 'symbol',
            text: word.text,
            offset: word.offset,
            line: word.line,
            col: word.col
        })},
    {"name": "number", "symbols": [(lexer.has("num") ? {type: "num"} : num)], "postprocess":  ([num]) => ({
            type: 'number',
            text: num.text,
            offset: num.offset,
            line: num.line,
            col: num.col
        })}
]
  , ParserStart: "expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
