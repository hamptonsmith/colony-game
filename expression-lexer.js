const moo = require('moo');

module.exports = moo.compile({
    ws: { match: /[ \t\n]+/, lineBreaks: true },
    num: /(?:\d*\.\d+|\d+)(?:k|m|b)?/,
    word: /%?[A-Za-z]\w*/,
    caret: '^',
    star: '*',
    slash: '/',
    plus: '+',
    minus: '-',
    comma: ',',
    openParen: '(',
    closeParen: ')',
    openTemplate: '{{',
    closeTemplate: '}}'
});

// Stolen from https://github.com/no-context/moo/issues/81 to skip whitespace
module.exports.next = (next => () => {
    let tok;
    while ((tok = next.call(module.exports)) && tok.type === "ws") {}
    return tok;
})(module.exports.next);
