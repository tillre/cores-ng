(function() {

  var module = angular.module('cores.controllers');


  module.controller('crModelCtrl', function($scope, $q, crResources, crSchema, crCommon) {

    var STATE_EDITING = 'editing';
    var STATE_LOADING = 'loading';
    var STATE_SAVING = 'saving';

    var self = this;
    var files = {};

    var data = $scope.data = {
      valid: true,
      state: STATE_EDITING
    };

    // add/update/remove files from the model

    $scope.$on('file:set', function(e, id, file) {
      e.stopPropagation();
      files[id] = file;
    });

    $scope.$on('file:remove', function(e, id) {
      e.stopPropagation();
      delete files[id];
    });

    // button methods

    $scope.save = function() {
      $scope.$emit('model:save');
      return self.save();
    };

    $scope.cancel = function() {
      $scope.$emit('model:cancel');
    };

    $scope.destroy = function() {
      $scope.$emit('model:destroy');
      return self.destroy();
    };

    $scope.isNew = function() {
      if (!$scope.model) return true;
      return !$scope.model._rev;
    };

    //
    // methods
    //

    this.load = function(id) {

      data.state = STATE_LOADING;
      return this._resource.load(id).then(function(doc) {
        $scope.model = doc;
        data.state = STATE_EDITING;
      });
    };


    this.save = function() {

      var def = $q.defer();

      if (!$scope.data.valid) {
        def.reject(new Error('Model is not valid'));
        return def.promise;
      }
      data.state = STATE_SAVING;

      var fs = Object.keys(files).map(function(k) { return files[k]; });

      this._resource.save($scope.model, fs).then(function(doc) {

        $scope.model = doc;
        $scope.modelId = doc._id;
        data.state = STATE_EDITING;
        $scope.$emit('model:saved', $scope.model);
        def.resolve(doc);

      }, function(err) {

        if (err.message === 'Validation failed') {
          console.log('err', err.errors);

          data.state = STATE_EDITING;

          err.errors.forEach(function(v) {
            console.log('broadcast', v);
            $scope.$broadcast('set:customError', v.path, v.code, v.message);
          });
        }
        def.reject(err);
      });

      return def.promise;
    };


    this.destroy = function() {

      return this._resource.destroy($scope.model).then(
        function() {
          $scope.model = crSchema.createValue($scope.schema);
          $scope.$emit('model:destroyed');
        }
      );
    };


    //
    // init
    //

    data.state = STATE_LOADING;
    self._resource = crResources.get($scope.type);

    // load schema
    self._resource.schema().then(function(schema) {

      // load or create default model
      $scope.schema = schema;
      var id = $scope.modelId;

      if (!id) {
        $scope.model = crSchema.createValue(schema);
        data.state = STATE_EDITING;
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
            $scope.model = crSchema.createValue($scope.schema);
          }
        }
      });

      $scope.$emit('model:ready');
    });
  });

})();