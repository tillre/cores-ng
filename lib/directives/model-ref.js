(function() {

  var module = angular.module('cores.directives');
  
  
  module.directive('crModelSelectRef', function(crCommon, crResource) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      
      replace: true,
      templateUrl: 'cr-model-select-ref.html',

      link: function(scope, elem, attrs) {

        scope.$on('item:remove', function(e, model) {
          console.log('got item:remove', model, scope.model);
          console.log('is me', model === scope.model);
        });
        
        scope.selectedItem = '';
        scope.items = [];

        var modelsByName = {};

        var init = function(scope) {

          // property name to display in selectbox
          var property = attrs.property || 'title';

          crResource.get(scope.schema.$ref).view('all').then(
            function success(models) {

              models.rows.forEach(function(row) {

                var name = row.value[property];
                modelsByName[name] = row.value;
                
                scope.items.push(name);

                // set selected
                if (scope.model.id && scope.model.id === row.id) {
                  scope.selectedItem = name;
                }
              });
            }
          );
        }
        
        crCommon.watchUntil(
          scope, function(scope) { return scope.model && scope.schema; }, init
        );

        scope.$watch('selectedItem', function(newValue, oldValue) {
          if (newValue) {
            scope.model.id = modelsByName[newValue]._id;
          }
        });
      }
    };
  });
  

  
  module.directive('crModelCreateRef', function($compile, crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },

      replace: true,
      templateUrl: 'cr-model-create-ref.html',

      controller: function($scope) {

        var refId = crCommon.getRefId();
        var self = this;
        var modelCtrl;

        // events
        
        $scope.$on('submit', function(e, ctrl) {
          e.stopPropagation();

          $scope.subModel = ctrl.getModel();
          $scope.subFile = ctrl.getFile();
          $scope.closeModal();

          modelCtrl = ctrl;
          
          // notify model
          $scope.$emit('ref:set', refId, self);
        });

        $scope.$on('cancel', function(e) {
          e.stopPropagation();
          console.log('on cancel');
        });

        // controller methods

        this.save = function() {
          return modelCtrl.save();
        };
        
        this.getId = function() {
          return $scope.model.id;
        };

        this.setId = function(id) {
          $scope.model.id = id;
          modelCtrl.setId(id);
        };

        this.setParentId = function(id) {
          modelCtrl.setParentId(id);
        };

        this.setModel = function(model) {
          modelCtrl.setModel(model);
        };
        
        this.getModel = function() {
          return modelCtrl.getModel();
        };
      },

      
      link: function(scope, elem, attrs) {

        scope.modalId = 'model-create-ref-modal';
        scope.closeModal = function() {
          elem.find('.modal').modal('hide');
        };
        
        crCommon.watchUntil(
          scope,
          function condition(scope) { return scope.model && scope.schema; },
          function then(scope) {
            if (scope.schema.view.preview) {
              var tmpl = '<div ' + scope.schema.view.preview + ' model="subModel" file="subFile"/>';
              var e = $compile(tmpl)(scope);
              elem.find('.indent').append(e);
            }
          }
        );
      }
    };
  });

})();