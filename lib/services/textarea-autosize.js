(function() {

  var module = angular.module('cores.services');


  module.factory('crTextareaAutosize', function() {

    return function($textarea) {
      var update = function() {
        var body = $('body')[0];
        var top = body.scrollTop;
        var p = 0;
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
          // add padding to height in firefox
          p += parseInt($textarea.css('padding-top'), 10);
          p += parseInt($textarea.css('padding-bottom'), 10);
        }
        $textarea.css('height', 'auto');
        $textarea.css('height', $textarea[0].scrollHeight + p);
        if (top !== body.scrollTop) {
          body.scrollTop = top;
        }
      };
      $textarea.on('keyup', update);
      $textarea.on('input', update);
      $(window).on('resize', update);
      return update;
    };
  });
})();