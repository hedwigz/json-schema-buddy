'use strict';

angular.module('schemaApp')
    .factory('Schemafactory', ['$log', 'Utility',
        function ($log, Utility) {

            /**
            * Note that this function does not check user_defined_options.
            * It just sets all data that we know of now, or can deduce.
            * For example, we set name, title and description whether or not
            * user_defined_options.metadataKeywords is true.
            */
            var Schema = function (aKey, aValue) {

                var isPrimitiveType = (
                    (!angular.isArray(aValue)) && (!angular.isObject(aValue))
                );

                // Root object's key is undefined.
                this.root = !angular.isDefined(aKey);
                // These values are copied from 'src' to 'dst' in Schemaservice.
                this.key = this.root ? '/' : String(aKey);
                this.id = this.root ? user_defined_options.url : String(aKey);
                this.type = Utility.getType(aValue);
                this.title = this.root ? 'Root schema.' : String(aKey)[0].toUpperCase() + String(aKey).slice(1) + ' schema.';
                this.description = 'An explanation about the puropose of this instance described by this schema.';
                this.name = this.root ? '/' : String(aKey);
                if (isPrimitiveType) {
                    this.defaultValue = aValue;
                }

                this.subSchemas = [];
            };

            Schema.prototype.addSubSchema = function (aSchema) {
                this.subSchemas.push(aSchema);
                // Allow sub-schemas to reference parent schemas.
                aSchema.parent = this;
            };

            Schema.prototype.isObject = function (aSchema) {
                return this.type === 'object';
            };

            Schema.prototype.isArray = function (aSchema) {
                return this.type === 'array';
            };

            Schema.prototype.isString = function (aSchema) {
                return this.type === 'string';
            };

            Schema.prototype.isNumber = function (aSchema) {
                return (this.type === 'number');
            };

            Schema.prototype.isInteger = function (aSchema) {
                return (this.type === 'integer');
            };

            return {
                getInstance: function (aKey, aValue) {
                    return new Schema(aKey, aValue);
                }
            };
        }
    ]);


// MUST be a schema or an array of schemas.

/*
            A schema for an array can be:

                1. An empty schema: allows any value for items in the instance array. This should be the default.
                2. An attribute value: all the items in the array MUST be valid according to the schema.
                3. An array of schemas: each position in the instance array MUST conform to the schema in the corresponding position for this array. Called tuple typing.
            */
