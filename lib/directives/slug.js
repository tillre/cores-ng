(function() {

  var module = angular.module('cores.directives');


  module.directive('crSlug', function(crCommon) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-slug.html',

      link: function(scope, elem, attrs, crCtrl) {

        if (scope.required) {
          crCtrl.addValidator('required', function(value) {
            return !!value;
          });
        }


        if (scope.schema.hasOwnProperty('maxLength')) {
          crCtrl.addValidator('maxLength', function(value) {
            return value.length <= scope.schema.maxLength;
          });
        }
        if (scope.schema.hasOwnProperty('minLength')) {
          crCtrl.addValidator('minLength', function(value) {
            return value.length >= scope.schema.minLength;
          });
        }

        scope.generate = function() {
          var sources = [];
          var val = '';

          // allow single string or array of strings for source option
          if (typeof scope.options.source === 'string') {
            sources = [scope.options.source];
          }
          else if (angular.isArray(scope.options.source)) {
            sources = scope.options.source;
          }

          angular.forEach(sources, function(src) {
            val += (val !== '' ? '-' : '') + scope.$parent.model[src];
          });
          scope.model = crCommon.slugify(val);
        };
      }
    };
  });

})();
