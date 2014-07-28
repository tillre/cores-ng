(function() {

  var module = angular.module('cores.directives');


  module.directive('crMultiSelectRef', function(
    crResources,
    crJSONPointer
  ) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-multi-select-ref.html',

      link: function(scope, elem, attr, crCtrl) {

        scope.rows = [];

        // load models
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
            else if (scope.options.previewPaths) {
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


          // watch for selection changes
          scope.$watch('rows', function(newRows, oldRows) {
            // abort if selection didnt change
            var same = newRows.every(function(row, i) {
              return row.selected === oldRows[i].selected;
            });
            if (same) return;

            // sync selected rows with model
            scope.model = newRows.filter(function(row) {
              return row.selected;
            }).map(function(row) {
              return { id_: row.id };
            });
          }, true);
        });
      }
    };
  });
})();