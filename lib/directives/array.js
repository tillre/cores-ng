(function() {

  var module = angular.module('cores.directives');


  module.directive('crArray', function(crSchema) {
    return {
      replace: true,
      templateUrl: 'cr-array.html',

      link: function(scope, elem, attrs) {

        scope.schemas = {};

        if (scope.schema.items.hasOwnProperty('anyOf')) {
          // anyof array
          scope.schema.items.anyOf.forEach(function(s) {
            if (!s.name) throw new Error('AnyOf schema has to have a name ' + JSON.stringify(s));
            scope.schemas[s.name] = s;
          });
        }
        else if (scope.schema.items) {
          // standard array
          scope.schemas.item = scope.schema.items;
        }


        // hide label and dont indent items
        angular.forEach(scope.schemas, function(s) {
          s.view = s.view || {};
          s.view.showLabel = false;
          s.view.indent = false;
        });


        scope.moveUp = function(index) {
          if (index === 0) return;
          scope.model.splice(index - 1, 0, scope.model.splice(index, 1)[0]);
        };

        scope.moveDown = function(index) {
          if (index >= scope.model.length) return;
          scope.model.splice(index + 1, 0, scope.model.splice(index, 1)[0]);
        };

        scope.remove = function(index) {
          scope.model.splice(index, 1);
        };

        scope.addItem = function(index, schema) {
          var obj = crSchema.createValue(schema, schema.name);
          if (index >= scope.model.length) {
            scope.model.push(obj);
          }
          else {
            scope.model.splice(index, 0, obj);
          }
        };

        scope.getSchema = function(type) {
          type = type || 'item';
          var schema = scope.schemas[type];

          // ngrepeat can only bind to references when it comes to form fields
          // thats why we can only work with items of type object not primitives
          // this may change in a feature release
          if (!crSchema.isObjectSchema(schema) && !crSchema.isRefSchema(schema)) {
            throw new Error('Array items schema is not of type object: ' + JSON.stringify(schema));
          }
          return schema;
        };

      }
    };
  });
})();