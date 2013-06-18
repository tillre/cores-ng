(function() {

  var module = angular.module('cores.directives');

  
  module.directive('crText', function(crCommon) {
    return {
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-text.html',
      controller: crCommon.StandardCtrl
    };
  });
  
})();