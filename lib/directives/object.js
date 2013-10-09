(function() {

  var module = angular.module('cores.directives');


  module.directive('crObject', function(
    $compile,
    $templateCache,
    crSchema,
    crBuild,
    crOptions,
    crCommon
  ) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      templateUrl: 'cr-object.html',

      link: function(scope, elem, attrs) {
        var defaults = {
          showLabel: true,
          indentProperties: true
        };
        scope.options = crCommon.merge(defaults, crOptions.parse(attrs.options));

        var link = crBuild.buildObject(scope.schema, scope.model, scope.path);
        var content = link(scope);
        elem.find('.properties').append(content);
      }
    };
  });

})();