(function() {

  var module = angular.module('cores.directives');


  module.directive('crAnyofItem', function($compile, crCommon, crBuild) {
    return {
      require: '^crAnyofArray',
      scope: {
        model: '=',
        name: '@',
        path: '@',
        schemas: '=',
        options: '=?'
      },

      replace: true,
      templateUrl: 'cr-anyof-array-item.html',

      controller: 'crArrayItemCtrl',

      link: function(scope, elem, attrs, anyof) {

        var defaults = {
          indent: true
        };
        scope.options = crCommon.merge(defaults, scope.options);

        // get the schema from the anyof-array
        scope.schema = anyof.getSchema(scope.model.type_);
        scope.array = anyof;

        var tmpl = crBuild.buildTemplate(scope.schema, scope.model, 'schema', 'model',
                                         scope.path, { indent: false });
        var link = $compile(tmpl);
        var e = link(scope);
        elem.find('.cr-item-body').html(e);
        elem.find('.dropdown-toggle').dropdown();
      }
    };
  });


  module.directive('crAnyofArray', function($compile, crCommon, crFieldLink) {
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

      link: crFieldLink(function(scope, elem, attrs) {

        var defaults = {
          indent: true
        };
        scope.options = crCommon.merge(defaults, scope.options);

        elem.find('.dropdown-toggle').dropdown();
      })
    };
  });
})();