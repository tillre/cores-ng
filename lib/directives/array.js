(function() {

  var module = angular.module('cores.directives');


  module.directive('crArrayControls', function() {
    return {
      replace: true,
      templateUrl: 'cr-array-controls.html',

      scope: {
        index: '&',
        schemas: '='
      },

      link: function(scope, elem, attrs) {

        var names = Object.keys(scope.schemas);
        scope.numSchemas = names.length;

        if (scope.numSchemas === 1) {
          scope.addItem = function() {
            scope.$emit('cr:array:addItem', scope.index(), scope.schemas[names[0]]);
          };
        }
        else {
          scope.addItem = function(schema) {
            scope.$emit('cr:array:addItem', scope.index(), schema);
          };
        }
      }
    };
  });


  module.directive('crArray', function(crSchema) {
    return {
      replace: true,
      templateUrl: 'cr-array.html',

      link: function(scope, elem, attrs, crCtrl) {

        if (scope.required) {
          crCtrl.addValidator('required', function(value) {
            return !!value && value.length > 0;
          });
        }

        scope.schemas = {};
        scope.showSchemaName = false;

        if (scope.schema.items.hasOwnProperty('anyOf')) {
          // anyof array
          scope.schema.items.anyOf.forEach(function(s) {
            if (!s.name) throw new Error('AnyOf schema has to have a name ' + JSON.stringify(s));
            scope.schemas[s.name] = s;
          });
          scope.showSchemaName = true;
        }
        else if (scope.schema.items) {
          // standard array
          scope.schemas.item = scope.schema.items;
        }

        // hide label and dont indent items
        angular.forEach(scope.schemas, function(s) {
          s.view = s.view || {};
          if (!s.view.hasOwnProperty('showLabel')) {
            s.view.showLabel = false;
          }
          if (!s.view.hasOwnProperty('indent')) {
            s.view.indent = false;
          }
        });


        scope.moveUp = function(index) {
          if (index === 0) return;
          scope.model.splice(index - 1, 0, scope.model.splice(index, 1)[0]);
          scope.$emit('cr:model:change', scope.path);
        };

        scope.moveDown = function(index) {
          if (index >= scope.model.length) return;
          scope.model.splice(index + 1, 0, scope.model.splice(index, 1)[0]);
          scope.$emit('cr:model:change', scope.path);
        };

        scope.remove = function(index) {
          scope.model.splice(index, 1);
          scope.$emit('cr:model:change', scope.path);
        };

        scope.$on('cr:array:addItem', function(e, index, schema) {
          e.stopPropagation();

          var obj = crSchema.createValue(schema, schema.name);
          if (index >= scope.model.length) {
            scope.model.push(obj);
          }
          else {
            scope.model.splice(index, 0, obj);
          }
          scope.$emit('cr:model:change', scope.path);
        });

        scope.getSchema = function(type) {
          type = type || 'item';
          var schema = scope.schemas[type];

          // ngrepeat can only bind to references when it comes to form fields
          // thats why we can only work with items of type object not primitives
          if (!crSchema.isObjectSchema(schema) && !crSchema.isRefSchema(schema)) {
            throw new Error('Array items schema is not of type object: ' + JSON.stringify(schema));
          }
          return schema;
        };

      }
    };
  });
})();