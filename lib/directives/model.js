(function() {

  var module = angular.module('cores.directives');


  module.directive('crModel', function() {
    return {
      scope: {
        type: '@',
        path: '@',
        modelId: '=',
        defaults: '=?',
        options: '=?'
      },

      replace: true,
      templateUrl: 'cr-model.html',

      controller: 'crModelCtrl'
    };
  });
})();
