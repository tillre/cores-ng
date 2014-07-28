(function() {

  var module = angular.module('cores.directives');

  module.directive('crSearchBox', function(crResources, crPagination) {
    return {
      scope: {
        type: '=',
        paginator: '=?',
        postponeLoad: '=?'
      },
      replace: true,
      templateUrl: 'cr-search-box.html',

      link: function(scope, elem, attrs) {

        scope.model = '';

        var searchActive = false;
        var defaultPaginator = scope.paginator;

        elem.find('input').on('keydown', function(e) {
          var ENTER = 13;

          switch(e.keyCode) {
          case ENTER:
            e.preventDefault();
            var value = scope.model;
            if (!value) {
              if (searchActive) {
                scope.paginator = defaultPaginator;
              }
              searchActive = false;
              return;
            }
            searchActive = true;

            var searchPaginator = crPagination.createSearchPaginator(
              crResources.get(scope.type), 'list', { q: value }
            );
            scope.postponeLoad = false;
            scope.paginator = searchPaginator;
            break;
          }
        });
      }
    };
  });
})();