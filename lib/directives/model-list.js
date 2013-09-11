(function() {

  var module = angular.module('cores.directives');


  module.directive('crModelList', function(crCommon, crResources, crSchema) {
    return {
      scope: {
        type: '@',
        limit: '=?',
        headers: '=?'
      },

      replace: true,
      templateUrl: 'cr-model-list.html',

      link: function(scope, elem, attrs) {

        var prevIds = [];

        scope.isLoading = false;
        scope.prevId = null;
        scope.curId = null;
        scope.nextId = null;
        scope.pageNo = 1;
        scope.totalPages = 1;
        scope.rows = [];

        function load(startkey) {

          scope.isLoading = true;

          var limit = scope.limit || 20;
          var params = {
            include_docs: true,
            // fetch one more and use the id as the startkey for the next page
            limit: limit + 1,
            startkey: startkey
          };

          crResources.get(scope.type).view('all', params).then(function success(result) {

            if(result.total_rows === 0) return;

            var firstVal = result.rows[0].doc;

            // table header names
            if (!scope.headers || scope.headers.length === 0) {
              scope.headers = Object.keys(firstVal).filter(function(key) {
                return !crSchema.isPrivateProperty(key);
              });
            }

            // table rows values according to header
            scope.rows = result.rows.map(function(row) {
              return scope.headers.map(function(key) {
                return { id: row.id, value: row.doc[key] };
              });
            });

            if (result.rows.length > 0) {
              scope.curId = result.rows[0].id;
              scope.nextId = null;
              scope.prevId = prevIds.length > 0 ? prevIds[prevIds.length - 1] : null;
              scope.pageNo = prevIds.length + 1;
              scope.totalPages = Math.ceil(result.total_rows / limit);

              if (result.rows.length > limit) {
                // there a more pages, remember the last row's id and remove it from the list
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
            prevIds.push(scope.curId);
            load(scope.nextId);
          }
        };

        scope.prev = function() {
          if (prevIds.length > 0) {
            load(prevIds.pop());
          }
        };

        scope.$on('reload:list', function(e) {
          e.preventDefault();
          load();
        });

        var unwatch = scope.$watch('type', function() {
          unwatch();
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