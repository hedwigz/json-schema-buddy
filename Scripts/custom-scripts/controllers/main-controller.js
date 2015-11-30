// controller for main page.
app.controller("mainCtrl", ['$scope', '$http', 'Schemaservice', function ($scope, $http, Schemaservice) {
    var vm = this;
    // whether to show the json editor (false if dual monitors is activated)
    vm.showJsonEditor = true;

    // Activate dual monitors - open a new tab and bind to some of it's events.
    vm.openChildWindow = function () {
        vm.showJsonEditor = false;
        // Open a new tab with only json editor in it and pass the text in the url value.
        var childWindow = window.open(window.location.href + "#/Json/");
        vm.childWindow = childWindow;
        // when message is sent from that windows it means that it's initialized
        childWindow.addEventListener('message', function (event) {
            // bind to Generate_Schema event (triggered when F5 is clicked in the tab)
            childWindow.on(Generate_Schema, function (jsonEditor) {
                var jsonStr = jsonEditor.getValue();
                if (isValidJSON(jsonStr)) {
                    vm.generateSchemas(jsonStr);
                } else {
                    toastr['error']('Your json is not valid');
                }
            });
            // bind to Validate_Schema event (triggered when F6 is clicked in the tab)
            childWindow.on(Validate_Schema, function (jsonEditor) {
                var schemaEditor = vm.schemaEditor;
                vm.validateSchemas(jsonEditor, schemaEditor);
            });
            // make sure this window is aware of the new editor.
            trigger(Editor_Created, childWindow.editors['json-editor']);

            childWindow.on(Editor_Created, function () {
                childWindow.editors['json-editor'].setValue(vm.jsonEditor.getValue(), -1)
            });
            // make sure the new windows is aware of the schema-editor.
            childWindow.trigger(Editor_Created, vm.schemaEditor);
        });
    }

    vm.generateSchema = function () {
        if (vm.showJsonEditor) {
            var jsonEditor = vm.jsonEditor;
            var jsonStr = jsonEditor.getValue();
            if (isValidJSON(jsonStr)) {
                vm.generateSchemas(jsonStr);
            } else {
                toastr['error']('Your json is not valid');
            }
        } else {
            vm.childWindow.trigger(Generate_Schema_Requested);
        }
    };

    vm.generateSchemas = function (jsonStr) {
        vm.user_defined_options.json = JSON.parse(jsonStr);
        Schemaservice.JSON2Schema();
        var finalSchema = Schemaservice.schema;
        var schemaEditor = vm.schemaEditor;
        schemaEditor.setValue(beautify(JSON.stringify(finalSchema)), -1);
    }

    vm.validateSchema = function () {
        if (vm.showJsonEditor) {
            vm.validateSchemas(vm.jsonEditor, vm.schemaEditor);
        } else {
            vm.childWindow.trigger(Validate_Schema_Requested);
        }
    };

    vm.validateSchemas = function (jsonEditor, schemaEditor) {     
        var jsonS = jsonEditor.getValue();
        var schemaS = schemaEditor.getValue();
        if (!isValidJSON(jsonS)) {
            toastr['error']('json syntax error');
            return;
        }
        if (!isValidJSON(schemaS)) {
            toastr['error']('schema syntax error');
            return;
        }
        var jsonO = JSON.parse(jsonS);
        var schemaO = JSON.parse(schemaS);

        var valid = tv4.validate(jsonO, schemaO);
        if (valid) {
            toastr['success']('Validation passed successfully', 'Json Schema');
        } else {
            toastr['error']('Validation Failed:\nmessage: ' + tv4.error.message + '\ndata path: ' + tv4.error.dataPath + '\nschema path: ' + tv4.error.schemaPath);
        }
    }

    vm.toggleOptions = function () {
        $('#OptionsModal').modal('toggle');
    };

    function run() {

        vm.user_defined_options = user_defined_options;

        window.on(window.Editors_Initialized, function () {
            vm.schemaEditor = window.editors['schema-editor'];
            vm.jsonEditor = window.editors['json-editor'];
            for (key in window.editors) {
                if (window.editors.hasOwnProperty(key)) {
                    var editor = window.editors[key];
                    var beauty = beautify(editor.getValue());
                    editor.setValue(beauty, -1);
                    editor.setOption("enableBasicAutocompletion", true);
                }
            }
        });

    }

    run();
}]);