

(function() {

  angular.module('testCoresAngular', ['ng', 'ngRoute', 'cores'])

    .config(function($routeProvider) {

      $routeProvider.when('/bars', {
        templateUrl: '/test/public/resource.html', controller: 'BarCtrl'
      });
      $routeProvider.when('/bars/:id', {
        templateUrl: '/test/public/resource.html', controller: 'BarCtrl'
      });

      $routeProvider.otherwise({ redirectTo: '/' });
    })


    .controller('AppCtrl', function($scope, crResources) {

      crResources.init().then(function() {
        console.log('cores initialized');
      });
    })


    .controller('BarCtrl', function($scope, $routeParams, $location) {

      $scope.type = 'Bar';
      $scope.modelId = $routeParams.id;
      $scope.headers = ['string1', 'ref/bar'];
      $scope.views = [
        { title: 'Alt All', name: 'altall' },
        { title: 'Only asd', name: 'onlyASD' },
        { title: 'By String1', name: 'by_string', params: { keys: ['foo'] }}
      ];
      // $scope.view = { title: 'All', name: 'all' };
      $scope.limit = 3;

      $scope.$on('list:select', function(e, id) {
        e.stopPropagation();
        $location.path('/bars/' + id);
      });
    })
  ;

})();