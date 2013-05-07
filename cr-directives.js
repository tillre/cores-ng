/*global angular*/


(function() {

  var NS = 'cr';
  var module = angular.module('cores.directives', ['ng',
                                                   'cores.templates',
                                                   'cores.services']);

  
  function isObjectSchema(schema) {
    return schema.type === 'object' || schema.properties;
  }
  
  function isArraySchema(schema) {
    return schema.type === 'array' || schema.items;
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
      templateUrl: 'cr-boolean.html'
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
      templateUrl: 'cr-integer.html'
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
      templateUrl: 'cr-number.html'
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
      templateUrl: 'cr-string.html'
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
      templateUrl: 'cr-enum.html'
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
        tElem.append(template);

        // Linking function
        
        return function link(scope, elem, attrs) {

          var isBuild = false;
          
          scope.$watch(function(scope) {

            if (!scope.model || isBuild) {
              return;
            }
            isBuild = true;

            // create templates for properties
            var tmpl = '';
            angular.forEach(scope.schema.properties, function(subSchema, key) {

              // ignore some keys
              if (key === '_id' || key === '_rev' || key === 'type_') return;
              
              if (!scope.model.hasOwnProperty(key)) {
                scope.model[key] = cores.createModel(subSchema);
              }

              tmpl += cores.buildTemplate(subSchema, scope.model[key],
                                          'schema.properties.' + key, 'model.' + key);
            });

            // compile and link templates
            var link = $compile(tmpl);
            var content = link(scope);
            elem.find('.properties').append(content);
          });
        };
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

      
      controller: function($scope) {

        $scope.moveUp = function() {
          $scope.anyof.moveItemUp($scope.$parent.$index);
        };

        $scope.moveDown = function() {
          $scope.anyof.moveItemDown($scope.$parent.$index);
        };

        $scope.remove = function() {
          $scope.anyof.removeItem($scope.$parent.$index);
        };
      },

      
      link: function(scope, elem, attrs, anyof) {

        // get the schema from the anyof-array
        scope.schema = anyof.getSchema(scope.model.type_);
        scope.anyof = anyof;
        
        var tmpl = cores.buildTemplate(scope.schema, scope.model, 'schema', 'model',
                                       { 'mode': 'minimal' });
        var link = $compile(tmpl);
        var e = link(scope);
        elem.append(e);
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
      
      controller: function($scope, cores) {

        $scope.addItem = function addItem(schema) {
          var obj = cores.createModel(schema, schema.name);
          $scope.model.push(obj);
        };

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
    };
  });


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

      link: function(scope, elem, attrs, array) {

        elem.find('button').on('click', function(e) {
          array.removeItem(scope.$parent.$index);
        });
        
        var tmpl = cores.buildTemplate(scope.schema, scope.model, 'schema', 'model',
                                       { mode: 'minimal' });

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

      controller: function($scope, cores) {
        $scope.addItem = function() {
          $scope.model.push(
            cores.createModel($scope.schema.items)
          );
        };

        this.removeItem = function removeItem(index) {
          $scope.model.splice(index, 1);
          $scope.$apply();
        };
      },
      
      link: function postLink(scope, elem, attrs) {
        // ngrepeat can only bind to references when it comes to form fields
        // thats why we can only work with items of type object not primitives
        if (!isObjectSchema(scope.schema.items)) {
          throw new Error('Array items schema is not of type object: ' + JSON.stringify(scope.schema.items));
        }
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
      templateUrl: 'cr-text.html'
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
          scope.$emit('RegisterFile', file);
          scope.$apply();
        });
      }
    };
  });

  
  // -- model directive --------------------------------------------------

  module.directive(NS + 'Model', function($compile, cores) {

    return {
      scope: {
        model: '=',
        schema: '=',
        type: '='
      },

      replace: true,
      templateUrl: 'cr-model.html',

      controller: function($scope, $http) {
        $scope.$on('RegisterFile', function(event, file) {
          console.log('RegisterFile Event', arguments);
          $scope.file = file;
        });

        $scope.save = function() {

          var payload;
          var doc = $scope.model;
          
          if ($scope.file) {

            // multipart request, put doc/file/id/rev/type on formdata

            var fd = new FormData();
            fd.append('type_', $scope.type);
            fd.append('doc', JSON.stringify(doc));
            fd.append('file', $scope.file);

            if (doc._id && doc._rev) {
              // when updating, add the id and rev
              fd.append('_id', doc._id);
              fd.append('_rev', doc._rev);
            }
            payload = fd;

            console.log('sending formdata', payload);
          }
          else {

            // application/json request
            
            payload = doc;
          }

          var r = cores.getResource($scope.type);
          r.save(payload).then(
            function(data) {
              console.log('success', data);
              $scope.model = data;
            },
            function(data) {
              console.log('error', data);
            }
          );
        };


        $scope.cancel = function() {
        };
        

        $scope.destroy = function() {
        };
      },
      
      link: function(scope, elem, attrs, controller) {

        // build only once
        var isBuild = false;
        
        scope.$watch(function(scope) {

          if (!scope.model || isBuild) {
            return;
          }
          isBuild = true;
          
          if (!scope.schema) {
            throw new Error('No Schema defined');
          }
          if (!isObjectSchema(scope.schema) && !isArraySchema(scope.schema)) {
            throw new Error('Top level schema has to be a object or array');
          }

          var tmpl = cores.buildTemplate(scope.schema, scope.model, 'schema', 'model',
                                         { mode: 'minimal'});
          var link = $compile(tmpl);
          var content = link(scope);
          elem.find('form').html(content);
        });
      }
    };
  });
  
})();
