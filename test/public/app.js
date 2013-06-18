

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

    // .controller('TestCtrl', function($rootScope) {

    //   $rootScope.model = {
    //     foo: 'Hello',
    //     bar: 'Guden'
    //   };
    //   $rootScope.schema = {
    //     properties: {
    //       foo: { type: 'string' },
    //       bar: { type: 'string' }
    //     }
    //   };
    // })

    // .directive('crTest', function() {
    //   return {
    //     require: 'ngModel',
    //     scope: {
    //       schema: '=',
    //       model: '=ngModel'
    //     },
    //     link: function(scope, elem, attrs, ctrl) {
    //       console.log('link ctrl', ctrl);

    //       scope.$watch('model', function(newValue) {
    //         console.log('model changed', newValue);
    //       });
    //       scope.$watch('schema', function(newValue) {
    //         console.log('schema changed', newValue);
    //       });
    //     }
    //   };
    // })
  
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