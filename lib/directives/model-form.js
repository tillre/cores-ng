(function() {

  var module = angular.module('cores.directives');


  module.directive('crModelForm', function(crBuild, crSchema) {
    return {
      scope: {
        schema: '=',
        model: '=?',
        valid: '=?',
        debug: '=?'
      },

      replace: true,
      templateUrl: 'cr-model-form.html',

      link: function(scope, elem, attrs) {

        var childScope;

        function build() {
          // cleanup dom and scope
          if (childScope) {
            elem.find('form').empty();
            childScope.$destroy();
          }
          childScope = scope.$new();
          var control = crBuild.buildControl(childScope);
          elem.find('form').html(control);
        }


        scope.$watch('schema', function(newValue, oldValue) {
          if (!newValue) {
            return;
          }
          if (!crSchema.isObjectSchema(newValue)) {
            throw new Error('Top level schema has to be an object ' + JSON.stringify(newValue));
          }
          scope.schema.view = angular.extend({
            indent: false,
            showLabel: false
          }, scope.schema.view);

          if (!scope.model) {
            // create default model
            scope.model = crSchema.createValue(newValue);
            build();
          }
        });


        scope.$watch('model', function(newValue) {
          if (!scope.schema) {
            return;
          }
          if (!newValue) {
            scope.model = crSchema.createValue(scope.schema);
          }
          build();
        });


        scope.errors = {};
        scope.valid = true;

        scope.$on('cr:model:setValidity', function(e, code, valid) {
          e.stopPropagation();
          scope.errors[code] = !valid;
          scope.valid = true;
          angular.forEach(scope.errors, function(error, key) {
            if (error) {
              scope.valid = false;
            }
          });
        });
      }
    };
  });
})();