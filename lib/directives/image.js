(function() {

  var module = angular.module('cores.directives');


  module.directive('crImage', function($compile, crCommon, crFieldLink, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-image.html',


      link: crFieldLink({
        baseUrl: '/'

      }, function(scope, elem, attrs) {

        var validation = crValidation(scope, 'model.name');
        if (scope.options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return !!scope.model.name && scope.model.name !== '';
          }, true);
        }

        var fileId = crCommon.createFileId();

        var $input = elem.find('input[type="file"]');
        var $preview = elem.find('img');

        scope.imgSrc = '';

        // preview when already saved
        scope.$watch('model.url', function(url) {
          scope.imgSrc = url ? scope.options.baseUrl + url : '';
        });

        $input.on('change', function(e) {

          var files = $input[0].files;
          if (files.length === 0) {
            // no file selected
            return;
          }

          var file = files[0];

          // preview selected image
          var fr = new FileReader();
          fr.onload = function(e) {
            scope.imgSrc = e.target.result;
            scope.$apply();
          };
          fr.readAsDataURL(file);

          scope.model.name = file.name;

          // notify model about file
          scope.$emit('cr:file:set', fileId, file);
          scope.$apply();
        });
      })
    };
  });

})();