(function() {

  var module = angular.module('cores.directives');


  module.directive('crModelListFilter', function() {
    return {
      scope: {
        viewConfigs: '=',
        view: '='
      },

      replace: true,
      templateUrl: 'cr-model-list-filter.html',

      link: function(scope, elem, attrs) {

        var firstSelect = true;
        var defaultView = '';

        scope.$watch('viewConfig', function(newValue, oldValue) {
          if (firstSelect && newValue) {
            // remeber default view value
            defaultView = scope.view;
            firstSelect = false;
          }
          if (!firstSelect) {
            scope.view = newValue ? newValue.name : defaultView;
          }
        });
      }
    };
  });


  module.directive('crModelList', function(crCommon, crResources, crSchema) {
    return {
      scope: {
        type: '@',
        view: '=?',
        limit: '=?',
        headers: '=?'
      },

      replace: true,
      templateUrl: 'cr-model-list.html',

      link: function(scope, elem, attrs) {

        var resource;
        var schema;

        function initScope() {
          scope.prevIds = [];
          scope.isLoading = false;
          scope.prevId = null;
          scope.curId = null;
          scope.nextId = null;
          scope.pageNo = 1;
          scope.totalPages = 1;
          scope.rows = [];
        }
        initScope();

        function load(startkey) {

          scope.isLoading = true;

          var limit = scope.limit || 20;
          var view = scope.view || 'all';
          var params = {
            include_docs: true,
            include_refs: true,
            // fetch one more and use the id as the startkey for the next page
            limit: limit + 1,
            startkey: startkey
          };

          resource.view(view, params).then(function success(result) {
            if(result.total_rows === 0) return;

            // table rows values according to header
            scope.rows = result.rows.map(function(row) {
              return {
                id: row.id,
                items: scope.headers.map(function(path, i) {
                  return { value: crCommon.jsonPointer(row.doc, path) };
                })
              };
            });

            if (result.rows.length > 0) {
              scope.curId = result.rows[0].id;
              scope.nextId = null;
              scope.prevId = scope.prevIds.length > 0 ? scope.prevIds[scope.prevIds.length - 1] : null;
              scope.pageNo = scope.prevIds.length + 1;
              scope.totalPages = Math.ceil(result.total_rows / limit);

              if (result.rows.length > limit) {
                // there a more pages left, remember the last row's id and remove it from the list
                scope.nextId = result.rows[limit].id;
                scope.rows.pop();
              }
            }
            scope.isLoading = false;
          });
        }

        scope.select = function(id) {
          scope.$emit('list:select', id);
        };

        scope.next = function() {
          if (scope.nextId) {
            scope.prevIds.push(scope.curId);
            load(scope.nextId);
          }
        };

        scope.prev = function() {
          if (scope.prevIds.length > 0) {
            load(scope.prevIds.pop());
          }
        };

        scope.$on('reload:list', function(e) {
          e.preventDefault();
          load();
        });

        var unwatch = scope.$watch('type', function() {
          unwatch();
          resource = crResources.get(scope.type);
          resource.schema().then(function(s) {
            schema = s;

            // auto generate headers when not set
            if (!scope.headers || scope.headers.length === 0) {
              scope.headers = Object.keys(schema.properties).filter(function(key) {
                return !crSchema.isPrivateProperty(key);
              });
            }
            // table column titles
            scope.titles = scope.headers.map(function(header) {
              return header.split('.')[0];
            });

            load();
          });
        });

        scope.$watch('view', function(newValue, oldValue) {
          if (newValue === oldValue) return;
          if (!resource) return;
          // reload list on view change
          load();
        });
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