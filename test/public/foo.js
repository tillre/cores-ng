

(function() {

  angular.module('testCoresAngular', ['ng', 'cores'])

    .controller('FooCtrl', function($scope, crResources) {

      crResources.init().then(function() {

        $scope.type = 'Foo';

        $scope.view = 'names';
        $scope.limit = 3;
        $scope.page = 0;

        // $scope.params = {
        //   startkey: 'so',
        //   endkey: 'so\u9999'
        // };

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
