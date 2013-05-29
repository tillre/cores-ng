

(function() {

  angular.module('testCoresAngular', ['cores'])

    .config(function($routeProvider) {

      $routeProvider.when('/articles', {
        templateUrl: '/test/public/articles.html', controller: 'ArticlesCtrl'
      });

      $routeProvider.when('/images', {
        templateUrl: '/test/public/images.html', controller: 'ImagesCtrl'
      });

      $routeProvider.otherwise({ redirectTo: '/' });
    })

    .controller('AppCtrl', function($scope, crInit) {
      crInit.then(function() {
        console.log('cores initialized');
      });
    })
  
    .controller('ArticlesCtrl', function($scope) {
    })

    .controller('ImagesCtrl', function($scope) {
    })
  
  ;
  
})();