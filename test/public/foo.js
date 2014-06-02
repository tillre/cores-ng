

(function() {

  angular.module('testCoresAngular', ['ng', 'cores'])

    .controller('FooCtrl', function($scope, crResources, crPagination) {

      crResources.init().then(function() {

        $scope.type = 'Foo';

        $scope.paginator = crPagination.createViewPaginator(
          crResources.get('Foo'), 'names', { limit: 3 /*, startkey: 'so', endkey: 'so\u9999'*/ }
        );

        $scope.columns = [
          { title: 'Name', path: 'name' },
          { path: 'slug' },
          { title: 'Baz',
            map: function(doc) {
              return '<a href="http://github.com">++' + doc.baz + '++</a>';
            }
          }
        ];

      });
    })
  ;

})();
