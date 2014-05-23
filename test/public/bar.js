

(function() {

  angular.module('testCoresAngular', ['ng', 'cores'])

    .controller('BarCtrl', function($scope, crResources) {

      crResources.init().then(function() {

        $scope.type = 'Bar';
      });
    })
  ;

})();
