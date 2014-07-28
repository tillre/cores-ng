(function() {

  var module = angular.module('cores.directives');


  module.directive('crInteger', function() {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-number.html',

      link: function(scope, elem, attrs, crCtrl) {

        if (scope.required) {
          crCtrl.addValidator('required', function(value) {
            return !!value;
          });
        }
        if (scope.schema.hasOwnProperty('multipleOf')) {
          crCtrl.addValidator('multipleOf', function(value) {
            return (value % scope.schema.multipleOf) === 0;
          });
        }
        if (scope.schema.hasOwnProperty('maximum')) {
          crCtrl.addValidator('maximum', function(value) {
            return value <= scope.schema.maximum;
          });
        }
        if (scope.schema.hasOwnProperty('minimum')) {
          crCtrl.addValidator('minimum', function(value) {
            return value >= scope.schema.minimum;
          });
        }
        if (scope.options.isInteger) {
          crCtrl.addValidator('integer', function(value) {
            return Math.floor(value) === value;
          });
        }
      }
    };
  });
})();