'use strict';

angular.module('schemaApp')
    .service('Schemaservice', ['$log', 'Schemafactory',
        'ArrayOptions', 'Specification', 'Utility',
        function Schemaservice($log, Schemafactory,
            ArrayOptions, Specification, Utility) {

            /* AngularJS will instantiate a singleton by calling "new"
            on this function. */

            var self = this;
            // Input JSON provided by user.
            this.json = {};
            this.intermediateResult = null;
            // Edit View schema (contains __meatadata__ properties).
            this.editableSchema = {};
            // Final JSON schema for use in Code View.
            this.schema = {};

            /**
            * Called from the Controller. Generates the schema.
            */
            this.JSON2Schema = function () {
                this.jsonString2EditableSchema();
                this.editableSchema2FinalSchema();
            };

            this.isValidJSON = function (json) {
                try {
                    angular.fromJson(json);
                } catch (e) {
                    return false;
                }

                return true;
            };

            /**
            * Sets up the nested structure of the schema. Any schema
            * properties that can be set, are. It uses the Schema class as a
            * model and is NOT a collection of raw JavaScript { } objects,
            * i.e. it's not actually a JSON schema.
            * Converts our custom Schema instances to real JavaScript objects.
            * __metadata__ keys are added at this point.
            */
            this.jsonString2EditableSchema = function () {
                try {
                    // Convert JSON string to JavaScript object.
                    self.json = angular.fromJson(user_defined_options.json);
                    /*
                    * Construct our own, custom, intermediate format that
                    * represents the hierarchy of parent / child schemas but
                    * not much else.
                    */
                    self.intermediateResult = self.schema4Object(undefined,
                    self.json);
                    /* Create real JavaScript obect, but not valid Schema since
                    objects contains all sorts of custom properties.*/
                    self.editableSchema = self.constructSchema(
                        self.intermediateResult);
                } catch (e) {

                }
            };

            /**
            * Copies JavaScript object for the editable view and starts the
            * process of producing a valid JSON Schema.
            */
            this.editableSchema2FinalSchema = function () {
                self.schema = angular.copy(self.editableSchema);
                this.clean(self.schema);
            };

            /**
            * This gets run every time the code view is selected!
            * ---------------------------------------------------
            * Takes any action on __metadata__ keys.
            * Tidy any properties, for example checking types.
            * Finally removes any __metadata__ properites.
            * The resulting JavaScript object is a valid JSON Schema.
            * @param {object} obj A copy of the pseudo JSON schema contining
                __metadata__.
            * @param {object} parent Parent JavaScript object used for setting
                up the 'required' property from __required__ metadata.
            */
            this.clean = function (obj) {
                var key = obj['__key__'];

                for (var k in obj) {
                    if (typeof obj[k] == "object" && obj[k] !== null) {
                        if (obj[k].__removed__) {
                            delete obj[k];
                            continue;
                        }
                        // Recursive call parsing in parent object this time.
                        //console.log(obj[k]);
                        this.clean(obj[k]);
                    }
                    else {
                        switch (String(k)) {
                            /*
                            Metadata keywords.
                            */
                            case '__required__':

                                var required = obj[k];
                                /*  console.log(obj[k].__key__);
                                  console.log(required);
                                  console.log(obj.__parent__);*/
                                var s = self.getSchema(obj.__parent__);

                                if (!s) {
                                    break;
                                }
                                if (required) {
                                    if (!s.required) {
                                        s.required = [];
                                    }
                                    s.required.push(key);
                                } else {
                                    if (s.required) {
                                        var index = s.required.indexOf(key);
                                        if (index > -1) {
                                            s.required.splice(index, 1);
                                        }
                                    }
                                }
                                break;
                            case '__removed__':
                                break;
                                /*
                                Keywords for arrays.
                                */
                            case 'maxItems':
                            case 'minItems':
                                break;
                            case 'uniqueItems':
                                var val = Boolean(obj[k]);
                                obj[k] = val;
                                if (!user_defined_options.arraysVerbose) {
                                    if (!val) {
                                        delete obj[k];
                                    }
                                }
                                break;
                            case 'additionalItems':
                                var val = Boolean(obj[k]);
                                obj[k] = val;
                                if (!user_defined_options.arraysVerbose) {
                                    if (val) {
                                        // true is default
                                        delete obj[k];
                                    }
                                }
                                break;
                                /*
                                Keywords for numeric instances (number and
                                integer).
                                */
                            case 'minimum':
                            case 'maximum':
                            case 'multipleOf':
                                var val = parseInt(obj[k]);
                                obj[k] = val;
                                if (!user_defined_options.numericVerbose) {
                                    // Only delete if defaut value.
                                    if (!val && val != 0) {
                                        delete obj[k];
                                    }
                                }
                                break;
                            case 'exclusiveMinimum':
                            case 'exclusiveMaximum':
                                var val = Boolean(obj[k]);
                                obj[k] = val;
                                if (!user_defined_options.numericVerbose) {
                                    if (!val) {
                                        delete obj[k];
                                    }
                                }
                                break;
                                /*
                                Metadata keywords.
                                */
                            case 'name':
                            case 'title':
                            case 'description':
                                var val = String(obj[k]).trim();
                                obj[k] = val;
                                if (!user_defined_options.metadataKeywords) {
                                    if (!val) {
                                        delete obj[k];
                                    }
                                }
                                break;
                                /*
                                Keywords for objects.
                                */
                            case 'additionalProperties':
                                var val = Boolean(obj[k]);
                                obj[k] = val;
                                if (!user_defined_options.objectsVerbose) {
                                    if (val) {
                                        // true is default
                                        delete obj[k];
                                    }
                                }
                                break;


                        }
                        // General logic.
                        // Remove __meta data__ from Code schema, but don't change
                        // editable schema.
                        var metaKey = k.match(/^__.*__$/g);
                        if (metaKey) {
                            delete obj[k];
                        }
                    }
                }
            };

            this.schema4Object = function (aKey, aValue) {

                var schema = Schemafactory.getInstance(aKey, aValue);

                angular.forEach(aValue, function (value, key) {
                    var subSchema = null;
                    if (angular.isArray(value) || angular.isObject(value)) {
                        // object, array
                        subSchema = self.schema4Object(key, value);
                    } else {
                        // number, integer, string, null, boolean
                        subSchema = Schemafactory.getInstance(key, value);
                    }
                    // This also sets the subSchema parent to schema.
                    schema.addSubSchema(subSchema);
                })
                return schema;
            };

            this.makeVerbose = function (src, dst) {

                switch (src.type) {
                    case 'array':
                        if (user_defined_options.arraysVerbose) {
                            dst.minItems = 1;
                            dst.uniqueItems = false;
                            dst.additionalItems = user_defined_options.additionalItems;
                        }
                        break;
                    case 'object':
                        if (user_defined_options.objectsVerbose) {
                            dst.additionalProperties = true;
                        }
                        break;
                    case 'integer':
                    case 'number':
                        if (user_defined_options.numericVerbose) {
                            dst.multipleOf = 1;
                            dst.maximum = 100;
                            dst.minimum = 1;
                            dst.exclusiveMaximum = false;
                            dst.exclusiveMinimum = false;
                        }
                        break;
                    case 'string':
                        if (user_defined_options.stringsVerbose) {
                            dst.minLength = 1;
                        }
                    case 'boolean':
                    case 'null':
                        break;
                }

                // Metadata keywords apply to all types.
                if (user_defined_options.metadataKeywords) {
                    dst.title = src.title;
                    dst.description = src.description;
                    dst.name = src.name;
                }
            };

            this.initObject = function (src, dst) {
                if (src.isObject()) {
                    dst.properties = {};

                    if (!user_defined_options.additionalProperties) {
                        // false is not default, so always show.
                        dst.additionalProperties = false;
                    } else {
                        // true is default, only show if objects are verbose.
                        if (user_defined_options.objectsVerbose) {
                            dst.additionalProperties = true;
                        }
                    }
                }
            };

            this.initArray = function (src, dst) {
                if (src.isArray()) {
                    switch (user_defined_options.arrayOptions) {

                        case ArrayOptions.emptySchema:
                            dst.items = {};
                            break;
                        case ArrayOptions.singleSchema:
                            dst.items = {};
                            break;

                        case ArrayOptions.arraySchema:
                            dst.items = [];
                            break;
                    }

                    if (!user_defined_options.additionalItems) {
                        // false is not default, so always show.
                        dst.additionalItems = false;
                    } else {
                        // true is default, only show if objects are verbose.
                        if (user_defined_options.arraysVerbose) {
                            dst.additionalItems = true;
                        }
                    }
                }
            };

            this.addDefault = function (src, dst) {
                if (user_defined_options.includeDefaults) {
                    if (!src.isObject() && !src.isArray()) {
                        // Only primitive types have default values.
                        dst.default = src.defaultValue;
                    }
                }
            };

            this.addEnums = function (src, dst) {
                if (user_defined_options.includeEnums) {
                    if (!src.isObject() && !src.isArray()) {
                        // Only primitive types have enums.
                        dst.enum = [null];

                        if (src.defaultValue) {
                            dst.enum.push(src.defaultValue);
                        }
                    }
                }
            };

            this.addRequired = function (src, dst) {
                dst.__required__ = user_defined_options.forceRequired;
            };

            this.setType = function (src, dst) {
                dst.type = src.type;
            };

            this.constructId = function (src, dst) {

                if (user_defined_options.absoluteIds) {
                    if (src.root) {
                        dst.id = user_defined_options.url;
                    } else {
                        /*
                        First time round, this will the child of root and will
                        be: (http://jsonschema.net + '/' + address)
                        */
                        var asboluteId = (src.parent.id + '/' + src.id);
                        dst.id = asboluteId;

                        // We MUST set the parent ID to the ABSOLUTE URL
                        // so when the child builds upon it, it too is an
                        // absolute URL.
                        /*
                        The current object will be a parent later on. By setting
                        src.id now, any children of this object will call
                        src.parent.id when constructing the absolute ID.
                        */
                        src.id = asboluteId;
                    }
                } else {
                    // Relative IDs
                    if (src.root) {
                        dst.id = '/';
                    } else {
                        dst.id = src.id;
                    }
                }

                dst.__key__ = src.key;
            };

            this.setSchemaRef = function (src, dst) {
                if (src.root) {
                    // Explicitly declare this JSON as JSON schema.
                    dst._$schema = Specification;
                    dst.__root__ = true;
                }
            }

            this.constructSchema = function (intermediate_schema) {
                var schema = {};

                /*
                Set as many values as possible now.
                */
                self.setSchemaRef(intermediate_schema, schema);
                self.constructId(intermediate_schema, schema);
                self.setType(intermediate_schema, schema);
                self.makeVerbose(intermediate_schema, schema);
                self.addDefault(intermediate_schema, schema);
                self.addEnums(intermediate_schema, schema);
                self.addRequired(intermediate_schema, schema);

                /*
                Subschemas last.
                Don't actually add any properties or items, just initialize
                the object properties so properties and items may be added.
                */
                self.initObject(intermediate_schema, schema);
                self.initArray(intermediate_schema, schema);

                // Schemas with no sub-schemas will just skip this loop and
                // return the { } object.
                angular.forEach(intermediate_schema.subSchemas, function (value, key) {

                    // Each sub-schema will need its own {} schema object.
                    var subSchema = self.constructSchema(value);
                    subSchema.__parent__ = schema.id;

                    if (intermediate_schema.isObject()) {
                        schema.properties[value.key] = subSchema;

                    } else if (intermediate_schema.isArray()) {

                        // TODO: Move to this.initItems()
                        switch (user_defined_options.arrayOptions) {

                            case ArrayOptions.emptySchema:
                                schema.items = Utility.getEmptySchema();
                                break;
                            case ArrayOptions.singleSchema:
                                schema.items = subSchema;
                                break;
                            case ArrayOptions.arraySchema:
                                //  Use array of schemas, however, still may only be one.
                                if (intermediate_schema.subSchemas.length > 1) {
                                    schema.items.push(subSchema);
                                } else {
                                    schema.items = subSchema;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });

                return schema;
            };

            this.removeSchemaById = function (obj, id) {

                for (var k in obj) {
                    if (typeof obj[k] == "object" && obj[k] !== null) {
                        this.removeSchemaById(obj[k], id);
                    }

                    switch (String(k)) {
                        case 'id':
                            if (obj[k] == id) {
                                obj.__removed__ = true;
                            }
                    }
                }
            };

            this.getSchemaById = function (obj, id) {

                for (var k in obj) {
                    if (typeof obj[k] == "object" && obj[k] !== null) {
                        var res = this.getSchemaById(obj[k], id);
                        if (res != null) {
                            return res;
                        }
                    }

                    switch (String(k)) {
                        case 'id':
                            if (obj[k] == id) {
                                return obj;
                            }
                    }
                }
            };

            this.removeSchema = function (id) {
                this.removeSchemaById(self.editableSchema, id);
            };

            this.getSchema = function (id) {
                return this.getSchemaById(self.schema, id);
            };

            this.getEditableSchema = function () {
                return self.editableSchema;
            };

            this.formatJSON = function (json) {
                // Format user's JSON just to be nice :)
                return angular.toJson(angular.fromJson(json), true);
            };

            this.getFormattedJSON = function () {
                // Format user's JSON just to be nice :)
                return angular.toJson(self.json, true);
            };

            this.getSchemaAsString = function (pretty_print) {
                this.editableSchema2FinalSchema();
                var str = angular.toJson(self.schema, pretty_print);
                str = str.replace('_$', '$');
                return str;
            }
        }
    ]);
