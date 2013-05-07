

(function() {

  angular.module('testCoresAngular', ['cores'])
    .controller('AppCtrl', function($scope, cores) {

      cores.initialize().then(function() {
        console.log('cores intialized', cores);

        var resource = cores.getResource('Article');

        resource.schema().then(function(schema) {

          var model = cores.createModel(schema);
          model.body.push(
            {
              "text": "",
              "type_": "paragraph"
            }
          );
          model.body.push(
            {
              "check": true,
              "type_": "doit"
            }
          );
          
          console.log('schema', schema);
          console.log('model', model);

          $scope.type = resource.type;
          $scope.schema = schema;
          $scope.model = model;
        });
        
      });
    })
  ;
  
})();