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
          $scope.model.id = model._id;
          $scope.$broadcast('preview:update', model._id);
        });

        $scope.$on('list:select', function(e, id) {
          e.stopPropagation();
          $scope.model.id = id;
          $scope.$broadcast('preview:update', id);
        });
      },

      link: function(scope, elem, attrs) {

        scope.editModalId = crCommon.getModalId();
        scope.selectModalId = crCommon.getModalId();        

        // scope methods
        
        scope.newModel = function() {
          scope.$broadcast('model:showmodal', scope.editModalId, null);
        };

        scope.updateModel = function() {
          scope.$broadcast('model:showmodal', scope.editModalId, scope.model.id);
        };

        scope.selectModel = function() {
          scope.$broadcast('list:showmodal', scope.selectModalId, true);
        };

        // validation

        var validation = crValidation(scope, {
          path: scope.path, schema: scope.schema, watch: 'model.id'
        });

        if (attrs.isRequired === 'true') {
          validation.addConstraint('required', function(value) {
            return !!scope.model.id;
          }, true);
        }
        
        // delay to give the preview time to initialize
        
        $timeout(function() {
          scope.$broadcast('preview:update', scope.model.id);
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

        scope.$on('preview:update', function(e, id) {

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