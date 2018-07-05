// a completer that returns possible json-schema keywords.

var json_schema_completer = {
    getCompletions: function (editor, session, pos, prefix, callback) {
        if (prefix.length === 0) {
            callback(null, []);
            return;
        } else {
            var json_schema = "json-schema";
            callback(null, [
                { name: "type", value: "type", score: 20, meta: json_schema },
                { name: "id", value: "id", score: 20, meta: json_schema },
                { name: "string", value: "string", score: 20, meta: json_schema },
                { name: "number", value: "number", score: 20, meta: json_schema },
                { name: "integer", value: "integer", score: 20, meta: json_schema },
                { name: "object", value: "object", score: 20, meta: json_schema },
                { name: "array", value: "array", score: 20, meta: json_schema },
                { name: "boolean", value: "boolean", score: 20, meta: json_schema },
                { name: "null", value: "null", score: 20, meta: json_schema },
                { name: "required", value: "required", score: 20, meta: json_schema },
                { name: "format", value: "format", score: 20, meta: json_schema },
                { name: "$schema", value: "$schema", score: 20, meta: json_schema },
                { name: "minimum", value: "minimum", score: 20, meta: json_schema },
                { name: "maximum", value: "maximum", score: 20, meta: json_schema },
                { name: "minLength", value: "minLength", score: 20, meta: json_schema },
                { name: "maxLength", value: "maxLength", score: 20, meta: json_schema },
                { name: "date-time", value: "date-time", score: 20, meta: json_schema },
                { name: "email", value: "email", score: 20, meta: json_schema },
                { name: "hostname", value: "hostname", score: 20, meta: json_schema },
                { name: "ipv4", value: "ipv4", score: 20, meta: json_schema },
                { name: "ipv6", value: "ipv6", score: 20, meta: json_schema },
                { name: "uri", value: "uri", score: 20, meta: json_schema },
                { name: "multipleOf", value: "multipleOf", score: 20, meta: json_schema },
                { name: "exclusiveMaximum", value: "exclusiveMaximum", score: 20, meta: json_schema },
                { name: "exclusiveMinimum", value: "exclusiveMinimum", score: 20, meta: json_schema },
                { name: "properties", value: "properties", score: 20, meta: json_schema },
                { name: "enum", value: "enum", score: 20, meta: json_schema },
                { name: "additionalProperties", value: "additionalProperties", score: 20, meta: json_schema },
                { name: "true", value: "true", score: 20, meta: json_schema },
                { name: "false", value: "false", score: 20, meta: json_schema },
                { name: "minProperties", value: "minProperties", score: 20, meta: json_schema },
                { name: "maxProperties", value: "maxProperties", score: 20, meta: json_schema },
                { name: "minItems", value: "minItems", score: 20, meta: json_schema },
                { name: "maxItems", value: "maxItems", score: 20, meta: json_schema },
                { name: "uniqueItems", value: "uniqueItems", score: 20, meta: json_schema },
                { name: "default", value: "default", score: 20, meta: json_schema },
                { name: "$ref", value: "$ref", score: 20, meta: json_schema },
                { name: "pattern", value: "pattern", score: 20, meta: json_schema },
                { name: "anyOf", value: "anyOf", score: 20, meta: json_schema }
            ]);
        }
    }
};
