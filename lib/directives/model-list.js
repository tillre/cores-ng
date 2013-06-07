(function() {

  var module = angular.module('cores.directives');
  
  
  module.directive('crModelList', function(crCommon, crResources, crSchema) {
    return {
      scope: {
        type: '='
      },

      replace: true,
      templateUrl: 'cr-model-list.html',

      link: function(scope, elem, attrs) {

        crCommon.watch(scope, function(scope) {
          return !!scope.type;
        }).then(
          function(scope) {
            crResources.get(scope.type).view('all', { limit: 10 }).then(
              function success(result) {

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
              }
            );
          }
        );

        scope.select = function(id) {
          scope.$emit('model:select', id);
        };
      }
    };
  });
  
})();