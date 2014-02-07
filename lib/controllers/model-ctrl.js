(function() {

  var module = angular.module('cores.controllers');


  module.controller('crModelCtrl', function(
    $scope,
    $q,
    crJSONPointer,
    crResources,
    crSchema
  ) {

    this.STATE_EDITING = 'editing';
    this.STATE_LOADING = 'loading';
    this.STATE_SAVING = 'saving';
    this.STATE_ERROR = 'error';

    $scope.options = $scope.options || {};

    var self = this;
    var files = {};

    $scope.valid = true;
    $scope.state = self.STATE_EDITING;
    $scope.debug = false;
    $scope.error = null;

    scope.$on('cr:file:set', function(e, id, file) {
      e.stopPropagation();
      self.addFile(id, file);
    });

    scope.$on('cr:file:remove', function(e, id) {
      e.stopPropagation();
      self.removeFile(id);
    });


    //
    // api
    //

    this.addFile = function(id, f) {
      files[id] = f;
    };

    this.removeFile = function(id) {
      delete files[id];
    };

    this.setState = function(state) {
      $scope.state = state;
    };

    this.setResource = function(r) {
      self._resource = r;
    };

    this.load = function(id) {
      self.setState(self.STATE_LOADING);
      return this._resource.load(id).then(function(doc) {
        self.setModel(doc);
        self.setState(self.STATE_EDITING);

      }, function(err) {
        self.setState(self.STATE_ERROR);
        $scope.error = err;
      });
    };


    this.save = function() {
      $scope.$emit('cr:model:save');
      var def = $q.defer();

      if (!$scope.valid) {
        def.reject(new Error('Model is not valid'));
        return def.promise;
      }
      self.setState(self.STATE_SAVING);

      var fs = Object.keys(files).map(function(k) { return files[k]; });

      this._resource.save($scope.model, fs).then(function(doc) {

        self.setModel(doc);
        $scope.modelId = doc._id;
        self.setState(self.STATE_EDITING);
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
        self.setState(self.STATE_ERROR);
        $scope.error = err;
        def.reject(err);
      });
      return def.promise;
    };


    this.cancel = function() {
      $scope.$emit('cr:model:cancel');
    };


    this.destroy = function() {
      $scope.$emit('cr:model:destroy');

      return this._resource.destroy($scope.model).then(
        function() {
          self.setModel();
          $scope.$emit('cr:model:destroyed');
        }
      );
    };



})();
