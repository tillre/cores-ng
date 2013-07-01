(function() {

  var module = angular.module('cores.directives');
  
  //
  // boolean
  //
  
  module.directive('crBoolean', function(crCommon) {
    return {
      scope: {
        model: '=',
        name: '@',
        path: '@'
      },
      replace: true,
      templateUrl: 'cr-boolean.html',
      controller: crCommon.StandardCtrl
    };
  });

  
  //
  // number
  //
  
  module.directive('crNumber', function(crCommon, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@',
        isInteger: '@'
      },

      replace: true,
      templateUrl: 'cr-number.html',
      controller: crCommon.StandardCtrl,

      link: function(scope, elem, attrs) {

        var validation = crValidation(scope, scope.schema);        

        if (elem.attr('isInteger') === 'true') {
          validation.addConstraint('integer', function(value) {
            return Math.floor(value) === value;
          }, true);
        }
        else {
          elem.find('input[type="number"]').attr('step', 'any');
        }
        
        validation.addConstraint('multipleOf', function(value) {
          return (value % scope.schema.multipleOf) === 0;
        });

        validation.addConstraint('minimum', function(value) {
          return value >= scope.schema.minimum;
        });

        validation.addConstraint('maximum', function(value) {
          return value <= scope.schema.maximum;
        });
      }
    };
  });

  
  //
  // string
  //
  
  module.directive('crString', function(crCommon, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },
      replace: true,
      templateUrl: 'cr-string.html',
      controller: crCommon.StandardCtrl,

      link: function(scope, elem, attrs) {

        var validation = crValidation(scope, scope.schema);

        validation.addConstraint('maxLength', function(value) {
          return value.length <= scope.schema.maxLength;
        });

        validation.addConstraint('minLength', function(value) {
          return value.length >= scope.schema.minLength;
        });

        validation.addConstraint('pattern', function(value) {
          return new RegExp(scope.schema.pattern).test(value);
        });

        validation.addConstraint('format', function(value) {
          throw new Error('not implemented');
          return false;
        });
      }
    };
  });


  //
  // enum
  //

  module.directive('crEnum', function(crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },
      replace: true,
      templateUrl: 'cr-enum.html',

      controller: crCommon.StandardCtrl
    };
  });
  
})();