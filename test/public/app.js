

(function() {

  angular.module('testCoresAngular', ['cores'])

    .config(function($routeProvider) {

      // $routeProvider.when('/articles', {
      //   templateUrl: '/test/public/articles.html', controller: 'ArticlesCtrl'
      // });

      // $routeProvider.when('/images', {
      //   templateUrl: '/test/public/images.html', controller: 'ImagesCtrl'
      // });

      $routeProvider.when('/images', {
        templateUrl: '/test/public/resource.html', controller: 'ImageCtrl'
      });
      $routeProvider.when('/images/:id', {
        templateUrl: '/test/public/resource.html', controller: 'ImageCtrl'
      });

      
      // $routeProvider.when('/categories', {
      //   templateUrl: '/test/public/categories-list.html', controller: 'CategoriesListCtrl'
      // });
      
      // $routeProvider.when('/categories/new', {
      //   templateUrl: '/test/public/categories.html', controller: 'CategoriesDetailCtrl'
      // });
      
      // $routeProvider.when('/categories/:id', {
      //   templateUrl: '/test/public/categories.html', controller: 'CategoriesDetailCtrl'
      // });
      
      $routeProvider.otherwise({ redirectTo: '/' });
    })

    .controller('AppCtrl', function($scope, crResources) {
      crResources.init().then(function() {
        console.log('cores initialized');
      });
    })
  
    // .controller('ArticlesCtrl', function($scope) {
    // })

    // .controller('ImagesCtrl', function($scope) {
    // })
  
    // .controller('CategoriesListCtrl', function($scope, $location) {
    //   $scope.type = 'Category';
    //   $scope.$on('model:select', function(e, id) {
    //     e.stopPropagation();
    //     $location.path('/categories/' + id);
    //   });
    // })

    // .controller('CategoriesDetailCtrl', function($scope, $routeParams) {
    //   console.log('CategoriesDetailCtrl', $routeParams.id);
    //   $scope.type = 'Category';
    //   $scope.id = $routeParams.id;
    // })

    // .controller('FoosCtrl', function($scope, $routeParams, $location) {
    //   $scope.type = 'Foo';
    //   $scope.id = $routeParams.id;
      
    //   $scope.$on('model:select', function(e, id) {
    //     e.stopPropagation();
    //     $location.path('/foos/' + id);
    //   });
    // })

    .controller('ImageCtrl', function($scope, $routeParams, $location) {
      $scope.type = 'Image';
      $scope.id = $routeParams.id;
      
      $scope.$on('model:select', function(e, id) {
        e.stopPropagation();
        $location.path('/images/' + id);
      });
    })
  ;
  
})();