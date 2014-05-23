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
        type: '@',
        view: '=?',
        page: '=?',
        limit: '=?',
        columns: '=?',
        params: '=?'
      },

      replace: true,
      templateUrl: 'cr-model-list.html',

      link: function(scope, elem, attrs) {

        var resource;
        var schema;

        scope.limit = scope.limit || 25;
        scope.page = scope.page || 0;
        scope.columns = scope.columns || [];
        scope.params = scope.params || {};

        function reset() {
          scope.isLoading = false;
          scope.rows = [];
          scope.enablePrev = false;
          scope.enableNext = false;
        }
        reset();


        function update() {
          scope.isLoading = true;

          var params = {
            include_docs: true,
            // fetch one more to see if there is a next page
            limit: scope.limit + 1,
            skip: scope.page * scope.limit
          };
          angular.extend(params, scope.params);

          resource.view(scope.view || 'all', params).then(function success(result) {

            if(result.total_rows === 0) return;

            scope.enablePrev = scope.page > 0;
            scope.enableNext = result.rows.length > scope.limit;
            scope.isLoading = false;

            if (result.rows.length > scope.limit) {
              result.rows.pop();
            }

            scope.rows = result.rows.map(function(row) {
              return {
                id: row.doc._id,
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
          }, function(err) {
            throw err;
          });
        }

        //
        // scope methods
        //
        scope.select = function(id) {
          scope.$emit('cr:list:select', id);
        };

        scope.next = function() {
          scope.page += 1;
          update();
        };

        scope.prev = function() {
          scope.page -= 1;
          update();
        };

        scope.$on('cr:reload:list', function(e) {
          e.preventDefault();
          update();
        });


        //
        // load schema and fill list
        //
        scope.$watch('type', function(newType) {
          if (!newType) {
            return;
          }
          scope.type = newType;

          resource = crResources.get(scope.type);
          resource.schema().then(function(s) {
            schema = s;

            // auto generate headers when not set
            if (!scope.columns || scope.columns.length === 0) {
              scope.columns = Object.keys(schema.properties).filter(function(key) {
                return !crSchema.isPrivateProperty(key);
              }).map(function(key) {
                return { title: crCommon.capitalize(key).split('/')[0], path: key };
              });
            }
            // table column titles
            scope.titles = scope.columns.map(function(header) {
              return header.title ||
                (header.path ? crCommon.capitalize(header.path).split('/')[0] : '');
            });

            update();
          });

          scope.$watch('view', function(newValue, oldValue) {
            if (newValue === oldValue) return;
            if (!resource) return;
            // reload list on view change
            reset();
            update();
          });
        });
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