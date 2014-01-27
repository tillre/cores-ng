(function() {

  var module = angular.module('cores.controllers');


  module.controller('crModelCtrl', function(
    $scope,
    $q,
    crJSONPointer,
    crResources,
    crSchema,
    crCommon
  ) {

    var STATE_EDITING = 'editing';
    var STATE_LOADING = 'loading';
    var STATE_SAVING = 'saving';
    var STATE_ERROR = 'error';

    $scope.options = $scope.options || {};

    var self = this;

    $scope.valid = true;
    $scope.state = STATE_EDITING;
    $scope.debug = false;
    $scope.files = {};
    $scope.error = null;

    // add/update/remove files from the model

    $scope.$on('cr:file:set', function(e, id, file) {
      e.stopPropagation();
      $scope.files[id] = file;
    });

    $scope.$on('cr:file:remove', function(e, id) {
      e.stopPropagation();
      delete $scope.files[id];
    });

    // button methods

    $scope.save = function() {
      $scope.$emit('cr:model:save');
      return self.save();
    };

    $scope.cancel = function() {
      $scope.$emit('cr:model:cancel');
    };

    $scope.destroy = function() {
      $scope.$emit('cr:model:destroy');
      return self.destroy();
    };

    $scope.toggleDebug = function() {
      $scope.debug = !$scope.debug;
    };

    $scope.isNew = function() {
      if (!$scope.model) return true;
      return !$scope.model._rev;
    };

    $scope.buttonClick = function(e, eventName) {
      e.stopPropagation();
      $scope.$emit(eventName, $scope.model);
    };

    //
    // methods
    //

    this.load = function(id) {
      $scope.state = STATE_LOADING;
      return this._resource.load(id).then(function(doc) {
        self.setModel(doc);
        $scope.state = STATE_EDITING;

      }, function(err) {
        $scope.state = STATE_ERROR;
        $scope.error = err;
      });
    };


    this.save = function() {
      var def = $q.defer();

      if (!$scope.valid) {
        def.reject(new Error('Model is not valid'));
        return def.promise;
      }
      $scope.state = STATE_SAVING;

      var fs = Object.keys($scope.files).map(function(k) { return $scope.files[k]; });

      this._resource.save($scope.model, fs).then(function(doc) {

        self.setModel(doc);
        $scope.modelId = doc._id;
        $scope.state = STATE_EDITING;
        $scope.$emit('cr:model:saved', $scope.model);
        def.resolve(doc);

      }, function(err) {
        if (err.errors && angular.isArray(err.errors)) {
          // validation errors
          err.errors.forEach(function(ve) {
            var event = $scope.$broadcast('cr:model:error', '/model' + ve.path, ve.code, ve.message);
            if (event.handled) {
              console.log('event handled');
            }
          });
        }
        $scope.state = STATE_ERROR;
        $scope.error = err;
        def.reject(err);
      });
      return def.promise;
    };


    this.destroy = function() {
      return this._resource.destroy($scope.model).then(
        function() {
          self.setModel();
          $scope.$emit('cr:model:destroyed');
        }
      );
    };


    this.setModel = function(model) {
      if (!model) {
        // create default model
        model = crSchema.createValue($scope.schema);
        // set custom default values
        if ($scope.defaults) {
          Object.keys($scope.defaults).forEach(function(key) {
            var value = $scope.defaults[key];
            crJSONPointer.set(model, key, value);
          });
        }
      }
      // reset files dict when model changes
      $scope.files = {};

      $scope.model = model;
    };


    //
    // init
    //
    $scope.$watch('type', function(newType) {
      if (!newType) {
        return;
      }
      $scope.type = newType;
      $scope.state = STATE_LOADING;
      self._resource = crResources.get($scope.type);

      // load schema
      self._resource.schema().then(function(schema) {

        // load or create default model
        $scope.schema = schema;
        var id = $scope.modelId;

        if (!id) {
          self.setModel();
          $scope.state = STATE_EDITING;
        }
        else {
          return self.load(id);
        }
      }).then(function() {

        // watch for modelId changes to load/clear the model
        $scope.$watch('modelId', function(newId, oldId) {

          if (newId !== oldId) {
            if (newId) {
              // load model with new id
              self.load(newId);
            }
            else if (oldId) {
              // newId was set to null, create default value
              self.setModel();
            }
          }
        });
      });
    });
  });

})();
