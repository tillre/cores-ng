(function() {

  var module = angular.module('cores.directives');


  module.directive('crSlug', function(crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@',
        source: '@'
      },

      replace: true,
      templateUrl: 'cr-slug.html',

      link: function(scope, elem, attrs) {

        scope.generate = function() {
          
          var sources = scope.source ? scope.source.split(',') : "";
          var val = '';
          
          angular.forEach(sources, function(src) {
            val += (val !== '' ? '-' : '') + scope.$parent.model[src];
          });
          scope.model = crCommon.createSlug(val);
        }
      }
    };
  });

})();
