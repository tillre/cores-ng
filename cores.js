(function() {

  //
  // module definitions
  //

  angular.module('cores',
                 ['ng',
                  'cores.services',
                  'cores.templates',
                  'cores.directives']);

  angular.module('cores.services',
                 ['ng']);

  angular.module('cores.templates',
                 ['ng']);
  
  angular.module('cores.directives',
                 ['ng',
                  'cores.services',
                  'cores.templates']);

})();
angular.module("cores.templates").run(["$templateCache", function($templateCache) {

  $templateCache.put("cr-anyof-array.html",
    "<div> \n" +
    "  <label><strong>{{name}}</strong></label> \n" +
    "\n" +
    "  <div class=\"indent\"> \n" +
    "    <div class=\"btn-group\"> \n" +
    "      <a class=\"btn dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\">Add <span class=\"caret\"/></a> \n" +
    "      <ul class=\"dropdown-menu\" role=\"menu\"> \n" +
    "        <li ng-repeat=\"schema in schema.items.anyOf\"> \n" +
    "          <a ng-click=\"addItem(schema)\">{{schema.name}}</a> \n" +
    "        </li> \n" +
    "      </ul> \n" +
    "    </div> \n" +
    "\n" +
    "    <ul class=\"unstyled\">  \n" +
    "      <li ng-repeat=\"model in model\"><div cr-anyof-item model=\"model\" path=\"{{path}}[ {{$index}} ]\"></div></li> \n" +
    "    </ul> \n" +
    "  </div> \n" +
    "</div>\n"
  );

  $templateCache.put("cr-array-item.html",
    "<div> \n" +
    "  <hr> \n" +
    "  <div class=\"item-controls\"> \n" +
    "    <div class=\"btn-group\"> \n" +
    "      <button class=\"btn btn-small\" ng-click=\"moveUp()\">Up</button> \n" +
    "      <button class=\"btn btn-small\" ng-click=\"moveDown()\">Down</button> \n" +
    "    </div> \n" +
    "    <button class=\"btn btn-small btn-danger\" ng-click=\"remove()\">Remove</button> \n" +
    "  </div> \n" +
    "</div>\n"
  );

  $templateCache.put("cr-array.html",
    "<div> \n" +
    "  <label><strong>{{name}}</strong></label> \n" +
    "\n" +
    "  <div class=\"indent\"> \n" +
    "    <button class=\"btn\" ng-click=\"addItem(schema.items)\">Add</button> \n" +
    "\n" +
    "    <ul class=\"unstyled\"> \n" +
    "      <li ng-repeat=\"model in model\"> \n" +
    "        <div cr-array-item schema=\"schema.items\" model=\"model\" path=\"{{path}}[ {{$index}} ]\"></div> \n" +
    "      </li> \n" +
    "    </ul> \n" +
    "  </div> \n" +
    "</div>\n"
  );

  $templateCache.put("cr-boolean.html",
    "<span> \n" +
    "  <label class=\"checkbox\">{{name}} \n" +
    "    <input type=\"checkbox\" ng-model=\"model\"/> \n" +
    "  </label>  \n" +
    "</span>\n"
  );

  $templateCache.put("cr-enum.html",
    "<span> \n" +
    "  <label>{{name}}:</label> \n" +
    "  <select ng-model=\"model\" ng-options=\"e for e in schema.enum\"></select> \n" +
    "</span>\n"
  );

  $templateCache.put("cr-model-form.html",
    "<div> \n" +
    "  <form name=\"modelForm\"></form> \n" +
    "  <div ng-show=\"!valid\" class=\"alert alert-error\">The form has errors</div> \n" +
    "  <pre>{{ model | json }}</pre> \n" +
    "</div>\n"
  );

  $templateCache.put("cr-model-list-modal.html",
    "<div id=\"{{modalId}}\" class=\"modal hide fade\" tabindex=\"-1\" role=\"dialog\"> \n" +
    "  <div class=\"modal-header\"> \n" +
    "    <button class=\"close\" data-dismiss=\"modal\">x</button> \n" +
    "    <h3>{{type}}</h3> \n" +
    "  </div> \n" +
    "  <div class=\"modal-body\"> \n" +
    "    <div cr-model-list type=\"{{type}}\"></div> \n" +
    "  </div> \n" +
    "  <div class=\"modal-footer btn-toolbar\"> \n" +
    "    <button ng-click=\"cancel\" class=\"btn pull-right\" data-dismiss=\"modal\">Cancel</button> \n" +
    "  </div> \n" +
    "</div>\n"
  );

  $templateCache.put("cr-model-list.html",
    "<table class=\"table\"> \n" +
    "  <thead> \n" +
    "    <tr> \n" +
    "      <th ng-repeat=\"header in headers\">{{header}}</th> \n" +
    "    </tr> \n" +
    "  </thead> \n" +
    "  <tbody> \n" +
    "    <tr ng-repeat=\"row in rows\"> \n" +
    "      <td ng-click=\"select(item.id)\" ng-repeat=\"item in row\">{{item.value}}</td> \n" +
    "    </tr> \n" +
    "  </tbody> \n" +
    "</table>\n"
  );

  $templateCache.put("cr-model-modal.html",
    "<div id=\"{{modalId}}\" class=\"modal hide fade\" tabindex=\"-1\" role=\"dialog\"> \n" +
    "  <div class=\"modal-header\"> \n" +
    "    <button class=\"close\" data-dismiss=\"modal\">x</button> \n" +
    "    <h3>{{type}}</h3> \n" +
    "  </div> \n" +
    "  <div class=\"modal-body\" ng-switch on=\"data.state\"> \n" +
    "    <div ng-switch-when=\"loading\" class=\"alert alert-info\">Loading...</div> \n" +
    "    <div ng-switch-when=\"saving\" class=\"alert alert-info\">Saving...</div> \n" +
    "    <div ng-switch-default cr-model-form schema=\"schema\" model=\"model\" valid=\"data.valid\" path=\"{{path}}\"></div> \n" +
    "  </div> \n" +
    "  <div class=\"modal-footer\"> \n" +
    "    <div class=\"btn-toolbar\"> \n" +
    "      <button ng-click=\"save()\" ng-class=\"{ disabled: !data.valid }\" class=\"btn btn-primary pull-left\">Save</button> \n" +
    "      <button ng-click=\"cancel()\" class=\"btn pull-right\" data-dismiss=\"modal\">Cancel</button> \n" +
    "    </div> \n" +
    "  </div> \n" +
    "</div>\n"
  );

  $templateCache.put("cr-model.html",
    "<div> \n" +
    "  <div ng-switch on=\"data.state\"> \n" +
    "    <div ng-switch-when=\"loading\" class=\"alert alert-info\">Loading...</div> \n" +
    "    <div ng-switch-when=\"saving\" class=\"alert alert-info\">Saving...</div> \n" +
    "    <div ng-switch-default cr-model-form schema=\"schema\" model=\"model\" valid=\"data.valid\" path=\"{{path}}\"></div> \n" +
    "  </div> \n" +
    "  <div class=\"form-actions btn-toolbar\"> \n" +
    "    <button ng-click=\"save()\" ng-class=\"{ disabled: !data.valid }\" class=\"btn btn-primary\">Save</button> \n" +
    "    <button ng-click=\"destroy()\" ng-show=\"!isNew()\" class=\"btn btn-danger pull-right\">Delete</button> \n" +
    "  </div> \n" +
    "</div>\n"
  );

  $templateCache.put("cr-number.html",
    "<span class=\"control-group\" ng-class=\"{ error: hasErrors() }\"> \n" +
    "  <div class=\"controls\"> \n" +
    "    <label>{{name}}:</label> \n" +
    "    <input type=\"number\" ng-model=\"model\"/> \n" +
    "    <span ng-switch on=\"getFirstError()\"> \n" +
    "      <p ng-switch-when=\"integer\" class=\"help-inline\">Value is not an integer</p> \n" +
    "      <p ng-switch-when=\"multipleOf\" class=\"help-inline\">Value is not a multiple of {{schema.multipleOf}}</p> \n" +
    "      <p ng-switch-when=\"minimum\" class=\"help-inline\">Value is less than {{schema.minimum}}</p> \n" +
    "      <p ng-switch-when=\"maximum\" class=\"help-inline\">Value is greater than {{schema.maximum}}</p> \n" +
    "    </span> \n" +
    "  </div> \n" +
    "</span>\n"
  );

  $templateCache.put("cr-object-minimal.html",
    "<fieldset> \n" +
    "  <div class=\"properties\"></div> \n" +
    "</fieldset>\n"
  );

  $templateCache.put("cr-object.html",
    "<fieldset> \n" +
    "  <label><strong>{{name}}:<strong></label> \n" +
    "  <div class=\"indent properties\"></div> \n" +
    "</fieldset>\n"
  );

  $templateCache.put("cr-password.html",
    "<div class=\"control-group\" ng-class=\"{ error: hasErrors() }\"> \n" +
    "  <label class=\"control-label\">{{name}}:</label> \n" +
    "  <input type=\"password\" ng-model=\"pass1\" style=\"margin-right: 4px\"/> \n" +
    "  <input type=\"password\" ng-model=\"pass2\"/> \n" +
    "  <!-- <p ng-show=\"hasError\" class=\"help-inline\">{{ error }}</p>  -->\n" +
    "  <span ng-switch on=\"getFirstError()\"> \n" +
    "    <p ng-switch-when=\"match\" class=\"help-inline\">Passwords do not match</p> \n" +
    "  </span>  \n" +
    "</div>\n"
  );

  $templateCache.put("cr-ref-preview.html",
    "<p>{{ model[options] }}</p>\n"
  );

  $templateCache.put("cr-ref.html",
    "<div> \n" +
    "  <label><strong>{{name}}:</strong></label> \n" +
    "\n" +
    "  <div class=\"indent\"> \n" +
    "    <div cr-ref-preview type=\"{{schema.$ref}}\" options=\"{{schema.preview}}\"></div> \n" +
    "\n" +
    "    <div class=\"btn-group\"> \n" +
    "      <button ng-click=\"newModel()\" class=\"btn\">New</button> \n" +
    "      <button ng-show=\"model.id\" ng-click=\"updateModel()\" class=\"btn\">Edit</button> \n" +
    "      <button ng-click=\"selectModel()\" class=\"btn\">Select</button> \n" +
    "    </div> \n" +
    "  </div> \n" +
    "\n" +
    "  <div cr-model-modal modal-id=\"{{editModalId}}\" type=\"{{schema.$ref}}\" path=\"{{path}}\"></div> \n" +
    "  <div cr-model-list-modal modal-id=\"{{selectModalId}}\" type=\"{{schema.$ref}}\"></div> \n" +
    "</div>\n"
  );

  $templateCache.put("cr-string.html",
    "<span class=\"control-group\" ng-class=\"{ error: hasErrors() }\"> \n" +
    "  <div class=\"controls\"> \n" +
    "    <label>{{name}}:</label> \n" +
    "    <input class=\"input-xlarge\" type=\"text\" ng-model=\"model\"/> \n" +
    "    <span ng-switch on=\"getFirstError()\"> \n" +
    "      <p ng-switch-when=\"maxLength\" class=\"help-inline\">Value is longer than {{schema.maxLength}}</p> \n" +
    "      <p ng-switch-when=\"minLength\" class=\"help-inline\">Value is shorter than {{schema.minLength}}</p> \n" +
    "      <p ng-switch-when=\"pattern\" class=\"help-inline\">Value does not match the pattern</p> \n" +
    "      <p ng-switch-when=\"format\" class=\"help-inline\">Value is valid no {{schema.format}}</p> \n" +
    "    </span> \n" +
    "  </div> \n" +
    "</span>\n"
  );

  $templateCache.put("cr-text.html",
    "<div>\n" +
    "  <label>{{name}}:</label>\n" +
    "  <textarea ng-model=\"model\"/>\n" +
    "</div>"
  );

}]);

