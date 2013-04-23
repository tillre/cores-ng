/*global angular*/


(function() {

  // directive namespace prefix
  var NS = 'cr';

  var module = angular.module('cores.directives', ['ng', 'cores.services']);


  //
  // boolean
  //
  module.directive(NS + 'Boolean', function() {
    return {
      replace: true,
      scope: {
        model: '=',
        name: '@'
      },
      template: '<label>{{name}}<input type="checkbox" ng-model="model" name="{{name}}"/></label>'
    };
  });


  //
  // integer
  //
  module.directive(NS + 'Integer', function() {
    return {
      replace: true,
      scope: {
        model: '=',
        name: '@'
      },
      template: '<label>{{name}}<input type="number" ng-model="model" name="{{name}}"/></label>'
    };
  });


  //
  // number
  //
  module.directive(NS + 'Number', function() {
    return {
      replace: true,
      scope: {
        model: '=',
        name: '@'
      },
      template: '<label>{{name}}<input type="number" ng-model="model" name="{{name}}"/></label>'
    };
  });

  
  //
  // string
  //
  module.directive(NS + 'String', function() {
    return {
      replace: true,
      scope: {
        model: '=',
        name: '@'
      },
      template: '<label>{{name}}<input type="text" ng-model="model" name="{{name}}"/></label>'
    };
  });


  //
  // enum
  //
  module.directive(NS + 'Enum', function($compile) {
    return {
      replace: true,
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      template: '<label>{{name}}<select ng-model="model" ng-options="e for e in schema.enum" name="{{name}}"></select></label>'
    };
  });

  
  //
  // object
  //
  module.directive(NS + 'Object', function($compile, cores) {
    return {
      replace: 'true',
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      template: '<div name={{name}}></div>',

      link: function postLink(scope, elem, attrs) {
        // console.log('-- link object --', scope.schema, scope.model);

        var tmpl = '<label>{{name}}</label><ul>';
        angular.forEach(scope.schema.properties, function(subSchema, key) {

          // ignore some keys
          if (key === '_id' || key === '_rev' || key === 'type_') return;
          
          if (!scope.model.hasOwnProperty(key)) {
            scope.model[key] = cores.createModel(subSchema);
          }
          
          tmpl += cores.buildTemplate(subSchema, scope.model[key],
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
  module.directive(NS + 'AnyofItem', function($compile, cores) {
    return {
      require: '^' + NS + 'AnyofArray',
      replace: true,
      scope: {
        model: '=',
        name: '@'
      },
      template: '<div name="{{name}}"><button ng-click="remove()">Remove</button></div>',

      link: function(scope, elem, attrs, anyof) {
        // get the schema from the anyof-array
        scope.schema = anyof.getSchema(scope.model.type_);
        
        elem.find('button').on('click', function(e) {
          anyof.removeItem(scope.$parent.$index);
        });
        
        var tmpl = cores.buildTemplate(scope.schema, scope.model, 'schema', 'model');
        var link = $compile(tmpl);
        var e = link(scope);
        elem.append(e);
      }
    };
  });
  
  module.directive(NS + 'AnyofArray', function($compile, cores) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      template: '<div name={{name}}><div class="controls"/><ul><li ng-repeat="model in model"><div ' + NS + '-anyof-item model="model"></div></li></ul></div>',

      
      controller: function($scope, cores) {

        $scope.addItem = function addItem(schema) {
          if (!schema.type === 'object' || !schema.properties) {
            throw new Error('Schema must be of type object');
          }
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
          $scope.$apply();
        };
      },

      
      link: function(scope, elem, attrs) {
        
        var tmpl = '';
        angular.forEach(scope.schema.items.anyOf, function(anySchema, index) {

          if (anySchema.items.type !== 'object' && !anySchema.items.properties) {
            throw new Error('AnyOf can only work with objects');
          }
          
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
  module.directive(NS + 'ArrayItem', function($compile, cores) {
    return {
      require: '^' + NS + 'Array',
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
        
        var tmpl = cores.buildTemplate(scope.schema, scope.model, 'schema', 'model');
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
      replace: true,
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      template: '<div>{{name}}<button ng-click="addItem()">Add</button><ul><li ng-repeat="model in model"><div ' + NS + '-array-item schema="schema.items" model="model"></div></li></ul></div>',

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
        // thats why we can only work with items of type object
        if (scope.schema.items.type !== 'object' && !scope.schema.items.properties) {
          throw new Error('Array can only work with objects');
        }
      }
    };
  });

  // -- view directives --------------------------------------------------

  module.directive(NS + 'Image', function($compile, cores) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      
      replace: true,
      template: '<div><label>{{name}}<input type="file"/></label><img height="240"></div>',
      
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
      template: '<div><button ng-click="save()">SNED</button></div>',

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

            console.log('append', doc);
            console.log('append', $scope.file);
            
            var fd = new FormData();
            fd.append('type_', $scope.type);
            fd.append('doc', JSON.stringify(doc));
            fd.append('file', $scope.file);

            // if (doc._id && doc._rev) {
            //   // when updating, put the id/rev on the formdata container
            //   fd.append('_id', doc._id);
            //   fd.append('_rev', doc._rev);
            // }
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
              // $scope.model = JSON.parse(data);
            },
            function(data) {
              console.log('error', data);
            }
          );
          
        };
      },
      
      link: function(scope, elem, attrs, controller) {

        // console.log('-- link model --');
        
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

          var tmpl = cores.buildTemplate(scope.schema, scope.model, 'schema', 'model');
          var link = $compile(tmpl);
          var content = link(scope);
          elem.prepend(content);
        });
      }
    };
  });
  
})();
