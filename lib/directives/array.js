(function() {

  var module = angular.module('cores.directives');
  
  
  function ArrayItemCtrl($scope) {

    $scope.moveUp = function() {
      $scope.array.moveItemUp($scope.$parent.$index);
    };

    $scope.moveDown = function() {
      $scope.array.moveItemDown($scope.$parent.$index);
    };

    $scope.remove = function() {
      $scope.array.removeItem($scope.$parent.$index);
    };
  }


  function ArrayCtrl($scope, crSchema) {

    $scope.addItem = function(schema) {
      var obj = crSchema.createValue(schema, schema.name);
      $scope.model.push(obj);
    };

    // methods called by the array item controller
    
    this.removeItem = function(index) {
      $scope.$broadcast('item:remove', $scope.model[index]);
      $scope.model.splice(index, 1);
    };

    this.moveItemUp = function(index) {
      if (index === 0) return;
      $scope.model.splice(index - 1, 0, $scope.model.splice(index, 1)[0]);
    };

    this.moveItemDown = function(index) {
      if (index >= $scope.model.length) return;
      $scope.model.splice(index + 1, 0, $scope.model.splice(index, 1)[0]);
    };

    // wait for ready event of items on initialization

    var numItems = $scope.model.length;

    if (numItems === 0) {
      $scope.$emit('ready');
    }
    else {
      var off = $scope.$on('ready', function(e) {
        e.stopPropagation();
        if (--numItems === 0) {
          off();
          $scope.$emit('ready');
        }
      });
    }
  }


  function AnyofArrayCtrl($scope, crSchema) {

    // Inherit from ArrayCtrl, keep in mind to pass all deps
    ArrayCtrl.apply(this, arguments);

    angular.forEach($scope.schema.items.anyOf, function(anySchema, i) {
      if (!anySchema.name) throw new Error('AnyOf schema has to have a name');
    });
    
    this.getSchema = function(type) {
      var schema;
      angular.forEach($scope.schema.items.anyOf, function(anySchema) {
        if (anySchema.name === type) {
          schema = anySchema;
        }
      });
      if (!schema) throw new Error('No schema for type found: ' + type);
      return schema;
    };
  }
  
  
  //
  // array item
  //
  
  module.directive('crArrayItem', function($compile, crBuild) {
    return {
      require: '^crArray',
      scope: {
        model: '=',
        schema: '=',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-array-item.html',

      controller: ArrayItemCtrl,

      link: function(scope, elem, attrs, array) {

        scope.array = array;
        
        var tmpl = crBuild(scope.schema, scope.model, 'schema', 'model', scope.path,
                           { mode: 'minimal' });

        var link = $compile(tmpl);
        var e = link(scope);
        elem.append(e);
      }
    };
  });


  //
  // anyof array item
  //
  
  module.directive('crAnyofItem', function($compile, crBuild) {
    return {
      require: '^crAnyofArray',
      scope: {
        model: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-array-item.html',

      controller: ArrayItemCtrl,
      
      link: function(scope, elem, attrs, anyof) {
        // get the schema from the anyof-array
        scope.schema = anyof.getSchema(scope.model.type_);
        scope.array = anyof;
        
        var tmpl = crBuild(scope.schema, scope.model, 'schema', 'model', scope.path,
                           { 'mode': 'minimal' });
        var link = $compile(tmpl);
        var e = link(scope);
        elem.append(e);
      }
    };
  });

  
  //
  // array
  //
  
  module.directive('crArray', function(crSchema) {
    return {
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-array.html',

      controller: ArrayCtrl,
      
      link: function(scope, elem, attrs) {
        // ngrepeat can only bind to references when it comes to form fields
        // thats why we can only work with items of type object not primitives
        // this may change in a feature release
        if (!crSchema.isObjectSchema(scope.schema.items)) {
          throw new Error('Array items schema is not of type object: ' + JSON.stringify(scope.schema.items));
        }
      }
    };
  });


  //
  // anyof array
  //
  
  module.directive('crAnyofArray', function($compile) {
    return {
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-anyof-array.html',

      controller: AnyofArrayCtrl,

      link: function(scope, elem, attrs) {
        elem.find('.dropdown-toggle').dropdown();
      }
    };
  });

})();