(function() {

  var module = angular.module('cores.directives');

  
  module.controller('crModelCtrl', function($scope, $q, crResources, crSchema, crCommon) {

    var ModelCtrl = function() {

      var self = this;
      
      this._refs = {};
      this._files = {};

      this._init().then(
        function() {
          $scope.$emit('model:ready');
        }
      );
    };
    

    ModelCtrl.prototype._init = function() {

      var self = this;
      
      return crCommon.watch($scope, function(scope) {
        return !!scope.type;
      }).then(
        function(scope) {
          self._resource = crResources.get(scope.type);

          // add/update/remove files from the model
          $scope.$on('file:set', angular.bind(self, self.onFileSet));
          $scope.$on('file:remove', angular.bind(self, self.onFileRemove));

          // add/update/remove submodels
          $scope.$on('ref:set', angular.bind(self, self.onRefSet));
          $scope.$on('ref:remove', angular.bind(self, self.onRefRemove));

          self._initScopeFunctions();

          return self.load();
        }
      );
    };


    ModelCtrl.prototype._initScopeFunctions = function() {

      var self = this;
      
      $scope.save = function() {
        self.save();
      };

      $scope.submit = function() {
        $scope.$emit('submit', self);
      };

      $scope.cancel = function() {
        $scope.$emit('cancel');
      };

      $scope.destroy = function() {
        throw new Error('not implemented');
        self.destroy();
      };
    };

    
    //
    // event handlers
    //
    
    ModelCtrl.prototype.onFileSet = function(e, id, file) {
      e.stopPropagation();
      this._files[id] = file;
    };

    
    ModelCtrl.prototype.onFileRemove = function(e, id) {
      e.stopPropagation();
      console.log('remove file', id);
      if (!this._files.hasOwnProperty(id)) {
        throw new Error('Cannot remove file which does not exist');
      }
      delete this._files[id];
    };

    
    ModelCtrl.prototype.onRefSet = function(e, id, ref) {
      e.stopPropagation();
      this._refs[id] = ref;
    };

    
    ModelCtrl.prototype.onRefRemove = function(e, id) {
      e.stopPropagation();
      if (!this._refs.hasOwnProperty(id)) {
        throw new Error('Cannot remove ref which does not exist');
      }
      delete this._refs[id];
    };


    //
    // getters/setters
    //
    
    ModelCtrl.prototype.id = function(id) {
      if (!id) {
        return $scope.model._id;
      }
      $scope.model._id = id;
      $scope.$emit('model:set:id', id);
    };
    

    ModelCtrl.prototype.parentId = function(id) {
      if (!id) {
        return $scope.model.parentId_;
      }
      return $scope.model.parentId_ = id;
    };


    ModelCtrl.prototype.scope = function() {
      return $scope;
    };
    

    ModelCtrl.prototype.model = function() {
      return $scope.model;
    };


    ModelCtrl.prototype.files = function() {
      return this._files;
    };

    
    //
    // methods
    //
    
    ModelCtrl.prototype.load = function() {

      // load model
      
      var self = this;
      var id = $scope.id;

      return this._resource.schema().then(function(schema) {
        if (!id) {
          $scope.schema = schema;
          $scope.model = crSchema.createValue(schema);
        }
        else {
          return self._resource.load(id).then(function(doc) {
            $scope.schema = schema;
            $scope.model = doc;
          });
        }
      });
    };


    ModelCtrl.prototype.save = function() {

      // trigger saving on this and all referenced models
      
      var self = this;
      var refModels = Object.keys(this._refs).map(function(k) { return self._refs[k]; });

      // collect all new models that need an id
      
      var newModels = refModels.filter(function(model) {
        return !model.id();
      });
      if (!this.id()) {
        newModels.push(this);
      }
      
      if (newModels.length === 0) {

        // no new models, just save all

        return this._saveAll(refModels);
      }
      else {

        // get and set ids for new models and then save them

        return crResources.getIds(newModels.length).then(
          function(ids) {

            newModels.forEach(function(model) {
              model.id(ids.pop());
            });

            return self._saveAll(refModels);
          }
        );
      }
    };


    ModelCtrl.prototype._saveAll = function(refModels) {

      var self = this;
      
      // collect files

      var files = Object.keys(this._files).map(function(k) { return self._files[k]; });
      
      // collect save promises for $q.all and return that promise

      var promises = refModels.map(function(model) {
        // set the parent id on child models
        model.parentId(self.id());
        return model.save();
      });

      promises.push(this._resource.save($scope.model, files).then(function(doc) {
        $scope.model = doc;
      }));

      return $q.all.apply($q, promises);
    };


    return new ModelCtrl();
  });

  

  module.directive('crModel', function($templateCache) {
    return {
      scope: {
        type: '=',
        id: '=',
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
        id: '=',
        actions: '@',
        modalId: '@'
      },

      replace: true,
      templateUrl: 'cr-model-modal.html',

      controller: 'crModelCtrl'
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

        crCommon.watch(scope, function(scope) {
          return scope.model && scope.schema;
        }).then(
          function(scope) {
            if (!crSchema.isObjectSchema(scope.schema) &&
                !crSchema.isArraySchema(scope.schema)) {
              throw new Error('Top level schema has to be a object or array');
            }

            var tmpl = crBuild(scope.schema, scope.model, 'schema', 'model',
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