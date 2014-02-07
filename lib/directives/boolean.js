(function() {

  var module = angular.module('cores.directives');


  module.directive('crBoolean', function() {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-boolean.html'
    };
  });
})();