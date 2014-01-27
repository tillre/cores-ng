(function() {

  var module = angular.module('cores.directives');

  module.directive('crString', function($timeout) {
    return {
      require: 'crControl',
      replace: true,
      templateUrl: 'cr-string.html',

      link: function(scope, elem, attrs, crCtrl) {

        if (scope.schema.hasOwnProperty('maxLength')) {
          crCtrl.addValidator('maxLength', function(value) {
            return value.length <= scope.schema.maxLength;
          });
        }
        if (scope.schema.hasOwnProperty('minLength')) {
          crCtrl.addValidator('minLength', function(value) {
            return value.length >= scope.schema.minLength;
          });
        }
        if (scope.schema.hasOwnProperty('pattern')) {
          crCtrl.addValidator('pattern', function(value) {
            return new RegExp(scope.schema.pattern).test(value);
          });
        }
      }
    };
  });
})();