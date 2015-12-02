window.editors = {};
window.Editors_Initialized = 'editorsInitialized';
window.Editor_Created = 'editorCreated';
window.Generate_Schema = 'generateSchema';
window.Generate_Schema_Requested = 'generateSchemaRequested';
window.Validate_Schema = 'validateSchema';
window.Validate_Schema_Requested = 'validateSchemaRequested';

function beautify(jsonStr) {
    try {
        var json = JSON.parse(jsonStr);
        var beautyJson = JSON.stringify(json, null, 4);
        return beautyJson;
    } catch (e) {
        return jsonStr;
    }
}

function isValidJSON(json) {
    try {
        angular.fromJson(json);
    } catch (e) {
        return false;
    }

    return true;
};