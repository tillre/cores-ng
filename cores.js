(function() {

  //
  // main module
  //
  angular.module('cores', ['ng',
                           'cores.services',
                           'cores.templates',
                           'cores.directives']);

  
  var NS = 'cr';
  var module = angular.module('cores.templates', ['ng']);

  
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
              '<div ' + NS + '-array-item schema="schema.items" model="model"></div>' +
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
            '<ul class="dropdown-menu">' +
              '<li ng-repeat="schema in schema.items.anyOf">' +
                '<a ng-click="addItem(schema)">{{schema.name}}</a>' +
              '</li>' +
            '</ul>' +
          '</div>' +

          '<ul class="unstyled">' + 
            '<li ng-repeat="model in model"><div ' + NS + '-anyof-item model="model"></div></li>' +
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
    
    // model-ref
    
    $templateCache.put(
      'cr-model-ref.html',
      '<div>' +
        '<label><strong>{{name}}:</strong></label>' +
        '<div class="indent">' +
          '<button href="#{{modalId}}" class="btn" data-toggle="modal">Change</button>' +
          '<div cr-modal-model modal-id="{{modalId}}" type="{{schema.$ref}}"></div>' +
        '</div>' +
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

    $templateCache.put(
      'cr-modal-model.html',
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
            '<button ng-click="save()" class="btn btn-primary pull-left">Save</button>' +
            '<button ng-click="cancel()" class="btn pull-right" data-dismiss="modal">Cancel</button>' +
        '</div>' +
      '</div>'
    );

    $templateCache.put(
      'cr-model-form.html',
      '<form></form>'
    );
    
  }]);
})();
(function() {

  var NS = 'cr';
  var module = angular.module('cores.services', ['ng']);

  
  //
  // create a object with default values from schema
  //
  
  function createDefaultModel(schema, typeName) {
    if (schema.enum) {
      return schema.enum[0];
    }
    if (schema.$ref) {
      return {};
    }
    // infer object and array
    if (!schema.type) {
      if (schema.properties) schema.type = 'object';
      if (schema.items) schema.type = 'array';
    }
    
    if (!schema.type) throw new Error('Cannot create default value for schema without type');

    var hasDefaultValue = schema.hasOwnProperty('default');
    
    switch(schema.type) {
    case 'boolean': return hasDefaultValue ? schema.default : true;
    case 'integer': return hasDefaultValue ? schema.default : 0;
    case 'number': return hasDefaultValue ? schema.default : 0;
    case 'string': return hasDefaultValue ? schema.default : '';
    case 'object':
      if (hasDefaultValue) return schema.default;
      
      var obj = {};
      angular.forEach(schema.properties, function(propSchema, name) {
        // ignore some vals
        if (name === '_id' || name === '_rev' || name === 'type_') return;
        obj[name] = createDefaultModel(propSchema);
      });
      if (typeName) {
        obj.type_ = typeName;
      }
      return obj;
    case 'array': return hasDefaultValue ? schema.default : [];
    default: throw new Error('Cannot create default value for unknown type: ' + schema.type);
    }
  }


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
  // build the html element for the type
  //
  
  function buildElement(type, schemaPath, modelPath, name, options) {
    var e = '<div' +
          ' ' + NS + '-' + type +
          ' schema="' + schemaPath + '"' +
          ' model="' + modelPath + '"' +
          ' name="' + name + '"';

    angular.forEach(options, function(value, key) {
      e += ' ' + key + '="' + value + '"';
    });
    
    e += '/>';

    return e;
  }
  

  //
  // Create a template for a schema with optional view configuration
  // 
  
  function buildTemplate(schema, model, schemaPath, modelPath, options) {

    schemaPath = schemaPath || 'schema';
    modelPath = modelPath || 'model';
    options = options || {};
    
    // infer type
    if (!schema.type) {
      if (schema.properties) schema.type = 'object';
      if (schema.items) schema.type = 'array';
    }

    if (!schema.$ref && !angular.isString(schema.type)) {
      throw new Error('Only single types are supported');
    }

    var viewType = schema.type;
    var viewName = getModelName(schema, modelPath);

    // handle extended types
    
    if (schema.enum) {
      viewType = 'enum';
    }
    if (schema.$ref) {
      viewType = 'model-ref';
    }
    if (viewType === 'array' && schema.items.anyOf) {
      viewType = 'anyof-array';
    }

    if (schema.view) {

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
  // create the service module
  //
  
  module.service('cores', function($http, $q, $rootScope) {

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

      if (response.errors) {
        err.errors = response.errors;
      }
      return err;
    };

    
    //
    // Resource class
    //

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

      var def = $q.defer();

      $http.get(this.host + this.schemaPath).then(
        function(res) { def.resolve(res.data); },
        function(res) { def.reject(makeError(res)); }
      );
      return def.promise;
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
      var def = $q.defer();

      $http.get(path, config).then(
        function(res) { def.resolve(res.data); },
        function(res) { def.reject(makeError(res)); }
      );
      return def.promise;
    };

    
    //
    // Save/update a resource on the server
    //
    
    Resource.prototype.save = function(doc, file) {

      var def = $q.defer();

      // create multipart formdata when saving files

      if (file) {
        console.log('create multipart data');
        var fd = new FormData();
        fd.append('type_', this.type);
        fd.append('doc', JSON.stringify(doc));
        fd.append('file', file);

        if (doc._id && doc._rev) {
          // when updating, add the id and rev
          fd.append('_id', doc._id);
          fd.append('_rev', doc._rev);
        }
        doc = fd;
      }
      
      if (doc._id && doc._rev) {

        // update
        
        $http.put(this.host + this.path + '/' + doc._id + '/' + doc._rev, doc).then(
          function(res) { def.resolve(res.data); },
          function(res) { def.reject(makeError(res)); }
        );
      }
      else {

        // create

        if (doc instanceof FormData) {

          // send multipart with a xhr for now, $http seems to have problems with it
          var xhr = new XMLHttpRequest();

          xhr.addEventListener('load', function() {

            var data = typeof xhr.response === 'string' ? JSON.parse(xhr.response) : xhr.response;

            if (xhr.status === 200) {
              // success
              def.resolve(data);
            }
            else {
              // error
              def.reject(makeError(data));
            }
            // call apply, because we are outside the angular life-cycle
            $rootScope.$apply();
          });
          
          xhr.open('POST', this.host + this.path);
          xhr.send(doc);
        }
        else {
          $http.post(this.host + this.path, doc).then(
            function(res) { def.resolve(res.data); },
            function(res) { def.reject(makeError(res.data)); }
          );
        }
      }
      return def.promise;
    };


    //
    // Delete a resource on the server
    //
    
    Resource.prototype.destroy = function(doc) {

      var def = $q.defer();
      $http.delete(this.host + this.path + '/' + doc._id + '/' + doc._rev).then(
        function(res) { def.resolve(); },
        function(res) { def.reject(makeError(res)); }
      );
      return def.promise;
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

      var def = $q.defer();
      $http.get(path, config).then(
        function(res) { def.resolve(res.data); },
        function(res) { def.reject(makeError(res)); }
      );
      return def.promise;
    };


    
    
    //
    // loads model config(urls) and create resources from it
    //
    
    var resources = {};

    function loadIndex(host) {

      host = host || '';
      
      var def = $q.defer();

      $http.get(host + '/_index').then(

        function(res) {
          angular.forEach(res.data, function(value, key) {
            resources[key] = new Resource(key, value, { host: host });
          });
          def.resolve();
        },
        
        function(res) {
          def.reject(makeError(res));
        }
      );
      return def.promise;
    }


    //
    // get a Resource object
    //
    
    function getResource(type) {

      var r = resources[type];
      if (!r) {
        throw new Error('Resource with type not found: ' + type);
      }
      return r;
    }
    

    //
    // public
    //
    
    return {
      initialize: loadIndex,
      getResource: getResource,
      createModel: createDefaultModel,
      buildTemplate: buildTemplate
    };
  });

})();
/*global angular*/