(function() {

  var module = angular.module('cores.services');

  
  //
  // get the name from the schema or alternativly from the path
  //
  
  function getModelName(schema, modelPath) {
    // use schema name if it exists
    var name = schema.title || '';

    // otherwise use name from model path
    if (!name) {
      var items = modelPath.split('.');
      name = items[items.length - 1];
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    return name;
  }


  //
  // Create a template for a schema with optional view configuration
  // 
  
  function buildTemplate(schema, model, schemaPath, modelPath, absPath, options) {

    var viewType = schema.type;
    var viewName = getModelName(schema, modelPath);

    // infer some types
    if (!schema.type) {
      if (schema.properties) viewType = 'object';
      if (schema.items) viewType = 'array';
    }

    if (viewType && !angular.isString(viewType)) {
      throw new Error('Only single types are supported');
    }

    // handle extended types

    if (schema.hasOwnProperty('enum')) {
      viewType = 'enum';
    }
    else if (schema.hasOwnProperty('$ref')) {
      viewType = 'ref';
    }
    else if (viewType === 'array' &&
             schema.hasOwnProperty('items') &&
             schema.items.anyOf) {
      viewType = 'anyof-array';
    }

    // use number directive for integers

    if (viewType === 'integer') {
      viewType = 'number';
      options.isInteger = true;
    }
    
    if (schema.hasOwnProperty('view')) {

      // view can be a string or object with additional options
      
      if (angular.isObject(schema.view)) {
        viewType = schema.view.type || viewType;
        viewName = schema.view.name || viewName;

        // add view properties to options
        angular.forEach(schema.view, function(value, key) {
          if (key !== 'type' && key !== 'name') {
            options[key] = value;
          }
        });
      }
      else if (angular.isString(schema.view)) {
        viewType = schema.view;
      }
      else throw new Error('View has to be of type object or string');
    }

    return buildElement(viewType, schemaPath, modelPath, viewName, absPath, options);
  }

  
  //
  // build the html element for the type
  //
  
  function buildElement(type, schemaPath, modelPath, name, absPath, options) {
    var e = '<div' +
          ' cr-' + type +
          ' schema="' + schemaPath + '"' +
          ' model="' + modelPath + '"' +
          ' path="' + absPath + '"' +
          ' name="' + name + '"';

    angular.forEach(options, function(value, key) {
      e += ' ' + key + '="' + value + '"';
    });
    
    e += '/>';

    return e;
  }

  
  module.factory('crBuild', function() {

    return function(schema, model, schemaPath, modelPath, absPath, options) {

      schemaPath = schemaPath || 'schema';
      modelPath = modelPath || 'model';
      absPath = absPath || '';
      options = options || {};
      
      return buildTemplate(schema, model, schemaPath, modelPath, absPath, options);
    };
  });

})();
(function() {

  var module = angular.module('cores.services');

  // Get a new file id

  var getFileId = (function(id) {
    return function() { return 'file' + ++id; };
  })(0);


  // Get a new modal id

  var getModalId = (function(id) {
    return function() { return 'modal-' + ++id; };
  })(0);


  function StandardCtrl($scope) {
    var unwatch = $scope.$watch('model', function stdWatch() {
      unwatch();
      $scope.$emit('ready');
    });
  }

  
  module.service('crCommon', function($q) {

    function watchUntil(scope, condition) {
      var def = $q.defer();
      var off = scope.$watch(function(scope) {
        if (condition(scope)) {
          off();
          def.resolve(scope);
        }
      });
      return def.promise;
    }

    return {
      getFileId: getFileId,
      getModalId: getModalId,

      watch: watchUntil,
      
      StandardCtrl: StandardCtrl
    };
  });

})();
(function() {

  var module = angular.module('cores.services');
  
  module.factory('crConstraints', function() {

    return function(scope, schema) {

      schema = schema || {};
      
      var errors = {};
      var constraints = [];

      
      scope.hasErrors = function() {
        return Object.keys(errors).length > 0;
      };

      
      scope.hasError = function(name) {
        return !!errors[name];
      };

      
      scope.getFirstError = function() {
        for (var x in errors) {
          if (errors[x]) return x;
        }
        return '';
      };

      
      scope.$watch('model', function(newValue, oldValue, scope) {
        constraints.forEach(function(c) {
          c(newValue);
        });
      });

      
      return function constraint(name, condition, isCustomConstraint) {

        // only check constraints that are defined in the schema
        if (!isCustomConstraint &&
            !schema.hasOwnProperty(name)) return;
        
        constraints.push(function(value) {

          if (condition(value)) {
            if (errors.hasOwnProperty(name)) {
              scope.$emit('error:remove', scope.path + ':' + name);
              delete errors[name];
            }
          }
          else {
            scope.$emit('error:set', scope.path + ':' + name);
            errors[name] = true;
          }
        });
      }
    }
  });
})();
(function() {  

  var module = angular.module('cores.services');

  //
  // Create an error object from a response
  //

  function makeError(response) {

    var msg = response.msg || '';
    if (!msg && response.data) {
      msg = response.data.message || response.data.error;
    }

    var err = new Error(msg);
    err.code = response.code || response.status;

    if (response.config) {
      err.config = response.config;
    }

    if (response.data && response.data.errors) {
      err.errors = response.data.errors;
    }

    return err;
  };


  //
  // crResource
  //
  
  module.factory('crResource', function($http, $q, $rootScope) {

    var Resource = function(type, config, options) {

      this.type = type;
      
      // add config to this
      angular.extend(
        this,
        { path: '', schemaPath: '', viewPaths: {} },
        config
      );

      // add options to this
      angular.extend(
        this,
        { host: '' },
        options
      );
    };


    //
    // Get a resource schema
    //
    
    Resource.prototype.schema = function() {

      return $http.get(this.host + this.schemaPath).then(
        function(res) { return res.data; },
        function(res) { throw makeError(res); }
      );
    };

    
    //
    // Load a resource from the server
    //
    
    Resource.prototype.load = function(id, params) {

      var path = this.host + this.path;

      if (id) {
        if (typeof id === 'string') {
          path += '/' + id;
        }
        else if (typeof id === 'object' && !params) {
          // params passed as first arg
          params = id;
        }
      }
      var config = { params: params || {} };

      return $http.get(path, config).then(
        function(res) { return res.data; },
        function(res) { throw makeError(res); }
      );
    };

    
    //
    // Save/update a resource on the server
    //
    
    Resource.prototype.save = function(doc, files) {

      if (files && !angular.isArray(files)) {
        files = [files];
      }
      var isMultipart = false;
      
      // create multipart formdata when saving files

      if (files && files.length) {
        var fd = new FormData();
        fd.append('type_', this.type);
        fd.append('doc', JSON.stringify(doc));
        // fd.append('file', file);

        files.forEach(function(file, i) {
          fd.append('file' + i, file);
        });
        fd.append('numFiles', files.length);

        // when updating, add the id and rev
        if (doc._id)  fd.append('_id', doc._id);
        if (doc._rev) fd.append('_rev', doc._rev);

        doc = fd;
        isMultipart = true;
      }

      var req  = {
        url: this.host + this.path,
        method: 'POST',
        data: doc
      };


      if (doc._id && doc._rev) {
        // update
        req.method = 'PUT';
        req.url += '/' + doc._id + '/' + doc._rev;
      }
      else if (doc._id) {
        // new with id
        req.method = 'PUT';
        req.url += '/' + doc._id;
      }

      if (isMultipart) {
        return this._sendMultipart(req);
      }
      else {
        return $http(req).then(
          function(res) { return res.data; },
          function(res) { throw makeError(res); }
        );
      }
    };


    Resource.prototype._sendMultipart = function(req) {

      var def = $q.defer();
      
      // send multipart with a xhr for now, $http seems to have problems with it
      var xhr = new XMLHttpRequest();

      xhr.addEventListener('load', function() {

        var data = typeof xhr.response === 'string' ? JSON.parse(xhr.response) : xhr.response;

        if (xhr.status === 200) {
          def.resolve(data);
        }
        else {
          def.reject(makeError(data));
        }
        // call apply, because we are outside the angular life-cycle
        $rootScope.$apply();
      });

      xhr.open(req.method, req.url);
      xhr.send(req.data);

      return def.promise;
    };

    
    //
    // Delete a resource on the server
    //
    
    Resource.prototype.destroy = function(doc) {

      if (!doc._id || !doc._rev) {
        throw new Error('Cannot delete doc without id or rev');
      }
      return $http.delete(this.host + this.path + '/' + doc._id + '/' + doc._rev).then(
        function(res) {},
        function(res) { throw makeError(res); }
      );
    };


    //
    // Call a couchdb view
    //
    
    Resource.prototype.view = function(name, params) {

      var path = this.viewPaths[name];
      if (!path) {
        throw new Error('No view with name found: ' + name);
      }
      path = this.host + path;

      var config = {
        params: params || {}
      };

      return $http.get(path, config).then(
        function(res) { return res.data; },
        function(res) { throw makeError(res); }
      );
    };

    return Resource;
  });


  //
  // crResource
  //
  
  module.service('crResources', function($http, $q, $rootScope, crResource) {


    var Resources = function() {

      this._resources = {};
      this._host = '';
    };


    Resources.prototype.init = function(host) {

      this._host = host || '';
      var self = this;

      return $http.get(this._host + '/_index').then(

        function(res) {
          angular.forEach(res.data, function(value, key) {
            self._resources[key] = new crResource(key, value, { host: self._host });
          });
          return self._resources;
        },
        function(res) {
          return $q.reject(makeError(res));
        }
      );
    };


    Resources.prototype.getIds = function(count) {

      count = count || 1;

      return $http.get(this._host + '/_uuids?count=' + count).then(
        function(res) {
          return res.data.uuids;
        },
        function(res) {
          throw makeError(res);
        }
      );
    };


    Resources.prototype.resources = function() {
      return this._resources;
    };


    Resources.prototype.get = function(type) {

      var r = this._resources[type];
      if (!r) {
        throw new Error('Resource with type not found: ' + type);
      }
      return r;
    };

    
    return new Resources();
  });

})();
(function() {

  var module = angular.module('cores.services');

  
  function isObjectSchema(schema) {
    return schema.type === 'object' || schema.properties;
  }
  
  function isArraySchema(schema) {
    return schema.type === 'array' || schema.items;
  }

  function isRefSchema(schema) {
    return typeof schema.$ref === 'string';
  }
  

  function isPrivateProperty(key) {
    return key === '_id' || key === '_rev' || key === 'type_';
  }

  
  //
  // create a object with default values from schema
  //
  
  function createValue(schema, typeName) {

    var hasDefaultValue = schema.hasOwnProperty('default');
    var type = schema.type;
    
    if (schema.enum) {
      return hasDefaultValue ? schema.default : schema.enum[0];
    }
    if (schema.$ref) {
      return hasDefaultValue ? schema.default : {};
    }
    if (!type) {
      // infer object and array
      if (schema.properties) type = 'object';
      if (schema.items) type = 'array';
    }
    
    if (!type) throw new Error('Cannot create default value for schema without type');

    switch(type) {
    case 'boolean': return hasDefaultValue ? schema.default : true;
    case 'integer': return hasDefaultValue ? schema.default : 0;
    case 'number': return hasDefaultValue ? schema.default : 0;
    case 'string': return hasDefaultValue ? schema.default : '';
    case 'object':
      if (hasDefaultValue) return schema.default;
      
      var obj = {};
      angular.forEach(schema.properties, function(propSchema, name) {
        // ignore some vals
        if (isPrivateProperty(name)) return;
        obj[name] = createValue(propSchema);
      });
      if (typeName) {
        obj.type_ = typeName;
      }
      return obj;
    case 'array': return hasDefaultValue ? schema.default : [];
    default: throw new Error('Cannot create default value for unknown type: ' + type);
    }
  }

  //
  // schema utility methods
  //
  
  module.service('crSchema', function() {

    return {
      createValue: createValue,
      
      isObjectSchema: isObjectSchema,
      isArraySchema: isArraySchema,
      isRefSchema: isRefSchema,

      isPrivateProperty: isPrivateProperty
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');
  
  
  function ArrayItemCtrl($scope) {

    $scope.moveUp = function() {
      $scope.array.moveItemUp($scope.$parent.$index);
    };

    $scope.moveDown = function() {
      $scope.array.moveItemDown($scope.$parent.$index);
    };

    $scope.remove = function() {
      $scope.array.removeItem($scope.$parent.$index);
    };
  }


  function ArrayCtrl($scope, crSchema) {

    $scope.addItem = function(schema) {
      var obj = crSchema.createValue(schema, schema.name);
      $scope.model.push(obj);
    };

    // methods called by the array item controller
    
    this.removeItem = function(index) {
      $scope.$broadcast('item:remove', $scope.model[index]);
      $scope.model.splice(index, 1);
    };

    this.moveItemUp = function(index) {
      if (index === 0) return;
      $scope.model.splice(index - 1, 0, $scope.model.splice(index, 1)[0]);
    };

    this.moveItemDown = function(index) {
      if (index >= $scope.model.length) return;
      $scope.model.splice(index + 1, 0, $scope.model.splice(index, 1)[0]);
    };

    // wait for ready event of items on initialization

    var numItems = $scope.model.length;

    if (numItems === 0) {
      $scope.$emit('ready');
    }
    else {
      var off = $scope.$on('ready', function(e) {
        e.stopPropagation();
        if (--numItems === 0) {
          off();
          $scope.$emit('ready');
        }
      });
    }
  }


  function AnyofArrayCtrl($scope, crSchema) {

    // Inherit from ArrayCtrl, keep in mind to pass all deps
    ArrayCtrl.apply(this, arguments);

    angular.forEach($scope.schema.items.anyOf, function(anySchema, i) {
      if (!anySchema.name) throw new Error('AnyOf schema has to have a name');
    });
    
    this.getSchema = function(type) {
      var schema;
      angular.forEach($scope.schema.items.anyOf, function(anySchema) {
        if (anySchema.name === type) {
          schema = anySchema;
        }
      });
      if (!schema) throw new Error('No schema for type found: ' + type);
      return schema;
    };
  }
  
  
  //
  // array item
  //
  
  module.directive('crArrayItem', function($compile, crBuild) {
    return {
      require: '^crArray',
      scope: {
        model: '=',
        schema: '=',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-array-item.html',

      controller: ArrayItemCtrl,

      link: function(scope, elem, attrs, array) {

        scope.array = array;
        
        var tmpl = crBuild(scope.schema, scope.model, 'schema', 'model', scope.path,
                           { mode: 'minimal' });

        var link = $compile(tmpl);
        var e = link(scope);
        elem.append(e);
      }
    };
  });


  //
  // anyof array item
  //
  
  module.directive('crAnyofItem', function($compile, crBuild) {
    return {
      require: '^crAnyofArray',
      scope: {
        model: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-array-item.html',

      controller: ArrayItemCtrl,
      
      link: function(scope, elem, attrs, anyof) {
        // get the schema from the anyof-array
        scope.schema = anyof.getSchema(scope.model.type_);
        scope.array = anyof;
        
        var tmpl = crBuild(scope.schema, scope.model, 'schema', 'model', scope.path,
                           { 'mode': 'minimal' });
        var link = $compile(tmpl);
        var e = link(scope);
        elem.append(e);
      }
    };
  });

  
  //
  // array
  //
  
  module.directive('crArray', function(crSchema) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-array.html',

      controller: ArrayCtrl,
      
      link: function(scope, elem, attrs) {
        // ngrepeat can only bind to references when it comes to form fields
        // thats why we can only work with items of type object not primitives
        // this may change in a feature release
        if (!crSchema.isObjectSchema(scope.schema.items) &&
            !crSchema.isRefSchema(scope.schema.items)) {
          throw new Error('Array items schema is not of type object: ' + JSON.stringify(scope.schema.items));
        }
      }
    };
  });


  //
  // anyof array
  //
  
  module.directive('crAnyofArray', function($compile) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-anyof-array.html',

      controller: AnyofArrayCtrl,

      link: function(scope, elem, attrs) {
        elem.find('.dropdown-toggle').dropdown();
      }
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');
  

  module.directive('crImage', function($compile, crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      
      replace: true,
      templateUrl: 'cr-image.html',


      link: function(scope, elem, attrs) {

        var fileId = crCommon.getFileId();
        
        var input = elem.find('input[type="file"]');
        var preview = elem.find('img');

        // preview when already saved
        scope.$watch('model.url', function(url) {
          preview.attr('src', url);
        });
        
        input.on('change', function(e) {

          var files = input[0].files;
          if (files.length === 0) {
            // no file selected
            return;
          }

          var file = files[0];

          // preview selected image
          var fr = new FileReader();
          fr.onload = function(e) {
            preview.attr('src', e.target.result);
          };
          fr.readAsDataURL(file);

          scope.model.name = file.name;

          // notify model about file
          scope.$emit('file:set', fileId, file);
          scope.$apply();
        });

        scope.$emit('ready');
      }
    };
  });


  module.directive('crImageRefPreview', function() {
    return {
      scope: {
        model: '=',
        file: '='
      },

      replace: true,
      templateUrl: 'cr-image-preview.html',

      link: function(scope, elem, attr) {
        scope.$watch('file', function(file) {
          if (file) {
            var fr = new FileReader();
            fr.onload = function(e) {
              elem.find('img').attr('src', e.target.result);
            };
            fr.readAsDataURL(file);
          }
        });
      }
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crModelList', function(crCommon, crResources, crSchema) {
    return {
      scope: {
        type: '@'
      },

      replace: true,
      templateUrl: 'cr-model-list.html',

      link: function(scope, elem, attrs) {

        function load() {

          scope.headers = [];
          scope.rows = [];

          crResources.get(scope.type).view('all', { limit: 10 }).then(function success(result) {

            if(result.total_rows === 0) return;

            var firstVal = result.rows[0].value;

            // headers array with property names
            
            scope.headers = Object.keys(firstVal).filter(function(key) {
              return !crSchema.isPrivateProperty(key);
            });

            // rows array with property values for each row
            
            scope.rows = result.rows.map(function(row) {
              return scope.headers.map(function(key) {
                return { id: row.id, value: row.value[key] };
              });
            });
          });
        };
        
        scope.select = function(id) {
          scope.$emit('list:select', id);
        };

        scope.$on('list:reload', function(e) {
          e.preventDefault();
          load();
        });

        // init
        
        crCommon.watch(scope, function(scope) {
          return scope.type;
        }).then(load);
      }
    };
  });



  module.directive('crModelListModal', function() {
    return {
      scope: {
        type: '@',
        modalId: '@'
      },
      
      replace: true,
      templateUrl: 'cr-model-list-modal.html',

      link: function(scope, elem, attrs) {

        scope.$on('list:select', function(e, id) {
          elem.modal('hide');
        });
        
        scope.$on('list:showmodal', function(e, modalId, reload) {

          if (modalId === scope.modalId) {
            e.preventDefault();
            elem.modal('show');

            if (reload) {
              scope.$broadcast('list:reload');
            }
          }
        });
      }
    };
  });
  
  
})();
(function() {

  var module = angular.module('cores.directives');

  
  module.controller('crModelCtrl', function($scope, $q, crResources, crSchema, crCommon) {

    var STATE_EDITING = 'editing';
    var STATE_LOADING = 'loading';
    var STATE_SAVING = 'saving';
    
    var self = this;
    var files = {};

    var data = $scope.data = {
      valid: true,
      state: STATE_EDITING
    };
    
    //
    // scope
    //
    
    // add/update/remove files from the model

    $scope.$on('file:set', function(e, id, file) {
      e.stopPropagation();
      files[id] = file;
    });
    
    $scope.$on('file:remove', function(e, id) {
      e.stopPropagation();
      delete files[id];
    });

    // button methods
    
    $scope.save = function() {
      $scope.$emit('model:save');
      return self.save();
    };

    $scope.cancel = function() {
      $scope.$emit('model:cancel');
    };

    $scope.destroy = function() {
      $scope.$emit('model:destroy');
      return self.destroy();
    };

    $scope.isNew = function() {
      if (!$scope.model) return true;
      return !$scope.model._rev;
    };

    //
    // methods
    //
    
    this.load = function(id) {

      data.state = STATE_LOADING;
      return this._resource.load(id).then(function(doc) {
        $scope.model = doc;
        data.state = STATE_EDITING;
      });
    };


    this.save = function() {

      var def = $q.defer();
      
      if (!$scope.data.valid) {
        def.reject(new Error('Model is not valid'));
        return def.promise;
      }
      data.state = STATE_SAVING;
      
      var fs = Object.keys(files).map(function(k) { return files[k]; });
      
      this._resource.save($scope.model, fs).then(function(doc) {

        $scope.model = doc;
        $scope.modelId = doc._id;
        data.state = STATE_EDITING;
        $scope.$emit('model:saved', $scope.model);
        def.resolve(doc);

      }, function(err) {

        def.reject(err);
      });
      
      return def.promise;
    };


    this.destroy = function() {
      return this._resource.destroy($scope.model).then(
        function() {
          $scope.model = crSchema.createValue($scope.schema);
          $scope.$emit('model:destroyed');
        }
      );
    };
    

    //
    // init
    //
    
    return crCommon.watch($scope, function(scope) {

      return !!scope.type;

    }).then(function(scope) {

      // load schema
      data.state = STATE_LOADING;
      self._resource = crResources.get(scope.type);
      return self._resource.schema();
      
    }).then(function(schema) {

      // load or create default model
      $scope.schema = schema;
      var id = $scope.modelId;

      if (!id) {
        $scope.model = crSchema.createValue(schema);
        data.state = STATE_EDITING;
      }
      else {
        return self.load(id);
      }
    }).then(function() {

      // watch for modelId changes to load/clear the model
      $scope.$watch('modelId', function(newId, oldId) {

        if (newId !== oldId) {
          if (newId) {
            // load model with new id
            self.load(newId);
          }
          else if (oldId) {
            // newId was set to null, create default value
            $scope.model = crSchema.createValue($scope.schema);
          }
        }
      });

      $scope.$emit('model:ready');
    });
  });

  

  module.directive('crModel', function() {
    return {
      scope: {
        type: '@',
        path: '@',
        modelId: '='
      },

      replace: true,
      templateUrl: 'cr-model.html',

      controller: 'crModelCtrl'
    };
  });


  module.directive('crModelModal', function() {
    return {
      scope: {
        type: '@',
        path: '@',
        modalId: '@'
      },

      replace: true,
      templateUrl: 'cr-model-modal.html',

      controller: 'crModelCtrl',

      link: function(scope, elem) {

        scope.$on('model:saved', function() {
          // close on save
          elem.modal('hide');
        });
        
        scope.$on('model:showmodal', function(e, modalId, modelId) {

          if (modalId === scope.modalId) {
            e.preventDefault();
            scope.modelId = modelId;
            elem.modal('show');
          }
        });
      }
    };
  });
  
  
  module.directive('crModelForm', function($compile, crBuild, crSchema, crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        valid: '=',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-model-form.html',

      controller: function($scope) {

        $scope.errors = {};
        
        $scope.$on('error:set', function(e, id) {
          e.stopPropagation();
          $scope.errors[id] = true;
          $scope.valid = false;
        });

        $scope.$on('error:remove', function(e, id) {
          e.stopPropagation();
          delete $scope.errors[id];
          $scope.valid = Object.keys($scope.errors).length === 0;
        });
      },
      
      link: function(scope, elem) {

        crCommon.watch(scope, function(scope) {
          return scope.model && scope.schema;
        }).then(
          function(scope) {
            if (!crSchema.isObjectSchema(scope.schema)) {
              throw new Error('Top level schema has to be an object');
            }

            var tmpl = crBuild(scope.schema, scope.model, 'schema', 'model',
                               scope.path || '', { mode: 'minimal'});
            
            var link = $compile(tmpl);
            var content = link(scope);

            elem.find('form').html(content);
          }
        );
      }
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');

  
  module.directive('crObject', function($compile, $templateCache, crSchema, crBuild, crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@',
        template: '@'
      },

      compile: function(tElem, tAttrs) {

        var templates = {
          'default': 'cr-object.html',
          'minimal': 'cr-object-minimal.html'
        };
        
        var mode = tAttrs.mode || 'default';
        var template = $templateCache.get(templates[mode]);
        tElem.append(template);

        // Linking function
        return function(scope, elem, attrs) {

          var numProperties = 0;

          // listen for childs ready event and ready up when all fired
          var offready = scope.$on('ready', function(e) {

            e.stopPropagation();
            if (--numProperties === 0) {
              offready();
              scope.$emit('ready');
            }
          });

          
          crCommon.watch(scope, function(scope) {
            return scope.model && scope.schema;
          }).then(
            function(scope) {

              // create templates for properties

              var tmpl = '';
              angular.forEach(scope.schema.properties, function(subSchema, key) {

                // ignore some keys
                if (crSchema.isPrivateProperty(key)) return;
                
                if (!scope.model.hasOwnProperty(key)) {
                  scope.model[key] = crSchema.createValue(subSchema);
                }

                numProperties += 1;

                tmpl += crBuild(subSchema, scope.model[key],
                                'schema.properties.' + key, 'model.' + key,
                                (scope.path ? scope.path + '.' : '') + key);
              });

              // compile and link templates
              var content = $compile(tmpl)(scope);
              elem.find('.properties').append(content);
            }
          );          
        };
      }
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');

  module.directive('crPassword', function(crCommon, crConstraints) {
    return {
      scope: {
        model: '=',
        name: '@',
        path: '@'
      },
      replace: true,
      templateUrl: 'cr-password.html',

      controller: crCommon.StandardCtrl,
      
      link: function(scope, elem, attr) {
        
        scope.pass1 = '';
        scope.pass2 = '';

        // scope.hasError = false;
        // scope.error = '';

        // var oldPass = null;

        var constraint = crConstraints(scope);

        constraint('match', function() {
          return scope.pass1 === scope.pass2;
        }, true);
        
        // addConstraint('match', function() {
        //   return scope.pass1 === scope.pass2;
        // });
        
        // only set model when passwords are equal and not empty

        // var compareValue = function(v1, v2) {
        //   if (v1 === v2) {
        //     if (v1 !== '') {
        //       // set new password
        //       oldPass = scope.model;
        //       scope.model = v1;
        //     }
        //     else if (oldPass !== null) {
        //       // reset original password
        //       scope.model = oldPass;
        //     }
        //     scope.hasError = false;
        //     scope.$emit('form:error', scope.path + ':password', true)
        //   }
        //   else {
        //     scope.error = 'Passwords do not match';
        //     scope.hasError = true;
        //     scope.$emit('form:error', scope.path + ':password', false)
        //   }
        // };
        
        // scope.$watch('pass1', function(newValue) {
        //   compareValue(newValue, scope.pass2);
        // });
        // scope.$watch('pass2', function(newValue) {
        //   compareValue(newValue, scope.pass1);
        // });
      }
    };
  });
  
})();
(function() {

  var module = angular.module('cores.directives');
  
  //
  // boolean
  //
  
  module.directive('crBoolean', function(crCommon) {
    return {
      scope: {
        model: '=',
        name: '@',
        path: '@'
      },
      replace: true,
      templateUrl: 'cr-boolean.html',
      controller: crCommon.StandardCtrl
    };
  });

  
  //
  // number
  //
  
  module.directive('crNumber', function(crCommon, crConstraints) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@',
        isInteger: '@'
      },

      replace: true,
      templateUrl: 'cr-number.html',
      controller: crCommon.StandardCtrl,

      link: function(scope, elem, attrs) {

        var constraint = crConstraints(scope, scope.schema);        

        if (elem.attr('isInteger') === 'true') {
          constraint('integer', function(value) {
            return Math.floor(value) === value;
          }, true);
        }
        else {
          elem.find('input[type="number"]').attr('step', 'any');
        }
        
        constraint('multipleOf', function(value) {
          return (value % scope.schema.multipleOf) === 0;
        });

        constraint('minimum', function(value) {
          return value >= scope.schema.minimum;
        });

        constraint('maximum', function(value) {
          return value <= scope.schema.maximum;
        });
      }
    };
  });

  
  //
  // string
  //
  
  module.directive('crString', function(crCommon, crConstraints) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },
      replace: true,
      templateUrl: 'cr-string.html',
      controller: crCommon.StandardCtrl,

      link: function(scope, elem, attrs) {

        var constraint = crConstraints(scope, scope.schema);

        constraint('maxLength', function(value) {
          return value.length <= scope.schema.maxLength;
        });

        constraint('minLength', function(value) {
          return value.length >= scope.schema.minLength;
        });

        constraint('pattern', function(value) {
          return new RegExp(scope.schema.pattern).test(value);
        });

        constraint('format', function(value) {
          throw new Error('not implemented');
          return false;
        });
      }
    };
  });


  //
  // enum
  //

  module.directive('crEnum', function(crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },
      replace: true,
      templateUrl: 'cr-enum.html',

      controller: crCommon.StandardCtrl
    };
  });
  
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crRef', function(crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-ref.html',

      controller: function($scope) {

        $scope.$on('model:saved', function(e, model) {
          e.stopPropagation();
          $scope.model.id = model._id;
          $scope.$broadcast('preview:update', model._id);
        });

        $scope.$on('list:select', function(e, id) {
          e.stopPropagation();
          $scope.model.id = id;
          $scope.$broadcast('preview:update', id);
        });
      },

      link: function(scope) {

        scope.editModalId = crCommon.getModalId();
        scope.selectModalId = crCommon.getModalId();        

        // scope methods
        
        scope.newModel = function() {
          scope.$broadcast('model:showmodal', scope.editModalId, null);
        };

        scope.updateModel = function() {
          scope.$broadcast('model:showmodal', scope.editModalId, scope.model.id);
        };

        scope.selectModel = function() {
          scope.$broadcast('list:showmodal', scope.selectModalId, true);
        };

        // init
        crCommon.watch(scope, function(scope) {

          return scope.model && scope.schema;
        }).then(function(scope) {

          scope.$broadcast('preview:update', scope.model.id);
          scope.$emit('ready');
        });
      }
    };
  });

  
  module.directive('crRefPreview', function(crResources) {
    return {
      scope: {
        type: '@',
        options: '@'
      },
      
      replace: true,
      templateUrl: 'cr-ref-preview.html',

      link: function(scope) {

        scope.$on('preview:update', function(e, id) {

          e.preventDefault();
          if (id) {
            crResources.get(scope.type).load(id).then(function(doc) {
              scope.model = doc;
            });
          }
        });
      }
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');

  
  module.directive('crText', function(crCommon) {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-text.html',
      controller: crCommon.StandardCtrl
    };
  });
  
})();