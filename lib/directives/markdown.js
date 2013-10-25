(function() {

  var module = angular.module('cores.directives');


  module.directive('crMarkdown', function(
    crCommon,
    crFieldLink,
    crValidation,
    crTextareaAutosize
  ) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-markdown.html',

      link: crFieldLink({
        showLabel: true,
        showBorder: true
      }, function(scope, elem, attrs) {

        var validation = crValidation(scope);
        validation.addConstraint(
          'maxLength',
          'Text is longer than ' + scope.schema.maxLength,
          function(value) {
            return value.length <= scope.schema.maxLength;
          });

        validation.addConstraint(
          'minLength',
          'Text is shorter than ' + scope.schema.minLength,
          function(value) {
            return value.length >= scope.schema.minLength;
          });

        if (scope.options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return !!value && value !== '';
          }, true);
        }

        var $area = elem.find('.cr-editor-area');
        var $preview = elem.find('.cr-editor-preview');

        var updateSize = crTextareaAutosize($area);

        scope.isPreview = false;
        scope.togglePreview = function() {
          scope.isPreview = !scope.isPreview;
          if (scope.isPreview) {
            $preview.html(markdown.toHTML($area.val()));
          }
          else {
            updateSize();
          }
          $area.toggle();
          $preview.toggle();
        };

        // manually trigger autosize on first model change
        var unwatch = scope.$watch('model', function(newValue, oldValue) {
          if (newValue) {
            unwatch();
            updateSize();
          }
        });
        // update size when tab changes
        scope.$on('cr:tab:shown', function(e) {
          updateSize();
        });
      })
    };
  });

})();