(function() {

  var NS = 'cr';
  var module = angular.module('cores.directives', ['ng',
                                                   'cores.templates',
                                                   'cores.services']);


  var READY_EVENT = 'ready';
  
  
  function isObjectSchema(schema) {
    return schema.type === 'object' || schema.properties;
  }
  
  function isArraySchema(schema) {
    return schema.type === 'array' || schema.items;
  }

  
  // watch the scope for changes until condition() returns true and call then()

  function watchUntil(scope, condition, then) {
    var unwatch = scope.$watch(function watchUntil(scope) {
      if (condition(scope)) {
        unwatch();
        then(scope);
      }
    });
  }


  
  // -- type directives --------------------------------------------------


  function StandardCtrl($scope) {
    var unwatch = $scope.$watch('model', function stdWatch() {
      unwatch();
      $scope.$emit(READY_EVENT);
    });
  }
  
  //
  // boolean
  //
  
  module.directive(NS + 'Boolean', function() {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-boolean.html',
      controller: StandardCtrl
    };
  });


  //
  // integer
  //
  
  module.directive(NS + 'Integer', function() {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-integer.html',
      controller: StandardCtrl
    };
  });


  //
  // number
  //
  
  module.directive(NS + 'Number', function() {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-number.html',
      controller: StandardCtrl
    };
  });

  
  //
  // string
  //
  
  module.directive(NS + 'String', function() {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-string.html',
      controller: StandardCtrl
    };
  });


  //
  // enum
  //
  
  module.directive(NS + 'Enum', function($compile) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-enum.html',
      controller: StandardCtrl
    };
  });


  //
  // object
  //
  
  module.directive(NS + 'Object', function($compile, $templateCache, cores) {
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
        // TODO: use replaceWith instead of append, as soon as angular supports it
        // tElem.replaceWith(template);
        tElem.append(template);

        // Linking function
        
        return function link(scope, elem, attrs) {

          scope.numProperties = 0;

          // listen for childs ready event and ready up when all fired
          var offready = scope.$on(READY_EVENT, function(e) {
            e.stopPropagation();
            if (--scope.numProperties === 0) {
              offready();
              scope.$emit(READY_EVENT);
            }
          });

          watchUntil(
            scope,
            function condition(scope) { return scope.model && scope.schema; },
            function then(scope) {

              // create templates for properties
              var tmpl = '';
              angular.forEach(scope.schema.properties, function(subSchema, key) {

                // ignore some keys
                if (key === '_id' || key === '_rev' || key === 'type_') return;
                
                if (!scope.model.hasOwnProperty(key)) {
                  scope.model[key] = cores.createModel(subSchema);
                }

                scope.numProperties += 1;
                
                tmpl += cores.buildTemplate(subSchema, scope.model[key],
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


  function ArrayCtrl($scope, cores) {

    $scope.addItem = function addItem(schema) {
      var obj = cores.createModel(schema, schema.name);
      $scope.model.push(obj);
    };

    // methods called by the array item controller
    
    this.removeItem = function removeItem(index) {
      $scope.model.splice(index, 1);
    };

    this.moveItemUp = function moveItemUp(index) {
      if (index === 0) return;
      $scope.model.splice(index - 1, 0, $scope.model.splice(index, 1)[0]);
    };

    this.moveItemDown = function moveItemDown(index) {
      if (index >= $scope.model.length) return;
      $scope.model.splice(index + 1, 0, $scope.model.splice(index, 1)[0]);
    };
  }


  function AnyofArrayCtrl($scope, cores) {

    // Inherit from ArrayCtrl
    ArrayCtrl.apply(this, arguments);

    this.getSchema = function getSchema(type) {
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
  
  module.directive(NS + 'ArrayItem', function($compile, cores) {
    return {
      require: '^' + NS + 'Array',
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
        
        var tmpl = cores.buildTemplate(scope.schema, scope.model, 'schema', 'model',
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
  
  module.directive(NS + 'AnyofItem', function($compile, cores) {
    return {
      require: '^' + NS + 'AnyofArray',
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
        
        var tmpl = cores.buildTemplate(scope.schema, scope.model, 'schema', 'model',
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
  
  module.directive(NS + 'Array', function(cores) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },

      replace: true,
      templateUrl: 'cr-array.html',

      controller: ArrayCtrl,
      
      link: function postLink(scope, elem, attrs) {
        // ngrepeat can only bind to references when it comes to form fields
        // thats why we can only work with items of type object not primitives
        // this may change in a feature release
        if (!isObjectSchema(scope.schema.items)) {
          throw new Error('Array items schema is not of type object: ' + JSON.stringify(scope.schema.items));
        }
        scope.$emit(READY_EVENT);
      }
    };
  });


  //
  // anyof array
  //
  
  module.directive(NS + 'AnyofArray', function($compile, cores) {
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
        scope.$emit(READY_EVENT);
      }
    };
  });


  // -- view directives --------------------------------------------------

  
  module.directive(NS + 'Text', function() {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-text.html',
      controller: StandardCtrl
    };
  });


  module.directive(NS + 'ModelRef', function($compile, cores) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },

      replace: true,
      templateUrl: 'cr-model-ref.html',

      controller: function($scope) {

        $scope.$on('save', function(e, doc) {
          e.stopPropagation();
          // deep copy doc to model
          angular.copy(doc, $scope.model);
          $scope.closeModal();
        });

        $scope.$on('cancel', function(e) {
          e.stopPropagation();
          console.log('on cancel');
        });
      },

      
      link: function(scope, elem, attrs) {

        scope.modalId = 'model-ref-modal';
        scope.closeModal = function() {
          elem.find('.modal').modal('hide');
        };
        
        watchUntil(
          scope,
          function condition(scope) { return scope.model && scope.schema; },
          function then(scope) {
            if (scope.schema.view.preview) {
              var tmpl = '<div ' + scope.schema.view.preview + ' model="model"/>';
              var e = $compile(tmpl)(scope);
              elem.find('.indent').append(e);
            }
          }
        );
      }
    };
  });
  

  module.directive(NS + 'Image', function($compile, cores) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      
      replace: true,
      templateUrl: 'cr-image.html',

      link: function postLink(scope, elem, attrs) {

        var input = elem.find('input[type="file"]');
        var preview = elem.find('img');

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

          // preview img
          var reader = new FileReader();
          reader.onload = function(e) {
            preview.attr('src', e.target.result);
          };
          reader.readAsDataURL(file);

          scope.model.name = file.name;
          scope.$emit('file', file);
          scope.$apply();
        });

        scope.$emit(READY_EVENT);
      }
    };
  });


  module.directive(NS + 'ImagePreview', function() {
    return {
      scope: {
        model: '='
      },

      replace: true,
      templateUrl: 'cr-image-preview.html',

      link: function(scope, elem, attr) {
        scope.$watch('model.file.url', function(url) {
          if (url) {
            elem.find('img').attr('src', url);
          }
        });
      }
    };
  });
  
  
  

  
  // -- model directive --------------------------------------------------


  function ModelCtrl($scope, cores) {

    var resource;
    
    // create when type and id(optional) are set

    watchUntil(
      $scope,
      function condition(scope) { return scope.type; },
      function then(scope) {
        create(scope.type, scope.id);
      }
    );

    function create(type, id) {
      resource = cores.getResource(type);
      resource.schema().then(
        function success(schema) {
          $scope.schema = schema;

          if (!id) {
            // create a new empty model
            $scope.model = cores.createModel(schema);
          }
          else {
            // load the model with the id
            resource.load(id).then(
              function(doc) {
                $scope.model = doc;
              }
            );
          }
        },
        function error(err) {
          throw new Error(err);
        }
      );
    };

    // events

    $scope.$on('file', function(e, file) {
      e.stopPropagation();
      console.log('add file', arguments);
      $scope.file = file;
    });

    
    // button click functions
    
    $scope.save = function() {

      resource.save($scope.model, $scope.file).then(
        function success(doc) {
          console.log('success', doc);
          $scope.model = doc;
          $scope.$emit('save', doc);
        },
        function error(err) {
          throw new Error(err);
        }
      );
    };


    $scope.cancel = function() {
      $scope.$emit('cancel', 1, 2, 3);
    };
    

    $scope.destroy = function() {
      throw new Error('not implemented');

      resource.destroy($scope.model).then(
        function success() { console.log('destroy success'); },
        function error(err) {
          throw new Error(err);
        }
      );
    };
  }
  

  module.directive(NS + 'Model', function(cores) {
    return {
      scope: {
        type: '@',
        id: '@'
      },
      replace: true,
      templateUrl: 'cr-model.html',
      controller: ModelCtrl
    };
  });

  
  module.directive(NS + 'ModalModel', function(cores) {
    return {
      scope: {
        type: '@',
        id: '@',
        modalId: '@'
      },
      replace: true,
      templateUrl: 'cr-modal-model.html',
      controller: ModelCtrl
    };
  });

  
  module.directive(NS + 'ModelForm', function($compile, cores) {
    return {
      scope: {
        schema: '=',
        model: '='
      },

      replace: true,
      templateUrl: 'cr-model-form.html',

      link: function(scope, elem, attrs) {
        watchUntil(
          scope,
          function condition(scope) { return scope.model && scope.schema; },
          function then(scope) {

            if (!isObjectSchema(scope.schema) && !isArraySchema(scope.schema)) {
              throw new Error('Top level schema has to be a object or array');
            }

            var tmpl = cores.buildTemplate(scope.schema, scope.model, 'schema', 'model',
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
