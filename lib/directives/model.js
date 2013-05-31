(function() {

  var module = angular.module('cores.directives');
  
  
  function ModelCtrl($scope, crResource, crSchema, crCommon) {

    var resource;
    var refCtrls = {};
    var self = this;

    $scope.$watch(function(scope) {
      console.log('scope change', scope);
    });
    
    var init = function(scope) {
      console.log('init model');
      resource = crResource.get(scope.type);
      resource.schema().then(
        function success(schema) {
          $scope.schema = schema;

          if (!scope.id) {
            // create a new empty model
            $scope.model = crSchema.createModel(schema);
          }
          else {
            // load the model with the id
            resource.load(scope.id).then(
              function(doc) {
                $scope.model = doc;
              }
            );
          }
        },
        function error(err) {
          throw new Error(err);
        }
      );
    };
    
    crCommon.watchUntil(
      $scope, function(scope) { return !!scope.type; }, init
    );

    // events

    $scope.$on('file', function(e, file, fileId) {
      e.stopPropagation();
      console.log('add file', arguments);
      $scope.file = file;
    });

    $scope.$on('ref', function(e, id, ctrl) {
      console.log('ref ctrl', ctrl.getId());
      refCtrls[id] = ctrl;
    });

    // controller methods

    this.save = function() {
      return resource.save($scope.model, $scope.file);
    };

    this.setId = function(id) {
      $scope.model._id = id;
    };

    this.getId = function() {
      return $scope.model._id;
    };

    this.setParentId = function(id) {
      $scope.model.parentId_ = id;
    };

    this.setModel = function(model) {
      $scope.model = model;
    };

    this.getModel = function() {
      return $scope.model;
    };

    this.getFile = function() {
      return $scope.file;
    };
    
    // scope functions
    
    $scope.save = function() {

      var ctrls = Object.keys(refCtrls).map(function(key) {
        return refCtrls[key];
      });
      
      crResource.save(self, ctrls).then(
        function() {
          console.log('save success');
        },
        function(reason) {
          console.log('save failed', reason);
          throw new Error(reason);
        }
      );
    };

    $scope.submit = function() {
      $scope.$emit('submit', self);
    };

    $scope.cancel = function() {
      $scope.$emit('cancel', 1, 2, 3);
    };

    $scope.destroy = function() {
      throw new Error('not implemented');

      resource.destroy($scope.model).then(
        function success() { console.log('destroy success'); },
        function error(err) {
          throw new Error(err);
        }
      );
    };
  }
  

  
  module.directive('crModel', function() {
    return {
      scope: {
        // type: '@',
        // id: '@'
        type: '=',
        id: '='
      },
      replace: true,
      templateUrl: 'cr-model.html',
      controller: ModelCtrl
    };
  });


  
  module.directive('crModalModel', function() {
    return {
      scope: {
        type: '@',
        id: '@',
        modalId: '@'
      },
      replace: true,
      templateUrl: 'cr-modal-model.html',
      controller: ModelCtrl
    };
  });


  
  module.directive('crModelForm', function($compile, crBuild, crSchema, crCommon) {
    return {
      scope: {
        schema: '=',
        model: '='
      },

      replace: true,
      templateUrl: 'cr-model-form.html',

      link: function(scope, elem, attrs) {

        var init = function(scope) {
          if (!crSchema.isObjectSchema(scope.schema) &&
              !crSchema.isArraySchema(scope.schema)) {
            throw new Error('Top level schema has to be a object or array');
          }

          var tmpl = crBuild(scope.schema, scope.model, 'schema', 'model',
                             { mode: 'minimal'});
          
          var link = $compile(tmpl);
          var content = link(scope);
          elem.html(content);
        };
        
        crCommon.watchUntil(
          scope, function(scope) { return scope.model && scope.schema; }, init
        );
      }
    };
  });

})();