(function() {

  var module = angular.module('cores.services');


  module.factory('crTextareaAutosize', function() {

    return function($textarea) {
      var update = function() {
        $textarea.css('height', 'auto');
        $textarea.css('height', $textarea[0].scrollHeight);
      };
      $textarea.on('keyup', update);
      $textarea.on('input', update);
      $(window).on('resize', update);
      return update;
    };
  });
})();