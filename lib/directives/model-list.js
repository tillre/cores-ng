(function() {

  var module = angular.module('cores.directives');


  module.directive('crModelList', function(crCommon, crResources, crSchema) {
    return {
      scope: {
        type: '@'
      },

      replace: true,
      templateUrl: 'cr-model-list.html',

      link: function(scope, elem, attrs) {

        function load() {
          crResources.get(scope.type).view('all', { limit: 10 }).then(function success(result) {

            if(result.total_rows === 0) return;

            var firstVal = result.rows[0].value;

            // headers array with property names

            scope.headers = Object.keys(firstVal).filter(function(key) {
              return !crSchema.isPrivateProperty(key);
            });

            // rows array with property values for each row

            scope.rows = result.rows.map(function(row) {
              return scope.headers.map(function(key) {
                return { id: row.id, value: row.value[key] };
              });
            });
          });
        }

        scope.headers = [];
        scope.rows = [];

        scope.select = function(id) {
          scope.$emit('list:select', id);
        };

        scope.$on('reload:list', function(e) {
          e.preventDefault();
          load();
        });

        load();
      }
    };
  });



  module.directive('crModelListModal', function() {
    return {
      scope: {
        type: '@',
        modalId: '@'
      },

      replace: true,
      templateUrl: 'cr-model-list-modal.html',

      link: function(scope, elem, attrs) {

        scope.$on('list:select', function(e, id) {
          elem.modal('hide');
        });

        scope.$on('showModal:list', function(e, modalId, reload) {

          if (modalId === scope.modalId) {
            e.preventDefault();
            elem.modal('show');

            if (reload) {
              scope.$broadcast('reload:list');
            }
          }
        });
      }
    };
  });


})();