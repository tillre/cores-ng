(function() {


  function manageConstraints(scope, ctrl, schema) {
    
    var constraints = [];

    var setError = function(error) {
      ctrl.$setValidity(scope.path + ':' + error, true);
    };

    var clearError = function(error) {
      ctrl.$setValidity(scope.path + ':' + error, false);
    };
    
    scope.hasErrors = function() {
      return Object.keys(ctrl.$error).some(function(key) {
        return ctrl.$error[key];
      });
    };

    scope.hasError = function(name) {
      return ctrl.$error[scope.path + ':' + name];
    };

    scope.getOneError = function() {
      // get first truthy error
      for (var x in ctrl.$error) {
        if (ctrl.$error[x]) return x.split(':')[1];
      }
      return '';
    };
    
    var addConstraint = function(name, condition, noSchemaConstraint) {
      if (!noSchemaConstraint &&
          !schema.hasOwnProperty(name)) return;
      
      constraints.push(function(value) {
        if (!condition(value)) {
          clearError(name);
        }
        else {
          setError(name);
        }
      });
    };

    
    scope.$watch('model', function(newValue, oldValue, scope) {

      constraints.forEach(function(c) {
        c(newValue);
      });
    });

    return addConstraint;
  }
  

  
  var module = angular.module('cores.directives');
  
  //
  // boolean
  //
  
  module.directive('crBoolean', function(crCommon) {
    return {
      require: 'ngModel',
      scope: {
        model: '=ngModel',
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
  
  module.directive('crNumber', function(crCommon) {
    return {
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        schema: '=',
        name: '@',
        path: '@',
        isInteger: '@'
      },

      replace: true,
      templateUrl: 'cr-number.html',
      controller: crCommon.StandardCtrl,

      link: function(scope, elem, attrs, ctrl) {

        var addConstraint = manageConstraints(scope, ctrl, scope.schema);        

        if (elem.attr('isInteger') === 'true') {
          addConstraint('integer', function(value) {
            return Math.floor(value) === value;
          }, true);
        }
        else {
          elem.find('input[type="number"]').attr('step', 'any');
        }
        
        addConstraint('multipleOf', function(value) {
          return (value % scope.schema.multipleOf) === 0;
        });

        addConstraint('minimum', function(value) {
          return value >= scope.schema.minimum;
        });

        addConstraint('maximum', function(value) {
          return value <= scope.schema.maximum;
        });
      }
    };
  });

  
  //
  // string
  //
  
  module.directive('crString', function(crCommon) {
    return {
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        schema: '=',
        name: '@',
        path: '@'
      },
      replace: true,
      templateUrl: 'cr-string.html',
      controller: crCommon.StandardCtrl,

      link: function(scope, elem, attrs, ctrl) {

        var addConstraint = manageConstraints(scope, ctrl, scope.schema);

        addConstraint('maxLength', function(value) {
          return value.length <= scope.schema.maxLength;
        });

        addConstraint('minLength', function(value) {
          return value.length >= scope.schema.minLength;
        });

        addConstraint('pattern', function(value) {
          return new RegExp(scope.schema.pattern).test(value);
        });

        addConstraint('format', function(value) {
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
      require: 'ngModel',
      scope: {
        model: '=ngModel',
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