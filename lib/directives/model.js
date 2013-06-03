(function() {

  var module = angular.module('cores.directives');

  
  module.controller('crModelCtrl', function($scope, $q, crResource, crSchema, crCommon) {

    var ModelCtrl = function() {

      var self = this;
      
      this._refs = {};
      this._files = {};

      this._isNew = true;
      
      crCommon.watchUntil(
        $scope,
        function(scope) { return !!scope.type; },
        function(scope) { self._init(); }
      );
    };
    

    ModelCtrl.prototype._init = function() {

      this._resource = crResource.get($scope.type);

      $scope.$on('file:set', angular.bind(this, this.onFileSet));
      $scope.$on('file:remove', angular.bind(this, this.onFileRemove));
      
      $scope.$on('ref:set', angular.bind(this, this.onRefSet));
      $scope.$on('ref:remove', angular.bind(this, this.onRefRemove));

      this._initScopeFunctions();
      
      this.load().then(
        function() { console.log('model load success'); },
        function() { console.log('model load error'); }
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
      console.log('set file', id, file);
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
      console.log('set ref', id, ref);
      this._refs[id] = ref;
    };

    
    ModelCtrl.prototype.onRefRemove = function(e, id) {
      e.stopPropagation();
      console.log('remove ref', id);
      if (!this._refs.hasOwnProperty(id)) {
        throw new Error('Cannot remove ref which does not exist');
      }
      delete this._refs[id];
    };


    //
    // getters/setters
    //
    
    ModelCtrl.prototype.isNew = function() { return this._isNew; };


    ModelCtrl.prototype.id = function(id) {
      if (!id) {
        return $scope.model._id;
      }
      return $scope.model._id = id;
    };
    

    ModelCtrl.prototype.parentId = function(id) {
      if (!id) {
        return $scope.model.parentId_;
      }
      return $scope.model.parentId_ = id;
    };


    //
    // methods
    //
    
    ModelCtrl.prototype.load = function() {

      // load model
      
      var self = this;
      var id = $scope.id;

      this._isNew = !id;
      
      return this._resource.schema().then(function(schema) {
        console.log('id', id);
        if (!id) {
          $scope.schema = schema;
          $scope.model = crSchema.createModel(schema);
        }
        else {
          return self._resource.load(id).then(function(doc) {
            console.log('loaded doc', doc);
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
      console.log('refs: ', refModels);
      // collect all new models
      
      var newModels = refModels.filter(function(model) {
        return model.isNew();
      });
      if (this.isNew()) {
        newModels.push(this);
      }
      
      if (newModels.length === 0) {

        // no new models, just save all
        return this._saveAll(refModels);
      }
      else {

        // get and set ids for new models and then save them

        return crResource.getIds().then(
          function(res) {

            newModels.forEach(function(model) {
              model.id(res.uuids.pop());
            });

            refModels.forEach(function(model) {
              model.parentId(self.id());
            });

            return self._saveAll(refModels);
          }
        );
      }
    };


    ModelCtrl.prototype._saveAll = function(refModels) {

      // collect save promises for $q.all and return that promise

      var self = this;
      
      var promises = refModels.map(function(model) {
        return model.save();
      });
      
      promises.push(this._resource.save($scope.model).then(function(doc) {
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
        view: '@',
        actions: '@'
      },

      controller: 'crModelCtrl',

      compile: function(tElem, tAttrs) {

        var templates = {
          'default': 'cr-model.html',
          'modal': 'cr-model-modal.html'
        };

        var view = tAttrs.view || 'default';
        var template = $templateCache.get(templates[view]);
        tElem.append(template);
        
        return function(scope, elem, attrs) {
        };
      }
    };
  });

  
  // module.directive('crModelEditor', function() {
  //   return {
  //     scope: {
  //       type: '=',
  //       id: '='
  //     },

  //     replace: true,
  //     templateUrl: 'cr-model-editor.html',

  //     controller: function($scope) {

  //       $scope.save = function() {
  //         $scope.$emit('model:save');
  //       };

  //       $scope.submit = function() {
  //         $scope.$emit('submit', self);
  //       };

  //       $scope.cancel = function() {
  //         $scope.$emit('cancel');
  //       };

  //       $scope.destroy = function() {
  //         throw new Error('not implemented');
  //         $scope.$emit('model:destroy');
  //       };
  //     }
  //   };
  // });


  
  // module.directive('crModelEditorModal', function(crModelCtrl) {
  //   return {
  //     scope: {
  //       type: '@',
  //       id: '@',
  //       modalId: '@'
  //     },
  //     replace: true,
  //     templateUrl: 'cr-model-editor-modal.html',
  //     controller: crModelCtrl
  //   };
  // });


  
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

          console.log('link formmm');
          
          elem.html(content);
        };
        
        crCommon.watchUntil(
          scope, function(scope) { return scope.model && scope.schema; }, init
        );
      }
    };
  });

})();