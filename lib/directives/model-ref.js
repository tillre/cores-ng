(function() {

  var module = angular.module('cores.directives');


  module.directive('crModelRef', function(crCommon, crResources) {
    return {
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-model-ref.html',

      controller: function($scope) {

        $scope.$on('model:saved', function(e, model) {
          e.stopPropagation();
          $scope.model.id = model._id;
        });

        $scope.$on('list:select', function(e, id) {
          e.stopPropagation();
          $scope.model.id = id;
        });
      },

      link: function(scope, elem, attrs, ctrl) {

        scope.editModalId = crCommon.getModalId();
        scope.selectModalId = crCommon.getModalId();        

        scope.ref = {};
        
        scope.newModel = function() {
          scope.ref.id = null;
          scope.$broadcast('model:showmodal', scope.editModalId);
        };

        scope.updateModel = function() {
          scope.ref.id = scope.model.id;
          scope.$broadcast('model:showmodal', scope.editModalId);
        };

        scope.selectModel = function() {
          scope.$broadcast('list:showmodal', scope.selectModalId);
        };
        
        crCommon.watch(scope, function(scope) {

          return scope.model && scope.schema;
        }).then(function(scope) {

          // if (scope.schema.view && scope.schema.view.preview) {
          //   var tmpl = '<div ' + scope.schema.view.preview + ' model="subModel" files="subFiles"/>';
          //   var e = $compile(tmpl)(scope);
          //   elem.find('.indent').append(e);
          // }
        });
      }
    };
  });
})();