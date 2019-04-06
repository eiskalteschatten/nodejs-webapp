'use strict';

const marked  = require('marked');
const highlightjs  = require('highlight.js');

module.exports = {
    markdownToHtml,
    markdownToHtmlWithCodeHighlighting
};

function markdownToHtml(markdown) {
    return marked(markdown);
}

function markdownToHtmlWithCodeHighlighting(markdown) {
    marked.setOptions({
        highlight: code => {
            return highlightjs.highlightAuto(code).value;
        }
    });

    return marked(markdown);
}
