// this logic looks at the current object you are working on (in the schema editor)
// and marks the corresponding object name in the json editor.

$(document).ready(function () {
    on(window.Editors_Initialized, function () {
        var jsonEditor = window.editors['json-editor'];
        var schemaEditor = window.editors['schema-editor'];

        schemaEditor.getSession().selection.on('changeCursor', function () {
            try {
                var objectStart = schemaEditor.find('{', {
                    backwards: true,
                    wrap: false,
                    caseSensitive: false,
                    wholeWord: false,
                    regExp: false,
                    preventScroll: true
                });

                var objectNameRange = schemaEditor.find('".*"', {
                    backwards: true,
                    wrap: false,
                    start: objectStart.start,
                    caseSensitive: false,
                    wholeWord: false,
                    regExp: true,
                    preventScroll: true
                });

                var objectName = schemaEditor.session.getTextRange(objectNameRange);
                if (objectName != null && objectName != '') {
                    jsonEditor.findAll(objectName + ".*", {
                        backwards: false,
                        wrap: true,
                        caseSensitive: true,
                        wholeWord: false,
                        regExp: true,
                        preventScroll: false
                    });
                }
            } catch (e) {

            }
        });
    });
});