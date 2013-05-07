

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

    .controller('AppCtrl', function($scope, cores) {
      cores.initialize().then(function() {
        console.log('cores initialized');
      });
    })

    .controller('ModelCtrl', function($scope, cores) {
      
    })
  
    .controller('ArticlesCtrl', function($scope, cores) {
      // var r = cores.getResource('Article');
      // r.schema().then(function(schema) {
      //   $scope.model = {
      //     schema: schema,
      //     value: cores.createModel(schema),
      //     type: r.type
      //   };
      // });
    })

    .controller('ImagesCtrl', function($scope, cores) {
      // var r = cores.getResource('Image');
      // r.schema().then(function(schema) {
      //   $scope.model = {
      //     schema: schema,
      //     value: cores.createModel(schema),
      //     type: r.type
      //   };
      // });
    })
  
  ;
  
})();