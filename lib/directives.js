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
          // angular.copy(doc, $scope.model);
          $scope.model.id = doc._id;
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


  module.directive(NS + 'ImagePreview', function(cores) {
    return {
      scope: {
        model: '='
      },

      replace: true,
      templateUrl: 'cr-image-preview.html',

      link: function(scope, elem, attr) {
        // scope.$watch('model.file.', function(url) {
        //   if (url) {
        //     elem.find('img').attr('src', url);
        //   }
        // });
        scope.$watch('model.id', function(id) {
          if (id) {
            cores.getResource('Image').load(id).then(
              function success(doc) {
                elem.find('img').attr('src', doc.file.url);    
              }
            );
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
