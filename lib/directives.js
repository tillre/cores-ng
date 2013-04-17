/*global angular*/


(function() {

  var module = angular.module('comodl.directives', ['ng', 'comodl.services']);


  //
  // boolean
  //
  module.directive('cmBoolean', function() {
    return {
      replace: true,
      scope: {
        model: '=',
        name: '@'
      },
      template: '<label>{{name}}<input type="checkbox" ng-model="model"/></label>'
    };
  });


  //
  // integer
  //
  module.directive('cmInteger', function() {
    return {
      replace: true,
      scope: {
        model: '=',
        name: '@'
      },
      template: '<label>{{name}}<input type="number" ng-model="model"/></label>'
    };
  });


  //
  // number
  //
  module.directive('cmNumber', function() {
    return {
      replace: true,
      scope: {
        model: '=',
        name: '@'
      },
      template: '<label>{{name}}<input type="number" ng-model="model"/></label>'
    };
  });

  
  //
  // string
  //
  module.directive('cmString', function() {
    return {
      replace: true,
      scope: {
        model: '=',
        name: '@'
      },
      template: '<label>{{name}}<input type="text" ng-model="model"/></label>'
    };
  });


  //
  // enum
  //
  module.directive('cmEnum', function($compile) {
    return {
      replace: true,
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      template: '<label>{{name}}<select ng-model="model" ng-options="e for e in schema.enum"></select></label>'
    };
  });

  
  //
  // object
  //
  module.directive('cmObject', function($compile, builder) {
    return {
      replace: 'true',
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      template: '<div></div>',

      link: function postLink(scope, elem, attrs) {
        // console.log('-- link object --', scope.schema, scope.model);

        var tmpl = '<label>{{name}}</label><ul>';
        angular.forEach(scope.schema.properties, function(subSchema, key) {

          if (!scope.model.hasOwnProperty(key)) {
            scope.model[key] = builder.createModel(subSchema);
          }
          
          tmpl += builder.build(subSchema, scope.model[key],
                                'schema.properties.' + key, 'model.' + key);
        });
        tmpl += '</ul>';
        
        // compile and link
        var link = $compile(tmpl);
        var content = link(scope);
        elem.append(content);
      }
    };
  });

  
  //
  // anyof array item
  //
  module.directive('cmAnyofItem', function($compile, builder) {
    return {
      require: '^cmAnyofArray',
      replace: true,
      scope: {
        model: '='
      },
      template: '<div><button ng-click="remove()">Remove</button></div>',

      link: function(scope, elem, attrs, anyof) {
        // get the schema from the anyof-array
        scope.schema = anyof.getSchema(scope.model._type);
        
        elem.find('button').on('click', function(e) {
          anyof.removeItem(scope.$parent.$index);
        });
        
        var tmpl = builder.build(scope.schema, scope.model, 'schema', 'model');
        var link = $compile(tmpl);
        var e = link(scope);
        elem.append(e);
      }
    };
  });
  
  module.directive('cmAnyofArray', function($compile, builder) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      template: '<div>{{name}}<div class="controls"/><ul><li ng-repeat="model in model"><div cm-anyof-item model="model"></div></li></ul></div>',

      
      controller: function($scope, builder) {

        $scope.addItem = function addItem(schema) {
          if (!schema.type === 'object' || !schema.properties) {
            throw new Error('Schema must be of type object');
          }
          var obj = builder.createModel(schema, schema.name);
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
          $scope.$apply();
        };
      },

      
      link: function(scope, elem, attrs) {
        
        var tmpl = '';
        angular.forEach(scope.schema.items.anyOf, function(anySchema, index) {
          var type = anySchema.name;
          tmpl += '<button ng-click="addItem(schema.items.anyOf[' + index + '])">' + type + '</button>';
        });

        var link = $compile(tmpl);
        var e = link(scope);
        elem.find('.controls').append(e);
      }
    };
  });


  //
  // array item
  //
  module.directive('cmArrayItem', function($compile, builder) {
    return {
      require: '^cmArray',
      replace: true,
      scope: {
        model: '=',
        schema: '=',
        $index: '='
      },
      template: '<div><button ng-click="remove()">Remove</button></div>',

      link: function(scope, elem, attrs, array) {

        elem.find('button').on('click', function(e) {
          array.removeItem(scope.$parent.$index);
        });
        
        var tmpl = builder.build(scope.schema, scope.model, 'schema', 'model');
        var link = $compile(tmpl);
        var e = link(scope);
        elem.append(e);
      }
    };
  });


  //
  // array
  //
  module.directive('cmArray', function(builder) {
    return {
      replace: true,
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      template: '<div>{{name}}<button ng-click="addItem()">Add</button><ul><li ng-repeat="model in model"><div cm-array-item schema="schema.items" model="model"></div></li></ul></div>',

      controller: function($scope, builder) {
        $scope.addItem = function() {
          $scope.model.push(
            builder.createModel($scope.schema.items)
          );
        };

        this.removeItem = function removeItem(index) {
          $scope.model.splice(index, 1);
          $scope.$apply();
        };
      },
      
      link: function postLink(scope, elem, attrs) {
        // ngrepeat can only bind to references when it comes to form fields
        // thats why we can only work with items of type object
        if (!scope.schema.items.type === 'object' || !scope.schema.items.properties) {
          throw new Error('Array can only work with objects');
        }
      }
    };
  });

  // -- view directives --------------------------------------------------

  module.directive('cmFile', function($compile, builder) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      template: '<div><label>{{name}}<input type="file"/></label><img height="240"><button ng-click="send()">SEND</button></div>',

      controller: function($scope, $http) {
        $scope.send = function() {
          if (!$scope.file) {
            return;
          }
          console.log('SEND', $scope.file);

          var formData = new FormData();
          formData.append('hello', 'world');
          formData.append('file', $scope.file);

          var xhr = new XMLHttpRequest();

          xhr.addEventListener('progress', function() {
            console.log('progress', arguments);
          }, false);
          xhr.addEventListener('load', function() {
            console.log('load', arguments);
          }, false);
          xhr.addEventListener('error', function() {
            console.log('error', arguments);
          }, false);
          xhr.addEventListener('abort', function() {
            console.log('abort', arguments);
          }, false);

          xhr.open('POST', '/postit');
          xhr.send(formData);
        };
      },
      
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
          // var reader = new FileReader();

          scope.file = file;
          
          // reader.onload = function(e) {
          //   preview.attr('src', e.target.result);
          // };
          // reader.readAsDataURL(file);
        });
      }
    };
  });

  
  // -- model directive --------------------------------------------------

  module.directive('cmModel', function($compile, builder) {

    return {
      scope: {
        model: '=',
        schema: '='
      },

      link: function postLink(scope, elem, attrs, controller) {

        // console.log('-- link cm-model --');
        
        // rebuild whenever the model reference changes
        var currentModel;
        
        scope.$watch(function(scope) {

          // check for changes
          if (scope.model === currentModel) {
            return;
          }
          if (!scope.schema) {
            throw new Error('No Schema defined');
          }
          currentModel = scope.model;

          var tmpl = builder.build(scope.schema, scope.model, 'schema', 'model');
          var link = $compile(tmpl);
          var content = link(scope);
          elem.prepend(content);
        });
      }
    };
  });
  
})();
