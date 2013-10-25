(function() {

  var module = angular.module('cores.directives');


  module.directive('crText', function(
    crCommon,
    crFieldLink,
    crValidation,
    crTextareaAutosize
  ) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-text.html',

      link: crFieldLink(function(scope, elem, attrs) {

        var validation = crValidation(scope);

        validation.addConstraint(
          'maxLength',
          'Text is longer than ' + scope.schema.maxLength,
          function(value) {
            return value.length <= scope.schema.maxLength;
          });

        validation.addConstraint(
          'minLength',
          'Text is shorter than ' + scope.schema.minLength,
          function(value) {
            return value.length >= scope.schema.minLength;
          });

        validation.addConstraint(
          'pattern',
          'Text does not match the pattern',
          function(value) {
            return new RegExp(scope.schema.pattern).test(value);
          });

        if (scope.options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return !!value && value !== '';
          }, true);
        }

        var updateSize = crTextareaAutosize(elem.find('textarea'));

        // manually trigger autosize on first model change
        var unwatch = scope.$watch('model', function(newValue, oldValue) {
          if (newValue) {
            unwatch();
            updateSize();
          }
        });
        // update size when tab changes
        scope.$on('cr:tab:shown', function(e) {
          updateSize();
        });
      })
    };
  });
})();