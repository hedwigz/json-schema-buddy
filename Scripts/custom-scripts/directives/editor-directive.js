app.directive("editor", function () {
    return {
        compile: function (tElem, attrs) {
            return function (scope, elem, attrs) {
                // create the editor
                var editor = ace.edit(elem[0]);
                // config json style and theme
                editor.setOptions({
                    theme: "ace/theme/monokai",
                    mode: "ace/mode/json",
                    showPrintMargin: false
                });

                // Ctrl-S downloads the file.
                editor.commands.addCommand({
                    name: "save-command",
                    bindKey: { win: "Ctrl-S", mac: "Command-S" },
                    exec: function (editor) {
                        var text = editor.getValue();
                        var pom = document.createElement('a');
                        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                        // TODO: find suitable name for downloaded file.
                        pom.setAttribute('download', 'content.json');
                        pom.style.display = 'none';
                        document.body.appendChild(pom);
                        pom.click();
                        document.body.removeChild(pom);
                    }
                });
                // F5 command. (is set by eval)
                if (attrs["f5"] != null) {
                    editor.commands.addCommand({
                        name: "f5-command",
                        bindKey: { win: "F5", mac: "F5" },
                        exec: function (editor) {
                            scope.$eval(attrs["f5"]);
                        }
                    });
                }

                // F6 command. (is set by eval)
                if (attrs["f6"] != null) {
                    editor.commands.addCommand({
                        name: "f6-command",
                        bindKey: { win: "F6", mac: "F6" },
                        exec: function (editor) {
                            scope.$eval(attrs["f6"]);
                        }
                    });
                }
                // Ctrl-Shift-K beautify/prettify/format json.
                editor.commands.addCommand({
                    name: "beautify",
                    bindKey: { win: "Ctrl-Shift-K", mac: "Command-Shift-K" },
                    exec: function (editor) {
                        var val = editor.session.getValue();
                        editor.setValue(beautify(val), -1);
                    }
                });

                // Ctrl-D copies current line downwards.
                editor.commands.addCommand({
                    name: "Copy-Lines-Down",
                    bindKey: { win: "Ctrl-D", mac: "Command-D" },
                    exec: function (editor) {
                        editor.commands.exec("copylinesdown", editor);
                    }
                });

                // launch autocomplete after (almost) every keyboard event.
                editor.commands.on("afterExec", function (e) {
                    if (e.command.name == "insertstring" && /^[\w.]$/.test(e.args)) {
                        editor.execCommand("startAutocomplete");
                    }
                });

                // save the editors globally.
                window.editors[attrs['id']] = editor;

                trigger(Editor_Created, editor);
            };
        }
    };
});
