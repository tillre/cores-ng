(function() {

  var module = angular.module('cores.directives');


  module.directive('crAnyOf', function(crBuild) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-any-of.html',

      link: function(scope, elem, attrs, crCtrl) {

        scope.schemas = scope.schema.anyOf;
        // default showLabel option to false on all possible schemas
        scope.schemas.forEach(function(s) {
          s.view = s.view || {};
          s.view.showLabel = s.view.hasOwnProperty('showLabel') ? s.view.showLabel : false;
        });


        function createItem(index, resetModel) {
          // create ui and maybe reset model
          var schema = scope.schemas[index];
          if (resetModel) {
            scope.model = { type_: schema.name };
          }
          var ctrlElem = crBuild.buildControl(scope, 'schemas[' + index + ']');
          elem.find('.item').html(ctrlElem);
        }


        // initial state
        if (scope.model.type_) {
          // existing model, get item schema index
          var index = scope.schemas.reduce(function(acc, s, i) {
            acc = (s.name === scope.model.type_ ? i : acc);
            return acc;
          }, 0);
          scope.selectedRow = scope.schemas[index];
          createItem(index, false);
        }
        else {
          // empty model
          scope.selectedRow = scope.schemas[0];
          createItem(0, true);
        }


        // watch for item schema selection changes
        scope.$watch('selectedRow', function(newValue, oldValue) {
          if (!newValue || newValue === oldValue) {
            return;
          }
          var index = parseInt(elem.find('select').val());
          createItem(index, true);
        });
      }
    };
  });
})();