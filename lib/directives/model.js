(function() {

  var module = angular.module('cores.directives');

  
  module.controller('crModelCtrl', function($scope, $q, crResources, crSchema, crCommon) {

    var self = this;
    this._files = {};

    //
    // scope methods/handlers
    //
    
    // add/update/remove files from the model

    $scope.$on('file:set', function(e, id, file) {
      e.stopPropagation();
      this._files[id] = file;
    });
    
    $scope.$on('file:remove', function(e, id) {
      e.stopPropagation();
      if (!self._files.hasOwnProperty(id)) {
        throw new Error('Cannot remove nonexistant file');
      }
      delete self._files[id];
    });

    // button methods
    
    $scope.save = function() {
      $scope.$emit('model:save');
      self.save();
    };

    $scope.cancel = function() {
      $scope.$emit('model:cancel');
    };

    $scope.destroy = function() {
      $scope.$emit('model:destroy');
      self.destroy();
    };

    $scope.isNew = function() {
      if (!$scope.model) return true;
      return !$scope.model._rev;
    };
    

    //
    // methods
    //
    
    this.load = function(id) {

      return this._resource.load(id).then(function(doc) {
        $scope.model = doc;
      });
    };


    this.save = function() {

      if (!$scope.valid) return;

      var self = this;
      var files = Object.keys(this._files).map(function(k) { return self._files[k]; });
      
      return this._resource.save($scope.model, files).then(function(doc) {
        $scope.model = doc;
        $scope.$emit('model:saved', $scope.model);
      });
    };


    this.destroy = function() {
      return this._resource.destroy($scope.model).then(
        function() {
          $scope.model = crSchema.createValue($scope.schema);
          $scope.$emit('model:destroyed');
        }
      );
    };
    

    //
    // init
    //
    
    return crCommon.watch($scope, function(scope) {

      return !!scope.type;

    }).then(function(scope) {

      // load schema
      self._resource = crResources.get(scope.type);
      return self._resource.schema();
      
    }).then(function(schema) {

      // load or create default model
      $scope.schema = schema;
      var id = $scope.modelId;

      if (!id) {
        $scope.model = crSchema.createValue(schema);
      }
      else {
        return self._resource.load(id).then(function(doc) {
          $scope.model = doc;
        });
      }
    }).then(function() {

      // watch for modelId changes to load/clear the model
      $scope.$watch('modelId', function(newId, oldId) {
        if (newId !== oldId) {
          if (newId) {
            // load model with id
            self.load(newId);
          }
          else if (oldId) {
            // new id is nullyfied, create default value
            $scope.model = crSchema.createValue($scope.schema);
          }
        }
      });
      
      $scope.$emit('model:ready');
    });
  });

  

  module.directive('crModel', function($templateCache) {
    return {
      scope: {
        type: '=',
        modelId: '=',
        actions: '@'
      },

      replace: true,
      templateUrl: 'cr-model.html',

      controller: 'crModelCtrl'
    };
  });


  module.directive('crModelModal', function() {
    return {
      scope: {
        type: '=',
        modelId: '=',
        actions: '@',
        modalId: '@'
      },

      replace: true,
      templateUrl: 'cr-model-modal.html',

      controller: 'crModelCtrl',

      link: function(scope, elem, attrs) {
        
        scope.$on('model:showmodal', function(e, modalId) {

          if (modalId === scope.modalId) {
            e.preventDefault();
            elem.modal('show');
          }
        });
      }
    };
  });
  
  
  module.directive('crModelForm', function($compile, crBuild, crSchema, crCommon) {
    return {
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        schema: '=',
        valid: '='
      },

      replace: true,
      templateUrl: 'cr-model-form.html',

      link: function(scope, elem, attrs) {

        scope.$watch('modelForm.$valid', function(newValue, oldValue, scope) {
          scope.valid = newValue;
        });
        
        crCommon.watch(scope, function(scope) {
          return scope.model && scope.schema;
        }).then(
          function(scope) {
            if (!crSchema.isObjectSchema(scope.schema)) {
              throw new Error('Top level schema has to be an object');
            }

            var tmpl = crBuild(scope.schema, scope.model, 'schema', 'model', '',
                               { mode: 'minimal'});
            
            var link = $compile(tmpl);
            var content = link(scope);

            elem.html(content);
          }
        );
      }
    };
  });

})();