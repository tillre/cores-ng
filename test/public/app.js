

(function() {

  angular.module('testCoresAngular', ['cores'])

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
      $scope.id = $routeParams.id;
      
      $scope.$on('model:select', function(e, id) {
        e.stopPropagation();
        $location.path('/bars/' + id);
      });
    })
  ;
  
})();