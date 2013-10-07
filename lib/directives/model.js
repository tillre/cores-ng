(function() {

  var module = angular.module('cores.directives');


  module.directive('crModel', function() {
    return {
      scope: {
        type: '@',
        path: '@',
        modelId: '=',
        options: '=?'
      },

      replace: true,
      templateUrl: 'cr-model.html',

      controller: 'crModelCtrl',

      link: function(scope, elem, attrs) {
        if (attrs.options && typeof attrs.options === 'string') {
          scope.options = JSON.parse(attrs.options);
        }
        else {
          scope.options = {};
        }
      }
    };
  });
})();