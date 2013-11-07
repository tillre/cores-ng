(function() {

  var module = angular.module('cores.directives');


  module.directive('crMultiSelectRef', function(
    crFieldLink,
    crResources,
    crCommon,
    crJSONPointer
  ) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-multi-select-ref.html',

      link: crFieldLink({
        showLabel: true, indent: true
      }, function(scope, elem, attrs) {

        scope.rows = [];

        // load docs
        var unwatch = scope.$watch('schema.items.$ref', function(newValue) {
          if (!scope.schema.items.$ref) return;
          unwatch();

          crResources.get(scope.schema.items.$ref).view(
            'all', { include_docs: true }
          ).then(function(result) {
            // create rows
            scope.rows = result.rows.map(function(row) {
              var r = {
                id: row.id,
                selected: false
              };
              if (scope.options.previewPath) {
                r.name = crJSONPointer.get(row.doc, scope.options.previewPath);
              }
              else  if (scope.options.previewPaths) {
                r.name = '';
                scope.options.previewPaths.forEach(function(path) {
                  r.name += crJSONPointer.get(row.doc, path) + ' ';
                });
              }
              return r;
            });
            // select rows when id is in model
            scope.model.forEach(function(ref) {
              scope.rows.forEach(function(row) {
                if (row.id == ref.id_) { row.selected = true; }
              });
            });
          });
        });

        // watch for selection changes
        scope.$watch('rows', function(newValue, oldValue) {
          if (!newValue || (newValue && newValue.length === 0)) return;
          // sync selected rows with model
          scope.model = scope.rows.filter(function(row) {
            return row.selected;
          }).map(function(row) {
            return { id_: row.id };
          });
        }, true);
      })
    };
  });
})();