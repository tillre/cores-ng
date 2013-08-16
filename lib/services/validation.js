(function() {

  var module = angular.module('cores.services');


  module.factory('crValidation', function() {

    return function(scope, options) {

      // TODO: path in arrays will change with the index!

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
        scope.$emit('set:error', options.path + ':' + name);
      };


      var removeError = function(name) {
        if (errors.hasOwnProperty(name)) {
          delete errors[name];
          scope.$emit('remove:error', options.path + ':' + name);
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


      scope.$on('set:customError', function(e, path, code, message) {
        console.log('check path', path, options.path);
        if (path === options.path) {
          e.stopPropagation();
          console.log('yoiioiooooooapsodipaosid');
          setError(code);
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