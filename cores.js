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
(function() {

  var module = angular.module('cores.templates');

  
  module.run(['$templateCache', function($templateCache) {

    // boolean

    $templateCache.put(
      'cr-boolean.html',
      '<span>' +
        '<label class="checkbox">{{name}}' +
          '<input type="checkbox" ng-model="model"/>' +
        '</label>' + 
      '</span>'
    );

    // integer

    $templateCache.put(
      'cr-integer.html',
      '<span><label>{{name}}:</label><input type="number" ng-model="model"/></span>'
    );

    // number

    $templateCache.put(
      'cr-number.html',
      '<span><label>{{name}}:</label><input type="number" ng-model="model"/></span>'
    );

    // string

    $templateCache.put(
      'cr-string.html',
      '<span><label>{{name}}:</label><input class="input-xlarge" type="text" ng-model="model"/></span>'
    );

    // enum

    $templateCache.put(
      'cr-enum.html',
      '<span>' +
        '<label>{{name}}:</label>' +
        '<select ng-model="model" ng-options="e for e in schema.enum"></select>' +
      '</span>'
    );

    // object

    $templateCache.put(
      'cr-object.html',
      '<fieldset>' +
        '<label><strong>{{name}}:<strong></label>' +
        '<div class="indent properties"></div>' +
      '</fieldset>'
    );

    $templateCache.put(
      'cr-object-minimal.html',
      '<fieldset>' +
        '<div class="properties"></div>' +
      '</fieldset>'
    );

    // array

    $templateCache.put(
      'cr-array-item.html',

      '<div>' +
        '<hr>' +
        '<div class="item-controls">' +
          '<div class="btn-group"">' +
            '<button class="btn btn-small" ng-click="moveUp()">Up</button>' +
            '<button class="btn btn-small" ng-click="moveDown()">Down</button>' +
          '</div>' +
          '<button class="btn btn-small btn-danger" ng-click="remove()">Remove</button>' +
        '</div>' +
      '</div>'
    );

    $templateCache.put(
      'cr-array.html',

      '<div>' +
        '<label><strong>{{name}}</strong></label>' +

        '<div class="indent">' +
          '<button class="btn" ng-click="addItem(schema.items)">Add</button>' +

          '<ul class="unstyled">' +
            '<li ng-repeat="model in model">' +
              '<div cr-array-item schema="schema.items" model="model"></div>' +
            '</li>' +
          '</ul>' +
        '</div>' +
      '</div>'
    );

    // anyof
    
    $templateCache.put(
      'cr-anyof-array.html',

      '<div>' +
        '<label><strong>{{name}}</strong></label>' +

        '<div class="indent">' +
          '<div class="btn-group">' +
            '<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">Add <span class="caret"/></a>' +
            '<ul class="dropdown-menu" role="menu">' +
              '<li ng-repeat="schema in schema.items.anyOf">' +
                '<a ng-click="addItem(schema)">{{schema.name}}</a>' +
              '</li>' +
            '</ul>' +
          '</div>' +

          '<ul class="unstyled">' + 
            '<li ng-repeat="model in model"><div cr-anyof-item model="model"></div></li>' +
          '</ul>' +
        '</div>' +
      '</div>'
    );

    // image
    
    $templateCache.put(
      'cr-image.html',
      '<span>' +
        '<label>{{name}}</label>' +
        '<input type="file"/>' +
        '<img class="img-rounded" height="140">' +
      '</span>'
    );

    $templateCache.put(
      'cr-image-preview.html',
      '<div><img></div>'
    );
    
    // text
    
    $templateCache.put(
      'cr-text.html',
      '<div><label>{{name}}:</label><textarea ng-model="model"/></div>'
    );
    
    // password
    
    $templateCache.put(
      'cr-password.html',
      '<div>' +
        '<label>{{name}}:</label>' +
        '<input type="password" ng-model="pass1"/>' +
        '<input type="password" ng-model="pass2"/>' +
      '</div>'
    );
    
    // model-create-ref
    
    $templateCache.put(
      'cr-model-create-ref.html',
      '<div>' +
        '<label><strong>{{name}}:</strong></label>' +
        '<div class="indent">' +
          '<button href="#{{modalId}}" class="btn" data-toggle="modal">Change</button>' +
          '<div cr-model-modal modal-id="{{modalId}}" type="schema.$ref"></div>' +
        '</div>' +
      '</div>'
    );

    // model-select-ref
    
    $templateCache.put(
      'cr-model-select-ref.html',
      '<div>' +
        '<label>{{name}}:</label>' +
        '<select ng-model="selectedItem" ng-options="i for i in items"></select>' +
      '</div>'
    );
    
    // model

    $templateCache.put(
      'cr-model.html',
      '<div>' +
        '<div cr-model-form schema="schema" model="model"></div>' +
        '<div class="form-actions">' +
          '<button ng-click="save()" class="btn btn-primary">Save</button>' +
          '<button ng-click="cancel()" class="btn">Cancel</button>' +
          '<button ng-click="destroy()" class="btn btn-danger pull-right">Delete</button>' +
        '</div>' +
        '<pre>{{ model | json }}</pre>' +
      '</div>'
    );

    // model modal
    
    $templateCache.put(
      'cr-model-modal.html',
      '<div>' +
        '<div id="{{modalId}}" class="modal hide fade" tabindex="-1" role="dialog">' +
          '<div class="modal-header">' +
            '<button class="close" data-dismiss="modal">x</button>' +
            '<h3>{{type}}</h3>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div cr-model-form schema="schema" model="model"></div>' +
            '<pre>{{ model | json }}</pre>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button ng-click="submit()" class="btn btn-primary pull-left">Submit</button>' +
            '<button ng-click="cancel()" class="btn pull-right" data-dismiss="modal">Cancel</button>' +
        '</div>' +
      '</div>'
    );

    
    // model form
    
    $templateCache.put(
      'cr-model-form.html',
      '<form></form>'
    );

    // model list

    $templateCache.put(
      'cr-model-list.html',
      '<table class="table">' +
        '<thead>' +
          '<tr>' +
            '<th ng-repeat="header in headers">{{header}}</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          '<tr ng-repeat="row in rows">' +
             '<td ng-click="select(item.id)" ng-repeat="item in row">{{item.value}}</td>' +
          '</tr>' +
        '</tbody>' +
      '</table>'
    );
    
  }]);
})();
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
  
  function buildTemplate(schema, model, schemaPath, modelPath, options) {

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
      viewType = 'model-create-ref';
    }
    else if (viewType === 'array' &&
             schema.hasOwnProperty('items') &&
             schema.items.anyOf) {
      viewType = 'anyof-array';
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

    return buildElement(viewType, schemaPath, modelPath, viewName, options);
  }

  
  //
  // build the html element for the type
  //
  
  function buildElement(type, schemaPath, modelPath, name, options) {
    var e = '<div' +
          ' cr-' + type +
          ' schema="' + schemaPath + '"' +
          ' model="' + modelPath + '"' +
          ' name="' + name + '"';

    angular.forEach(options, function(value, key) {
      e += ' ' + key + '="' + value + '"';
    });
    
    e += '/>';

    return e;
  }

  
  module.factory('crBuild', function() {

    return function(schema, model, schemaPath, modelPath, options) {

      schemaPath = schemaPath || 'schema';
      modelPath = modelPath || 'model';
      options = options || {};
      
      return buildTemplate(schema, model, schemaPath, modelPath, options);
    };
  });

})();
(function() {

  var module = angular.module('cores.services');

  // Get a new file id

  var getFileId = (function(id) {
    return function() { return 'file' + ++id; };
  })(0);


  // Get a new ref/submodule id

  var getRefId = (function(id) {
    return function() { return 'ref' + ++id; };
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
      getRefId: getRefId,
      getModalId: getModalId,

      watch: watchUntil,
      
      StandardCtrl: StandardCtrl
    };
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
        if (doc._rev) fd.append('_rev', doc._ref);

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


  function isPrivateProperty(key) {
    return key === '_id' || key === '_rev' || key === 'type_' || key === 'parentId_';
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
    // infer object and array
    if (!type) {
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
        $index: '='
      },

      replace: true,
      templateUrl: 'cr-array-item.html',

      controller: ArrayItemCtrl,

      link: function(scope, elem, attrs, array) {

        scope.array = array;
        
        var tmpl = crBuild(scope.schema, scope.model, 'schema', 'model',
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
        name: '@'
      },

      replace: true,
      templateUrl: 'cr-array-item.html',

      controller: ArrayItemCtrl,
      
      link: function(scope, elem, attrs, anyof) {
        // get the schema from the anyof-array
        scope.schema = anyof.getSchema(scope.model.type_);
        scope.array = anyof;
        
        var tmpl = crBuild(scope.schema, scope.model, 'schema', 'model',
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
        name: '@'
      },

      replace: true,
      templateUrl: 'cr-array.html',

      controller: ArrayCtrl,
      
      link: function(scope, elem, attrs) {
        // ngrepeat can only bind to references when it comes to form fields
        // thats why we can only work with items of type object not primitives
        // this may change in a feature release
        if (!crSchema.isObjectSchema(scope.schema.items)) {
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
        name: '@'
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
        type: '='
      },

      replace: true,
      templateUrl: 'cr-model-list.html',

      link: function(scope, elem, attrs) {

        crCommon.watch(scope, function(scope) {
          return !!scope.type;
        }).then(
          function(scope) {
            crResources.get(scope.type).view('all', { limit: 10 }).then(
              function success(result) {

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
              }
            );
          }
        );

        scope.select = function(id) {
          scope.$emit('model:select', id);
        };
      }
    };
  });
  
})();
(function() {

  var module = angular.module('cores.directives');
  
  
  module.directive('crModelSelectRef', function(crCommon, crResources) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      
      replace: true,
      templateUrl: 'cr-model-select-ref.html',

      
      link: function(scope, elem, attrs) {

        scope.$on('item:remove', function(e, model) {
          console.log('got item:remove', model, scope.model);
          console.log('is me', model === scope.model);
        });
        
        scope.selectedItem = '';
        scope.items = [];

        var modelsByName = {};

        crCommon.watch(scope, function(scope) {
          return scope.model && scope.schema;
        }).then(
          function(scope) {

            // property name to display in selectbox
            var property = attrs.property || 'title';

            crResources.get(scope.schema.$ref).view('all').then(
              function success(models) {

                models.rows.forEach(function(row) {

                  var name = row.value[property];
                  modelsByName[name] = row.value;
                  
                  scope.items.push(name);

                  // set selected
                  if (scope.model.id && scope.model.id === row.id) {
                    scope.selectedItem = name;
                  }
                });
              }
            );
          }
        );        

        scope.$watch('selectedItem', function(newValue, oldValue) {
          if (newValue) {
            scope.model.id = modelsByName[newValue]._id;
          }
        });
      }
    };
  });
  
  
  module.directive('crModelCreateRef', function($compile, crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },

      replace: true,
      templateUrl: 'cr-model-create-ref.html',

      controller: function($scope) {

        var refId = crCommon.getRefId();
        var off;
        
        // events
        
        $scope.$on('submit', function(e, model) {
          e.stopPropagation();

          $scope.subModel = model.model();
          $scope.subFiles = model.files();
          $scope.closeModal();

          // listen to changes of models id
          
          if (off) off();
          off = model.scope().$on('model:set:id', function(e, id) {
            console.log('setting id to ref', id);
            e.stopPropagation();
            $scope.model.id = id;
          });
          
          // notify model
          
          $scope.$emit('ref:set', refId, model);
        });

        
        $scope.$on('cancel', function(e) {
          e.stopPropagation();
          console.log('on cancel');
        });
      },

      
      link: function(scope, elem, attrs) {

        scope.modalId = crCommon.getModalId();
        scope.closeModal = function() {
          elem.find('.modal').modal('hide');
        };

        crCommon.watch(scope, function(scope) {
          return scope.model && scope.schema;
        }).then(
          function(scope) {
            if (scope.schema.view.preview) {
              var tmpl = '<div ' + scope.schema.view.preview + ' model="subModel" files="subFiles"/>';
              var e = $compile(tmpl)(scope);
              elem.find('.indent').append(e);
            }
          }
        );
      }
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');

  
  module.controller('crModelCtrl', function($scope, $q, crResources, crSchema, crCommon) {

    var ModelCtrl = function() {

      var self = this;
      
      this._refs = {};
      this._files = {};

      this._init().then(
        function() {
          $scope.$emit('model:ready');
        }
      );
    };
    

    ModelCtrl.prototype._init = function() {

      var self = this;
      
      return crCommon.watch($scope, function(scope) {
        return !!scope.type;
      }).then(
        function(scope) {
          self._resource = crResources.get(scope.type);

          // add/update/remove files from the model
          $scope.$on('file:set', angular.bind(self, self.onFileSet));
          $scope.$on('file:remove', angular.bind(self, self.onFileRemove));

          // add/update/remove submodels
          $scope.$on('ref:set', angular.bind(self, self.onRefSet));
          $scope.$on('ref:remove', angular.bind(self, self.onRefRemove));

          self._initScopeFunctions();

          return self.load();
        }
      );
    };


    ModelCtrl.prototype._initScopeFunctions = function() {

      var self = this;
      
      $scope.save = function() {
        self.save();
      };

      $scope.submit = function() {
        $scope.$emit('submit', self);
      };

      $scope.cancel = function() {
        $scope.$emit('cancel');
      };

      $scope.destroy = function() {
        throw new Error('not implemented');
        self.destroy();
      };
    };

    
    //
    // event handlers
    //
    
    ModelCtrl.prototype.onFileSet = function(e, id, file) {
      e.stopPropagation();
      this._files[id] = file;
    };

    
    ModelCtrl.prototype.onFileRemove = function(e, id) {
      e.stopPropagation();
      console.log('remove file', id);
      if (!this._files.hasOwnProperty(id)) {
        throw new Error('Cannot remove file which does not exist');
      }
      delete this._files[id];
    };

    
    ModelCtrl.prototype.onRefSet = function(e, id, ref) {
      e.stopPropagation();
      this._refs[id] = ref;
    };

    
    ModelCtrl.prototype.onRefRemove = function(e, id) {
      e.stopPropagation();
      if (!this._refs.hasOwnProperty(id)) {
        throw new Error('Cannot remove ref which does not exist');
      }
      delete this._refs[id];
    };


    //
    // getters/setters
    //
    
    ModelCtrl.prototype.id = function(id) {
      if (!id) {
        return $scope.model._id;
      }
      $scope.model._id = id;
      $scope.$emit('model:set:id', id);
    };
    

    ModelCtrl.prototype.parentId = function(id) {
      if (!id) {
        return $scope.model.parentId_;
      }
      return $scope.model.parentId_ = id;
    };


    ModelCtrl.prototype.scope = function() {
      return $scope;
    };
    

    ModelCtrl.prototype.model = function() {
      return $scope.model;
    };


    ModelCtrl.prototype.files = function() {
      return this._files;
    };

    
    //
    // methods
    //
    
    ModelCtrl.prototype.load = function() {

      // load model
      
      var self = this;
      var id = $scope.id;

      return this._resource.schema().then(function(schema) {
        if (!id) {
          $scope.schema = schema;
          $scope.model = crSchema.createValue(schema);
        }
        else {
          return self._resource.load(id).then(function(doc) {
            $scope.schema = schema;
            $scope.model = doc;
          });
        }
      });
    };


    ModelCtrl.prototype.save = function() {

      // trigger saving on this and all referenced models
      
      var self = this;
      var refModels = Object.keys(this._refs).map(function(k) { return self._refs[k]; });

      // collect all new models that need an id
      
      var newModels = refModels.filter(function(model) {
        return !model.id();
      });
      if (!this.id()) {
        newModels.push(this);
      }
      
      if (newModels.length === 0) {

        // no new models, just save all

        return this._saveAll(refModels);
      }
      else {

        // get and set ids for new models and then save them

        return crResources.getIds(newModels.length).then(
          function(ids) {

            newModels.forEach(function(model) {
              model.id(ids.pop());
            });

            return self._saveAll(refModels);
          }
        );
      }
    };


    ModelCtrl.prototype._saveAll = function(refModels) {

      var self = this;
      
      // collect files

      var files = Object.keys(this._files).map(function(k) { return self._files[k]; });
      
      // collect save promises for $q.all and return that promise

      var promises = refModels.map(function(model) {
        // set the parent id on child models
        model.parentId(self.id());
        return model.save();
      });

      promises.push(this._resource.save($scope.model, files).then(function(doc) {
        $scope.model = doc;
      }));

      return $q.all(promises);
    };


    return new ModelCtrl();
  });

  

  module.directive('crModel', function($templateCache) {
    return {
      scope: {
        type: '=',
        id: '=',
        actions: '@'
      },

      replace: true,
      templateUrl: 'cr-model.html',

      controller: 'crModelCtrl'
    };
  });


  module.directive('crModelModal', function() {
    return {
      scope: {
        type: '=',
        id: '=',
        actions: '@',
        modalId: '@'
      },

      replace: true,
      templateUrl: 'cr-model-modal.html',

      controller: 'crModelCtrl'
    };
  });
  
  
  module.directive('crModelForm', function($compile, crBuild, crSchema, crCommon) {
    return {
      scope: {
        schema: '=',
        model: '='
      },

      replace: true,
      templateUrl: 'cr-model-form.html',

      link: function(scope, elem, attrs) {

        crCommon.watch(scope, function(scope) {
          return scope.model && scope.schema;
        }).then(
          function(scope) {
            if (!crSchema.isObjectSchema(scope.schema) &&
                !crSchema.isArraySchema(scope.schema)) {
              throw new Error('Top level schema has to be a object or array');
            }

            var tmpl = crBuild(scope.schema, scope.model, 'schema', 'model',
                               { mode: 'minimal'});
            
            var link = $compile(tmpl);
            var content = link(scope);

            elem.html(content);
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
                                'schema.properties.' + key, 'model.' + key);
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

  module.directive('crPassword', function(crCommon) {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-password.html',

      controller: crCommon.StandardCtrl,
      
      link: function(scope, elem, attr) {
        scope.pass1 = '';
        scope.pass2 = '';

        scope.$watch(function(scope) {
          if (scope.pass1 || scope.pass2) {
            if (scope.pass1 === scope.pass2) {
              scope.model = scope.pass1;
            }
          }
        });
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
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-boolean.html',
      controller: crCommon.StandardCtrl
    };
  });


  //
  // integer
  //
  
  module.directive('crInteger', function(crCommon) {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-integer.html',
      controller: crCommon.StandardCtrl
    };
  });


  //
  // number
  //
  
  module.directive('crNumber', function(crCommon) {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-number.html',
      controller: crCommon.StandardCtrl
    };
  });

  
  //
  // string
  //
  
  module.directive('crString', function(crCommon) {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-string.html',
      controller: crCommon.StandardCtrl
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
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-enum.html',

      controller: crCommon.StandardCtrl

      // link: function(scope, elem, attrs) {

      //   crCommon.watch(scope, function(scope) { return !!scope.schema; }).then(
      //     function(scope) {

      //       var numItems = scope.enum.length;

      //       if (numItems === 0) {
      //         scope.$emit('ready');
      //         return;
      //       }

      //       var off = scope.$on('ready', function(e) {
      //         e.stopPropagation();
      //         if (--numItems === 0) {
      //           off();
      //           scope.$emit('ready');
      //         }
      //       });
      //     }
      //   );
      // }
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