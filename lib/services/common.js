(function() {

  var module = angular.module('cores.services');

  // Get a new file id

  var getFileId = (function(id) {
    return function() { return 'file' + ++id; };
  })(0);


  // Get a new modal id

  var getModalId = (function(id) {
    return function() { return 'modal-' + ++id; };
  })(0);


  function StandardCtrl($scope) {
    var unwatch = $scope.$watch('model', function stdWatch() {
      unwatch();
      $scope.$emit('ready');
    });
  }

  
  module.service('crCommon', function($q) {

    function watchUntil(scope, condition) {
      var def = $q.defer();
      var off = scope.$watch(function(scope) {
        if (condition(scope)) {
          off();
          def.resolve(scope);
        }
      });
      return def.promise;
    }

    return {
      getFileId: getFileId,
      getModalId: getModalId,

      watch: watchUntil,
      
      StandardCtrl: StandardCtrl
    };
  });

})();