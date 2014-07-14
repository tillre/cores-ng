(function() {

  var module = angular.module('cores.directives');


  module.directive('crSelectRef', function(
    crResources,
    crJSONPointer
  ) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-select-ref.html',

      link: function(scope, elem, attrs, crCtrl) {

        // validation
        if (scope.required) {
          crCtrl.addValidator('required', function(value) {
            return !!value;
          });
        }

        scope.rows = [];

        // load models
        crResources.get(scope.schema.$ref).view(
          'all', { include_docs: true }

        ).then(function(result) {
          // create rows
          scope.rows = result.rows.map(function(row) {
            var r = {
              id: row.id,
              name: ''
            };
            if (scope.options.previewPath) {
              r.name = crJSONPointer.get(row.doc, scope.options.previewPath);
            }
            else if (scope.options.previewPaths) {
              scope.options.previewPaths.forEach(function(path) {
                r.name += crJSONPointer.get(row.doc, path) + ' ';
              });
            }
            else {
              r.name = row.doc.title || row.doc.name || '';
            }
            if (scope.model.id_ && r.id === scope.model.id_) {
              scope.selectedRow = r;
            }
            return r;
          });
        });

        // watch for selection changes
        scope.$watch('selectedRow', function(newValue, oldValue) {
          if (newValue === oldValue) return;
          if (!newValue) {
            delete scope.model.id_;
          }
          else {
            scope.model.id_ = newValue.id;
          }
        });
      }
    };
  });
})();