(function() {

  var module = angular.module('cores.directives');


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

      controller: 'crArrayItemCtrl',

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


  module.directive('crAnyofArray', function($compile) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-anyof-array.html',

      controller: 'crAnyofArrayCtrl',

      link: function(scope, elem, attrs) {
        elem.find('.dropdown-toggle').dropdown();
      }
    };
  });
})();