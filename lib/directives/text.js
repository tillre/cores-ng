(function() {

  var module = angular.module('cores.directives');


  module.directive('crText', function(crCommon, crOptions, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-text.html',

      link: function(scope, elem, attrs) {

        var options = crOptions.parse(attrs.options);
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

        if (options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return !!value && value !== '';
          }, true);
        }
      }
    };
  });

})();