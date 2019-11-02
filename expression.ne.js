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
    {"name": "expression$subexpression$1", "symbols": ["or"]},
    {"name": "expression$subexpression$1", "symbols": ["if"]},
    {"name": "expression", "symbols": ["expression$subexpression$1"], "postprocess": ([[exp]]) => exp},
    {"name": "if$ebnf$1$subexpression$1", "symbols": ["or", {"literal":"if"}, "or", {"literal":","}]},
    {"name": "if$ebnf$1", "symbols": ["if$ebnf$1$subexpression$1"]},
    {"name": "if$ebnf$1$subexpression$2", "symbols": ["or", {"literal":"if"}, "or", {"literal":","}]},
    {"name": "if$ebnf$1", "symbols": ["if$ebnf$1", "if$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "if", "symbols": ["if$ebnf$1", "or", {"literal":"otherwise"}], "postprocess":  ([ifs,otherwise]) => ({
            type: 'if',
            conditionalBranches: ifs.map(([value,,condition]) => ({
                condition: condition,
                value: value
            })),
            otherwise: otherwise
        })},
    {"name": "or$macrocall$2", "symbols": ["and"]},
    {"name": "or$macrocall$3$subexpression$1", "symbols": [{"literal":"or"}]},
    {"name": "or$macrocall$3", "symbols": ["or$macrocall$3$subexpression$1"]},
    {"name": "or$macrocall$1$ebnf$1", "symbols": []},
    {"name": "or$macrocall$1$ebnf$1$subexpression$1", "symbols": ["or$macrocall$3", "or$macrocall$2"]},
    {"name": "or$macrocall$1$ebnf$1", "symbols": ["or$macrocall$1$ebnf$1", "or$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "or$macrocall$1", "symbols": ["or$macrocall$2", "or$macrocall$1$ebnf$1"], "postprocess": parse => binaryOp(parse)},
    {"name": "or", "symbols": ["or$macrocall$1"], "postprocess": ([or]) => or},
    {"name": "and$macrocall$2", "symbols": ["not"]},
    {"name": "and$macrocall$3$subexpression$1", "symbols": [{"literal":"and"}]},
    {"name": "and$macrocall$3", "symbols": ["and$macrocall$3$subexpression$1"]},
    {"name": "and$macrocall$1$ebnf$1", "symbols": []},
    {"name": "and$macrocall$1$ebnf$1$subexpression$1", "symbols": ["and$macrocall$3", "and$macrocall$2"]},
    {"name": "and$macrocall$1$ebnf$1", "symbols": ["and$macrocall$1$ebnf$1", "and$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "and$macrocall$1", "symbols": ["and$macrocall$2", "and$macrocall$1$ebnf$1"], "postprocess": parse => binaryOp(parse)},
    {"name": "and", "symbols": ["and$macrocall$1"], "postprocess": ([and]) => and},
    {"name": "not$ebnf$1$subexpression$1", "symbols": [{"literal":"not"}]},
    {"name": "not$ebnf$1", "symbols": ["not$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "not$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "not", "symbols": ["not$ebnf$1", "compare"], "postprocess":  ([not, compare]) => {
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
        }},
    {"name": "compare$macrocall$2", "symbols": ["add"]},
    {"name": "compare$macrocall$3$subexpression$1", "symbols": [{"literal":"="}]},
    {"name": "compare$macrocall$3$subexpression$1", "symbols": [{"literal":"<="}]},
    {"name": "compare$macrocall$3$subexpression$1", "symbols": [{"literal":"<"}]},
    {"name": "compare$macrocall$3$subexpression$1", "symbols": [{"literal":">"}]},
    {"name": "compare$macrocall$3$subexpression$1", "symbols": [{"literal":">="}]},
    {"name": "compare$macrocall$3", "symbols": ["compare$macrocall$3$subexpression$1"]},
    {"name": "compare$macrocall$1$ebnf$1", "symbols": []},
    {"name": "compare$macrocall$1$ebnf$1$subexpression$1", "symbols": ["compare$macrocall$3", "compare$macrocall$2"]},
    {"name": "compare$macrocall$1$ebnf$1", "symbols": ["compare$macrocall$1$ebnf$1", "compare$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "compare$macrocall$1", "symbols": ["compare$macrocall$2", "compare$macrocall$1$ebnf$1"], "postprocess": parse => binaryOp(parse)},
    {"name": "compare", "symbols": ["compare$macrocall$1"], "postprocess": ([compare]) => compare},
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
    {"name": "power$macrocall$3$subexpression$1", "symbols": [{"literal":"^"}]},
    {"name": "power$macrocall$3", "symbols": ["power$macrocall$3$subexpression$1"]},
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
    {"name": "bounded", "symbols": [{"literal":"true"}], "postprocess":  (t) => ({
            type: 'literal',
            value: true,
            offset: t.offset,
            line: t.line,
            col: t.col
        })},
    {"name": "bounded", "symbols": [{"literal":"false"}], "postprocess":  (t) => ({
            type: 'literal',
            value: false,
            offset: t.offset,
            line: t.line,
            col: t.col
        })},
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
