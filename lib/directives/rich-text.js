(function() {

  var module = angular.module('cores.directives');


  module.directive('crRichText', function(crCommon, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-rich-text.html',

      link: function(scope, elem, attrs) {

        var validation = crValidation(scope);

        validation.addConstraint('maxLength', function(value) {
          return value.length <= scope.schema.maxLength;
        });

        validation.addConstraint('minLength', function(value) {
          return value.length >= scope.schema.minLength;
        });

        if (attrs.isRequired === 'true') {
          validation.addConstraint('required', function(value) {
            return !!value && value !== '';
          }, true);
        }

        var $area = elem.find('.cr-editor-area');
        var $preview = elem.find('.cr-editor-preview');
        $area.autosize();

        scope.isPreview = false;
        scope.togglePreview = function() {
          scope.isPreview = !scope.isPreview;
          if (scope.isPreview) {
            $preview.html(markdown.toHTML($area.val()));
          }
          $area.toggle();
          $preview.toggle();
        };

        // manually trigger autosize on first model change
        var unwatch = scope.$watch('model', function(newValue, oldValue) {
          if (newValue) {
            unwatch();
            $area.trigger('autosize.resize');
          }
        });

        scope.$emit('ready');
      }
    };
  });

})();