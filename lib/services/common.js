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

  
  module.service('crCommon', function($q) {

    return {
      getFileId: getFileId,
      getModalId: getModalId,
    };
  });

})();