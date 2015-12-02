app.controller("singleEditorCtrl", [
    '$scope', '$http', 'Schemaservice', function ($scope, $http, Schemaservice) {
        var vm = this;

        vm.generateSchema = function () {
            trigger(Generate_Schema, window.editors['json-editor']);
        }

        vm.validateSchema = function () {
            trigger(Validate_Schema, window.editors['json-editor']);
        }

        function run() {
            on(Editor_Created, function (editor) {
                editor = window.editors['json-editor'];
                editor.setOption("enableBasicAutocompletion", true);
            });
            on(Generate_Schema_Requested, vm.generateSchema);
            on(Validate_Schema_Requested, vm.validateSchema);
        }

        run();
    }
]);