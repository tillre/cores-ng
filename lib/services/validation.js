(function() {

  var module = angular.module('cores.services');

  
  module.factory('crValidation', function() {

    return function(scope, options) {

      options = angular.extend({
        path: '',
        schema: {},
        watch: 'model'
      }, options);
      
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
      };


      var setError = function(name) {
        errors[name] = true;
        scope.$emit('error:set', options.path + ':' + name);
      };

      
      var removeError = function(name) {
        if (errors.hasOwnProperty(name)) {
          delete errors[name];
          scope.$emit('error:remove', options.path + ':' + name);
        }
      };

      
      var addConstraint = function(name, condition, isCustomConstraint) {

        // only check constraints that are defined in the schema
        if (!isCustomConstraint &&
            !options.schema.hasOwnProperty(name)) return;
        
        constraints.push(function(value) {

          condition(value) ? removeError(name) : setError(name);
        });
      }

      
      scope.$watch(options.watch, function(newValue, oldValue, scope) {
        constraints.forEach(function(c) {
          c(newValue);
        });
      });


      scope.$on('error:custom', function(e, err) {
        if (err.path === options.path) {
          e.stopPropagation();
          console.log('error goes here', err.path);
          // setError('custom',)
        }
      });
      

      return {
        setError: setError,
        removeError: removeError,
        addConstraint: addConstraint
      };
    }
  });
})();