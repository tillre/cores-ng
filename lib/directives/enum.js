(function() {

  var module = angular.module('cores.directives');


  module.directive('crEnum', function(crFieldLink) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-enum.html'
    };
  });

})();