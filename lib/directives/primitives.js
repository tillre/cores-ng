(function() {

  var module = angular.module('cores.directives');

  //
  // boolean
  //
  
  module.directive('crBoolean', function() {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@',
        isRequired: '@'
      },

      replace: true,
      templateUrl: 'cr-boolean.html',

      link: function(scope) {
        scope.$emit('ready');
      }
    };
  });

  
  //
  // number
  //
  
  module.directive('crNumber', function(crValidation) {
    return {
      
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@',
        isRequired: '@',
        isInteger: '@'
      },

      replace: true,
      templateUrl: 'cr-number.html',

      link: function(scope, elem, attrs) {

        var validation = crValidation(scope, scope.path, scope.schema);        

        if (scope.isInteger) {
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

        scope.$emit('ready');
      }
    };
  });

  
  //
  // string
  //
  
  module.directive('crString', function(crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@',
        isRequired: '@'
      },
      replace: true,
      templateUrl: 'cr-string.html',
      
      link: function(scope, elem, attrs) {

        var validation = crValidation(scope, scope.path, scope.schema);

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

        scope.$emit('ready');
      }
    };
  });


  //
  // enum
  //

  module.directive('crEnum', function() {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-enum.html',

      link: function(scope) {
        scope.$emit('ready');
      }
    };
  });
  
})();