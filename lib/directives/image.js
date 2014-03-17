(function() {

  var module = angular.module('cores.directives');


  module.directive('crImage', function(crCommon) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-image.html',

      link: function(scope, elem, attrs, crCtrl) {

        var fileId = crCommon.createFileId();

        // validation
        if (scope.required) {
          crCtrl.addValidator('required', function(value) {
            return value && value.name;
          });
        }

        scope.imgSrc = '';

        // preview when already saved
        scope.$watch('model.url', function(value) {
          scope.imgSrc = value
            ? (scope.options.baseUrl || '') + value
            : '';
        });


        elem.find('input[type="file"]').on('change', function(e) {
          if (this.files.length === 0) {
            // no file selected
            return;
          }

          var file = this.files[0];

          // preview selected image
          var reader = new FileReader();
          reader.onload = function(e) {
            scope.imgSrc = e.target.result;
            scope.$apply();
          };
          reader.readAsDataURL(file);

          scope.model.name = file.name;

          // notify model about file
          scope.$emit('cr:file:set', fileId, file);
          scope.$digest();
          crCtrl.validate();
        });
      }
    };
  });


  //
  // preview
  //

  module.directive('crImagePreview', function(crResources) {
    return {
      scope: {
        model: '=',
        schema: '=',
        options: '='
      },

      replace: true,
      templateUrl: 'cr-image-preview.html',

      link: function(scope, elem, attr) {
        scope.baseUrl = '';

        // try to get the baseUrl from the referenced schemas file property's view object
        crResources.get(scope.schema.$ref).schema().then(function(imageSchema) {
          scope.baseUrl = imageSchema.properties.file.view.baseUrl || '';
        });
      }
    };
  });

})();