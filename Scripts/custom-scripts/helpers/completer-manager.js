// add language completion extension
var langTools = ace.require("ace/ext/language_tools");

// reset default completers.
langTools.setCompleters([]);

// add json_schema completer.
langTools.addCompleter(json_schema_completer);

// counter used to count how many editors has been initialized.
var numOfEditors = 0;

window.on(Editor_Created, function (editor) {
    numOfEditors += 1;

    // add local completer to langTools.
    var localCompleter = new AdvancedLocalCompleter(editor.session);
    langTools.addCompleter(localCompleter);

    if (numOfEditors == 2) {
        // Notify both editors were created.
        window.trigger(window.Editors_Initialized);
    }
});