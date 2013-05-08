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


  // -- type directives --------------------------------------------------


  function StandardCtrl($scope) {

    $scope.isReady = false;

    $scope.$watch('model', function() {
      if ($scope.isReady) return;
      $scope.isReady = true;
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
        tElem.append(template);

        // Linking function
        
        return function link(scope, elem, attrs) {

          scope.isReady = false;
          scope.numProperties = 0;

          // listen for childs ready event and ready up when all fired
          var offready = scope.$on(READY_EVENT, function(e) {
            e.stopPropagation();
            if (--scope.numProperties === 0) {
              offready();
              scope.$emit(READY_EVENT);
            }
          });
          
          scope.$watch(function(scope) {

            if (!scope.model || !scope.schema || scope.isReady) {
              return;
            }
            scope.isReady = true;

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
      },


      link: function(scope, elem, attrs) {
        scope.$emit(READY_EVENT);
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
        // this may change in a feature release
        if (!isObjectSchema(scope.schema.items)) {
          throw new Error('Array items schema is not of type object: ' + JSON.stringify(scope.schema.items));
        }
        console.log('array model', scope.model);

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


  module.directive(NS + 'ImageRef', function(cores) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },

      replace: true,
      templateUrl: 'cr-image-ref.html',

      controller: function($scope) {
        $scope.src = '';

        if ($scope.model) {
          console.log('model has value');

          var id = $scope.model;

          cores.getResource('Image').load(id).then(
            function(doc) {
              console.log('image', doc);
            },
            function(err) {
              throw new Error(err);
            }
          );
        }
      },

      link: function(scope, elem, attrs) {
        scope.$emit(READY_EVENT);
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
          scope.$emit('RegisterFile', file);
          scope.$apply();
        });

        scope.$emit(READY_EVENT);
      }
    };
  });

  
  // -- model directive --------------------------------------------------

  
  module.directive(NS + 'Model', function($compile, cores) {

    return {
      scope: {
        type: '@',
        model: '=?',
        id: '@'
      },

      replace: true,
      templateUrl: 'cr-model.html',

      controller: function($scope, $http) {

        // build/load when type has been set
        
        $scope.$watch('type', function(type) {

          var res = cores.getResource(type);

          res.schema().then(
            function(schema) {
              $scope.schema = schema;

              if ($scope.value) {
                // use provided model value
                return;
              }

              if ($scope.id) {
                // load the model
                res.load($scope.id).then(
                  function(doc) {
                    $scope.model = doc;
                  }
                );
                return;
              }
              
              // create a new model
              $scope.model = cores.createModel(schema);
            }
          );
        });

        
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
          throw new Error('not implemented');
        };
        

        $scope.destroy = function() {
          throw new Error('not implemented');
        };
      },
      
      link: function(scope, elem, attrs, controller) {

        // build only once
        scope.isReady = false;

        var offready = scope.$on(READY_EVENT, function(e) {
          // let the event bubble as it is the final ready event
          offready();
        });
        
        scope.$watch(function(scope) {

          if (!scope.model || !scope.schema || scope.isReady) {
            return;
          }
          scope.isReady = true;

          console.log('build model', scope.model, scope.schema);
          
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
