(function() {

  var module = angular.module('cores.directives');
  
  
  function ModelCtrl($scope, crResource, crSchema, crCommon) {

    var resource;
    var refCtrls = {};
    var self = this;
    
    // create when type and id(optional) are set

    crCommon.watchUntil(
      $scope,
      function condition(scope) { return scope.type; },
      function then(scope) {
        create(scope.type, scope.id);
      }
    );

    function create(type, id) {
      resource = crResource.get(type);
      resource.schema().then(
        function success(schema) {
          $scope.schema = schema;

          if (!id) {
            // create a new empty model
            $scope.model = crSchema.createModel(schema);
          }
          else {
            // load the model with the id
            resource.load(id).then(
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
    }

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
        type: '@',
        id: '@'
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
        crCommon.watchUntil(
          scope,
          function condition(scope) { return scope.model && scope.schema; },
          function then(scope) {

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


  module.directive('crSelectModelRef', function() {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      
      replace: true,
      templateUrl: 'cr-select-model-ref.html',

      link: function(scope, elem, attrs) {
        crCommon.watchUntil(
          function condition(scope) { return scope.model && scope.schema },
          function then(scope) {
            console.log('attrs', attrs);
            console.log('showattr', attrs.attribute);
          }
        );
      }
    };
  });
  
  
  module.directive('crModelRef', function($compile, crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },

      replace: true,
      templateUrl: 'cr-model-ref.html',

      controller: function($scope) {

        var refId = crCommon.getRefId();
        var self = this;
        var modelCtrl;

        // events
        
        $scope.$on('submit', function(e, ctrl) {
          e.stopPropagation();

          $scope.subModel = ctrl.getModel();
          $scope.subFile = ctrl.getFile();
          $scope.closeModal();

          modelCtrl = ctrl;
          
          // notify parent model
          $scope.$emit('ref', refId, self);
        });

        $scope.$on('cancel', function(e) {
          e.stopPropagation();
          console.log('on cancel');
        });

        // controller methods

        this.save = function() {
          return modelCtrl.save();
        };
        
        this.getId = function() {
          return $scope.model.id;
        };

        this.setId = function(id) {
          $scope.model.id = id;
          modelCtrl.setId(id);
        };

        this.setParentId = function(id) {
          modelCtrl.setParentId(id);
        };

        this.setModel = function(model) {
          modelCtrl.setModel(model);
        };
        
        this.getModel = function() {
          return modelCtrl.getModel();
        };
      },

      
      link: function(scope, elem, attrs) {

        scope.modalId = 'model-ref-modal';
        scope.closeModal = function() {
          elem.find('.modal').modal('hide');
        };
        
        crCommon.watchUntil(
          scope,
          function condition(scope) { return scope.model && scope.schema; },
          function then(scope) {
            if (scope.schema.view.preview) {
              var tmpl = '<div ' + scope.schema.view.preview + ' model="subModel" file="subFile"/>';
              var e = $compile(tmpl)(scope);
              elem.find('.indent').append(e);
            }
          }
        );
      }
    };
  });

})();