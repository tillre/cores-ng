(function() {

  var module = angular.module('cores.directives');


  module.directive('crText', function(
    crTextareaAutosize
  ) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-text.html',

      link: function(scope, elem, attrs, crCtrl) {

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

        var updateSize = crTextareaAutosize(elem.find('textarea'));

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
      }
    };
  });
})();