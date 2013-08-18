(function() {

  var module = angular.module('cores.directives');


  module.directive('crRef', function($timeout, crCommon, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-ref.html',

      controller: function($scope) {

        $scope.$on('model:saved', function(e, model) {
          e.stopPropagation();
          $scope.model.id_ = model._id;
          $scope.$broadcast('update:preview', model._id);
        });

        $scope.$on('list:select', function(e, id) {
          e.stopPropagation();
          $scope.model.id_ = id;
          $scope.$broadcast('update:preview', id);
        });
      },

      link: function(scope, elem, attrs) {

        scope.editModalId = crCommon.getModalId();
        scope.selectModalId = crCommon.getModalId();

        // scope methods

        scope.newModel = function() {
          scope.$broadcast('showModal:model', scope.editModalId, null);
        };

        scope.updateModel = function() {
          scope.$broadcast('showModal:model', scope.editModalId, scope.model.id_);
        };

        scope.selectModel = function() {
          scope.$broadcast('showModal:list', scope.selectModalId, true);
        };

        scope.hasModel = function() {
          return !!scope.model.id_;
        };

        // validation

        var validation = crValidation(scope, 'model.id_');

        if (attrs.isRequired === 'true') {
          validation.addConstraint('required', function(value) {
            return !!scope.model.id_;
          }, true);
        }

        // delay to give the preview time to initialize

        $timeout(function() {
          scope.$broadcast('update:preview', scope.model.id_);
          scope.$emit('ready');
        });
      }
    };
  });


  module.directive('crRefPreview', function(crResources) {
    return {
      scope: {
        type: '@',
        options: '@'
      },

      replace: true,
      templateUrl: 'cr-ref-preview.html',

      link: function(scope) {

        scope.$on('update:preview', function(e, id) {

          if (!scope.options || scope.options === '') {
            scope.options = 'title';
          }

          e.preventDefault();
          if (id) {
            crResources.get(scope.type).load(id).then(function(doc) {
              scope.model = doc;
            });
          }
        });
      }
    };
  });
})();