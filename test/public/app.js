

(function() {

  angular.module('testCoresAngular', ['ng', 'cores'])

    // .config(function(crResources) {
    //   return crResources.init();
    // })

    // .config(function($routeProvider) {

    //   var initiated = false;
    //   var init = function(crResources) {
    //     if (!initiated) {
    //       initiated = true;
    //       return crResources.init();
    //     }
    //   };

    //   $routeProvider.when('/bars', {
    //     templateUrl: '/test/public/resource.html', controller: 'BarCtrl',
    //     resolve: { cores: init }
    //   });
    //   $routeProvider.when('/bars/:id', {
    //     templateUrl: '/test/public/resource.html', controller: 'BarCtrl',
    //     resolve: { cores: init }
    //   });

    //   $routeProvider.otherwise({ redirectTo: '/' });
    // })


    .controller('AppCtrl', function($scope, crResources) {

      crResources.init().then(function() {

        $scope.type = 'Bar';
        //$scope.modelId = $routeParams.id;
        $scope.headers = [
          { title: 'Stringy', path: 'string' },
          { path: 'slug' },
          { title: 'NOW OR NEVER', map: function(doc) {
            return doc.date;
          }},
          { path: 'ref/bar' }
        ];
        $scope.views = [
          { title: 'Alt All', name: 'altall' },
          { title: 'Only asd', name: 'onlyASD' },
          { title: 'By String1', name: 'by_string', params: { keys: ['foo'] }}
        ];
        $scope.modelOptions = {
          buttons: [{ title: 'ClickMe!', event: 'rick:roll' },
                    { event: 'rick:roll', icon: 'minus' }]
        };
        $scope.listOptions = {
          buttons: [{ title: 'ClickMe!', event: 'rick:roll' },
                    { title: 'Bam', event: 'rick:roll', icon: 'plus' }]
        };
        // $scope.view = { title: 'All', name: 'all' };
        $scope.limit = 2;

        $scope.$on('cr:list:select', function(e, id) {
          e.stopPropagation();
          //$location.path('/bars/' + id);
          $scope.modelId = id;
        });

        $scope.$on('rick:roll', function(e, data) {
          console.log('Never gonna give, never gonna give...', data);
        });

      });
    })


    // .controller('BarCtrl', function($scope, $routeParams, $location) {

    //   $scope.type = 'Bar';
    //   $scope.modelId = $routeParams.id;
    //   $scope.headers = [
    //     { title: 'Stringy', path: 'string' },
    //     { path: 'slug' },
    //     { title: 'NOW OR NEVER', map: function(doc) {
    //       return doc.date;
    //     }},
    //     { path: 'ref/bar' }
    //   ];
    //   $scope.views = [
    //     { title: 'Alt All', name: 'altall' },
    //     { title: 'Only asd', name: 'onlyASD' },
    //     { title: 'By String1', name: 'by_string', params: { keys: ['foo'] }}
    //   ];
    //   $scope.modelOptions = {
    //     buttons: [{ title: 'ClickMe!', event: 'rick:roll' },
    //               { event: 'rick:roll', icon: 'minus' }]
    //   };
    //   $scope.listOptions = {
    //     buttons: [{ title: 'ClickMe!', event: 'rick:roll' },
    //               { title: 'Bam', event: 'rick:roll', icon: 'plus' }]
    //   };
    //   // $scope.view = { title: 'All', name: 'all' };
    //   $scope.limit = 2;

    //   $scope.$on('cr:list:select', function(e, id) {
    //     e.stopPropagation();
    //     $location.path('/bars/' + id);
    //   });

    //   $scope.$on('rick:roll', function(e, data) {
    //     console.log('Never gonna give, never gonna give...', data);
    //   });
    // })
  ;

})();
