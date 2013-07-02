(function() {

  var module = angular.module('cores.directives');

  
  module.directive('crText', function(crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@',
        isRequired: '@'
      },
      
      replace: true,
      templateUrl: 'cr-text.html',

      link: function(scope) {
        scope.$emit('ready');
      }
    };
  });
  
})();