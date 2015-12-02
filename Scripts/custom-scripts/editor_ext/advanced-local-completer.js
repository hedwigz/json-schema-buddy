// The advanced local completer is basically like the local completer but on another ace-editor-session
// this way, we can share completion between the schema and the json editors.
// the code is taken from the source of ace editor local completer with slight modification
var Range = ace.require('ace/range').Range;
var AdvancedLocalCompleter = function (otherSession) {
    this.otherSession = otherSession;
    this.splitRegex = /[^a-zA-Z_0-9\$\-\u00C0-\u1FFF\u2C00-\uD7FF\w]+/;
}

AdvancedLocalCompleter.prototype.getWordIndex = function (doc, pos) {
    var textBefore = doc.getTextRange(Range.fromPoints({ row: 0, column: 0 }, pos));
    return textBefore.split(this.splitRegex).length - 1;
}

AdvancedLocalCompleter.prototype.wordDistance = function (doc, pos) {
    var prefixPos = this.getWordIndex(doc, pos);
    var words = doc.getValue().split(this.splitRegex);
    var wordScores = Object.create(null);

    var currentWord = words[prefixPos];

    words.forEach(function (word, idx) {
        if (!word || word === currentWord) return;

        var distance = Math.abs(prefixPos - idx);
        var score = words.length - distance;
        if (wordScores[word]) {
            wordScores[word] = Math.max(score, wordScores[word]);
        } else {
            wordScores[word] = score;
        }
    });
    return wordScores;
}

AdvancedLocalCompleter.prototype.getCompletions = function (editor, session, pos, prefix, callback) {
    var wordScore = this.wordDistance(this.otherSession, pos, prefix);
    var wordList = Object.keys(wordScore);
    callback(null, wordList.map(function (word) {
        return {
            caption: word,
            value: word,
            score: wordScore[word],
            meta: "local"
        };
    }));
};