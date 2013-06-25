(function() {

  var module = angular.module('cores.directives');
  
  
  module.directive('crModelSelectRef', function(crCommon, crResources) {
    return {
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        schema: '=',
        name: '@',
        path: '@'
      },
      
      replace: true,
      templateUrl: 'cr-model-select-ref.html',

      
      link: function(scope, elem, attrs) {

        // scope.$on('item:remove', function(e, model) {
        //   console.log('got item:remove', model, scope.model);
        //   console.log('is me', model === scope.model);
        // });
        
        scope.selectedItem = '';
        scope.items = [];

        var modelsByName = {};

        crCommon.watch(scope, function(scope) {
          return scope.model && scope.schema;
        }).then(
          function(scope) {

            // property name to display in selectbox
            var property = attrs.property || 'title';

            crResources.get(scope.schema.$ref).view('all').then(
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
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-model-create-ref.html',

      controller: function($scope) {

        var refId = crCommon.getRefId();
        var off;
        
        // events
        
        $scope.$on('submit', function(e, model) {
          e.stopPropagation();

          $scope.subModel = model.model();
          $scope.subFiles = model.files();
          $scope.closeModal();

          // listen to changes of models id
          
          if (off) off();
          off = model.scope().$on('model:set:id', function(e, id) {
            e.stopPropagation();
            $scope.model.id = id;
          });
          
          // notify model
          
          $scope.$emit('ref:set', refId, model);
        });

        
        $scope.$on('cancel', function(e) {
          e.stopPropagation();
          console.log('on cancel');
        });
      },

      
      link: function(scope, elem, attrs) {

        scope.modalId = crCommon.getModalId();
        scope.closeModal = function() {
          elem.find('.modal').modal('hide');
        };

        crCommon.watch(scope, function(scope) {
          return scope.model && scope.schema;
        }).then(
          function(scope) {
            if (scope.schema.view && scope.schema.view.preview) {
              var tmpl = '<div ' + scope.schema.view.preview + ' model="subModel" files="subFiles"/>';
              var e = $compile(tmpl)(scope);
              elem.find('.indent').append(e);
            }
          }
        );
      }
    };
  });

})();