(function() {

  var module = angular.module('cores.directives');


  module.directive('crReadonly', function(crFieldLink) {
    return {
      replace: true,
      templateUrl: 'cr-readonly.html'
    };
  });
})();