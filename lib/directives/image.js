(function() {

  var module = angular.module('cores.directives');
  

  module.directive('crImage', function($compile, crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      
      replace: true,
      templateUrl: 'cr-image.html',

      link: function(scope, elem, attrs) {

        var fileId = crCommon.getFileId();
        
        var input = elem.find('input[type="file"]');
        var preview = elem.find('img');

        // preview when already saved
        scope.$watch('model.url', function(url) {
          preview.attr('src', url);
        });
        
        input.on('change', function(e) {

          var files = input[0].files;
          if (files.length === 0) {
            // no file selected
            return;
          }

          var file = files[0];

          // preview selected image
          var fr = new FileReader();
          fr.onload = function(e) {
            preview.attr('src', e.target.result);
          };
          fr.readAsDataURL(file);

          scope.model.name = file.name;
          // notify model about file
          scope.$emit('file', file, fileId);
          scope.$apply();
        });

        scope.$emit('ready');
      }
    };
  });


  module.directive('crImagePreview', function() {
    return {
      scope: {
        model: '=',
        file: '='
      },

      replace: true,
      templateUrl: 'cr-image-preview.html',

      link: function(scope, elem, attr) {
        scope.$watch('subFile', function(file) {
          if (file) {
            var fr = new FileReader();
            fr.onload = function(e) {
              elem.find('img').attr('src', e.target.result);
            };
            fr.readAsDataURL(file);
          }
        });
      }
    };
  });

})();