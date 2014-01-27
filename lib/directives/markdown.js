(function() {

  var module = angular.module('cores.directives');


  module.directive('crMarkdown', function(
    crCommon,
    crFieldLink,
    crValidation,
    crTextareaAutosize
  ) {
    return {
      require: 'crControl',
      replace: true,
      templateUrl: 'cr-markdown.html',

      link: function(scope, elem, attrs, crCtrl) {

        scope.options = angular.extend({
          showBorder: true
        }, scope.options);

        if (scope.schema.hasOwnProperty('maxLength')) {
          crCtrl.addValidator('maxLength', function(value) {
            return value.length <= scope.schema.maxLength;
          });
        }
        if (scope.schema.hasOwnProperty('minLength')) {
          crCtrl.addValidator('minLength', function(value) {
            return value.length >= scope.schema.minLength;
          });
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
        var unwatch = scope.$watch('localModel', function(newValue, oldValue) {
          if (newValue) {
            unwatch();
            updateSize();
          }
        });
        // update size when tab changes
        scope.$on('cr:tab:shown', function(e) {
          updateSize();
        });
      }
    };
  });

})();