(function() {

  var module = angular.module('cores.directives');


  module.directive('crReadonly', function() {
    return {
      replace: true,
      templateUrl: 'cr-readonly.html'
    };
  });
})();