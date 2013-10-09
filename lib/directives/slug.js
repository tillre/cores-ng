(function() {

  var module = angular.module('cores.directives');


  module.directive('crSlug', function(crCommon, crOptions, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-slug.html',

      link: function(scope, elem, attrs) {

        var options = crOptions.parse(attrs.options);
        var validation = crValidation(scope);

        validation.addConstraint(
          'maxLength',
          'Slug is longer than ' + scope.schema.maxLength,
          function(value) {
            return value.length <= scope.schema.maxLength;
          });

        validation.addConstraint(
          'minLength',
          'Slug is shorter than ' + scope.schema.minLength,
          function(value) {
            return value.length >= scope.schema.minLength;
          });

        validation.addConstraint(
          'pattern',
          'Slug does not match the pattern',
          function(value) {
            return new RegExp(scope.schema.pattern).test(value);
          });

        if (options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return !!value && value !== '';
          }, true);
        }


        scope.generate = function() {

          var sources = [];
          var val = '';

          // allow single string or array of strings for source option
          if (typeof options.source === 'string') {
            sources = [options.source];
          }
          else if (angular.isArray(options.source)) {
            sources = options.source;
          }

          angular.forEach(sources, function(src) {
            val += (val !== '' ? '-' : '') + scope.$parent.model[src];
          });
          scope.model = crCommon.createSlug(val);
        };
      }
    };
  });

})();
