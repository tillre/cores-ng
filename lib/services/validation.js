(function() {

  var module = angular.module('cores.services');

  
  module.factory('crValidation', function() {

    return function(scope, path, schema) {

      path = path || '';
      schema = schema || {};
      
      var errors = {};
      var constraints = [];

      
      scope.hasErrors = function() {
        return Object.keys(errors).length > 0;
      };

      
      scope.hasError = function(name) {
        return !!errors[name];
      };

      
      scope.getFirstError = function() {
        for (var x in errors) {
          if (errors[x]) return x;
        }
        return '';
      };


      var setError = function(name) {
        errors[name] = true;
        scope.$emit('error:set', path + ':' + name);
      };

      
      var removeError = function(name) {
        if (errors.hasOwnProperty(name)) {
          delete errors[name];
          scope.$emit('error:remove', path + ':' + name);
        }
      };

      
      var addConstraint = function(name, condition, isCustomConstraint) {

        // only check constraints that are defined in the schema
        if (!isCustomConstraint &&
            !schema.hasOwnProperty(name)) return;
        
        constraints.push(function(value) {

          condition(value) ? removeError(name) : setError(name);
        });
      }

      
      scope.$watch('model', function(newValue, oldValue, scope) {
        constraints.forEach(function(c) {
          c(newValue);
        });
      });


      return {
        setError: setError,
        removeError: removeError,
        addConstraint: addConstraint
      };
    }
  });
})();