app = angular.module('schemaApp', ['ngRoute']);

var arrayOptionsEnum = {
    singleSchema: 'singleSchema',
    arraySchema: 'schemaArray',
    emptySchema: 'emptySchema',
    anyOf: 'anyOf',
    oneOf: 'oneOf',
    allOf: 'allOf'
};

app.constant('ArrayOptions', arrayOptionsEnum);
app.constant('Specification', 'http://json-schema.org/draft-04/schema#');

var default_options = {
    url: 'http://JschemaBuddy.net',
    // Array options.
    arrayOptions: arrayOptionsEnum.arraySchema,
    // General options.
    includeDefaults: false,
    includeEnums: false,
    forceRequired: true,
    absoluteIds: true,
    numericVerbose: false,
    stringsVerbose: false,
    objectsVerbose: false,
    arraysVerbose: false,
    metadataKeywords: false,
    additionalItems: true,
    additionalProperties: true
}

// User starts with default options.
var user_defined_options = angular.copy(default_options);

app.value('user_defined_options', user_defined_options);
app.value('default_options', default_options);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/Json/', {
        templateUrl: '/Views/JsonOnly.html',
        controller: 'singleEditorCtrl',
        controllerAs: 'vm'
    }).otherwise({
        templateUrl: '/Views/MainPage.html',
        controller: 'mainCtrl',
        controllerAs: 'ctrl'
    });
}]);
