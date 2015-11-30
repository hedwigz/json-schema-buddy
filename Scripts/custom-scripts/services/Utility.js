'use strict';

angular.module('schemaApp')
    .service('Utility', function Utility() {
        // AngularJS will instantiate a singleton by calling "new" on this function
        //

        this.getType = function (aValue) {

            var type = undefined;

            if (angular.isArray(aValue)) {
                type = 'array';
            } else if (angular.isObject(aValue)) {
                type = 'object';
            } else if (angular.isNumber(aValue)) {
                var isInt = (aValue % 1 === 0);
                if (isInt) {
                    type = 'integer';
                } else {
                    type = 'number';
                }
            } else if (angular.isString(aValue)) {
                type = 'string';
            } else if (null === aValue) {
                type = 'null';
            } else if (typeof aValue == 'boolean') {
                type = 'boolean';
            }
            return type;
        };

        this.getEmptySchema = function () {
            var schmea = {};
            var key = 'auto-generated-schema-' + Math.floor((Math.random() * 1000) + 1);

            schmea.__key__ = key;
            schmea.id = key;

            if (user_defined_options.metadataKeywords) {
                schmea.title = String(key)[0].toUpperCase() + String(key).slice(1) + ' schema.';
                schmea.description = 'An explanation about the puropose of this instance described by this schema.';
                schmea.name = String(key);
            }

            return schmea;
        }
    });
