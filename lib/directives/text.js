(function() {

  var module = angular.module('cores.directives');

  
  module.directive('crText', function(crCommon) {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-text.html',
      controller: crCommon.StandardCtrl
    };
  });
  
})();