(function() {

  var module = angular.module('cores.directives');


  module.directive('crModelList', function(
    $sce,
    crCommon,
    crResources,
    crSchema,
    crJSONPointer
  ) {
    return {
      scope: {
        columns: '=?',
        paginator: '=',
        postponeLoad: '@?'
      },

      replace: true,
      templateUrl: 'cr-model-list.html',

      link: function(scope, elem, attrs) {

        scope.postponeLoad = scope.postponeLoad === 'true';

        scope.select = function(id) {
          scope.$emit('cr:list:select', id);
        };

        scope.next = function() {
          if (!scope.paginator.hasNext()) return;
          scope.paginator.loadNext().then(onLoadSuccess, onLoadError);
        };

        scope.prev = function() {
          if (!scope.paginator.hasPrev()) return;
          scope.paginator.loadPrev().then(onLoadSuccess, onLoadError);
        };

        scope.$on('cr:reload:list', function(e) {
          e.preventDefault();
          scope.paginator.loadInitial().then(onLoadSuccess, onLoadError);
        });


        scope.$watch('paginator', function(pg) {
          if (!pg) {
            return;
          }
          pg.resource.schema().then(function(schema) {

            // auto generate column configs when not set
            if (!scope.columns || scope.columns.length === 0) {
              scope.columns = Object.keys(schema.properties).filter(function(key) {
                return !crSchema.isPrivateProperty(key);
              }).map(function(key) {
                return { title: crCommon.capitalize(key).split('/')[0], path: key };
              });
            }

            // create table column titles
            scope.titles = scope.columns.map(function(header) {
              return header.title ||
                (header.path ? crCommon.capitalize(header.path).split('/')[0] : '');
            });

            if (scope.postponeLoad) {
              return;
            }
            scope.isLoading = true;
            pg.loadInitial().then(onLoadSuccess, onLoadError);
          });
        });


        // load handlers

        function onLoadSuccess(result) {
          scope.isLoading = false;
          scope.enableNext = scope.paginator.hasNext();
          scope.enablePrev = scope.paginator.hasPrev();
          scope.rows = result.rows.map(function(row) {
            return {
              id: row.id,
              items: scope.columns.map(function(header) {
                var val = '';
                if (header.path) {
                  val = crJSONPointer.get(row.doc, header.path);
                }
                else if (header.map) {
                  val = header.map(row.doc);
                }
                else if (header.title) {
                  val = row.doc[header.title.toLowerCase()];
                }
                return { value: $sce.trustAsHtml(String(val)) };
              })
            };
          });
        }

        function onLoadError(err) {
          throw err;
        }
      }
    };
  });


  module.directive('crModelListModal', function() {
    return {
      scope: {
        type: '@',
        modalId: '@',
        list: '=?'
      },

      replace: true,
      templateUrl: 'cr-model-list-modal.html',

      link: function(scope, elem, attrs) {

        if (!scope.list) scope.list = {};

        scope.$on('cr:list:select', function(e, id) {
          elem.modal('hide');
        });

        scope.$on('cr:showModal:list', function(e, modalId, reload) {

          if (modalId === scope.modalId) {
            e.preventDefault();
            elem.modal('show');
            if (reload) {
              scope.$broadcast('cr:reload:list');
            }
          }
        });
      }
    };
  });


})();