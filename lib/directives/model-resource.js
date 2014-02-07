(function() {

  var module = angular.module('cores.directives');


  module.directive('crModelResource', function(
    $q, crSchema, crResources, crJSONPointer
  ) {
    return {
      scope: {
        type: '@',
        path: '@',
        modelId: '=',
        defaults: '=?',
        options: '=?'
      },

      replace: true,
      templateUrl: 'cr-model.html',


      link: function(scope, elem, attrs) {

        var STATE_EDITING = 'editing';
        var STATE_LOADING = 'loading';
        var STATE_SAVING = 'saving';
        var STATE_ERROR = 'error';

        scope.options = scope.options || {};
        scope.valid = true;
        scope.state = STATE_EDITING;
        scope.debug = false;
        scope.error = null;

        var resource;
        var files = {};

        scope.$on('cr:file:set', function(e, id, file) {
          e.stopPropagation();
          files[id] = file;
        });

        scope.$on('cr:file:remove', function(e, id) {
          e.stopPropagation();
          delete files[id];
        });


        function setModel(model) {
          if (!model) {
            // create default model
            model = crSchema.createValue(scope.schema);
            // set custom default values
            if (scope.defaults) {
              angular.forEach(scope.defaults, function(value, key) {
                crJSONPointer.set(model, key, value);
              });
            }
          }
          // reset files dict when model changes
          files = {};
          scope.model = model;
        };


        function load(id) {
          scope.state = STATE_LOADING;
          return resource.load(id).then(function(doc) {
            setModel(doc);
            scope.state = STATE_EDITING;

          }, function(err) {
            scope.state = STATE_ERROR;
            scope.error = err;
          });
        };


        scope.save = function() {
          scope.$emit('cr:model:save');
          var def = $q.defer();

          if (!scope.valid) {
            def.reject(new Error('Model is not valid'));
            return def.promise;
          }
          scope.state = STATE_SAVING;

          var fs = Object.keys(files).map(function(k) { return files[k]; });

          resource.save(scope.model, fs).then(function(doc) {

            setModel(doc);
            scope.modelId = doc._id;
            scope.state = STATE_EDITING;
            scope.$emit('cr:model:saved', scope.model);
            def.resolve(doc);

          }, function(err) {
            if (err.errors && angular.isArray(err.errors)) {
              // validation errors
              err.errors.forEach(function(ve) {
                var event = scope.$broadcast('cr:model:error', '/model' + ve.path, ve.code, ve.message);
                if (event.handled) {
                  console.log('event handled');
                }
              });
            }
            scope.state = STATE_ERROR;
            scope.error = err;
            def.reject(err);
          });
          return def.promise;
        };


        scope.destroy = function() {
          scope.$emit('cr:model:destroy');

          return resource.destroy(scope.model).then(
            function() {
              setModel();
              scope.$emit('cr:model:destroyed');
            }
          );
        };


        scope.toggleDebug = function() {
          scope.debug = !scope.debug;
        };


        scope.isNew = function() {
          if (!scope.model) return true;
          return !scope.model._rev;
        };


        scope.buttonClick = function(e, eventName) {
          e.stopPropagation();
          scope.$emit(eventName, scope.model);
        };


        //
        // update when type is set
        //
        scope.$watch('type', function(newType) {
          if (!newType) {
            return;
          }
          scope.type = newType;
          scope.state = STATE_LOADING;

          resource = crResources.get(scope.type);

          // load schema
          resource.schema().then(function(schema) {

            // load or create default model
            scope.schema = schema;
            var id = scope.modelId;

            if (!id) {
              setModel();
              scope.state = STATE_EDITING;
            }
            else {
              return load(id);
            }
          }).then(function() {

            // watch for modelId changes to load/clear the model
            scope.$watch('modelId', function(value) {
              if (value) {
                load(value);
              }
              else {
                setModel();
              }
            });
          });
        });

      }
    };
  });
})();
