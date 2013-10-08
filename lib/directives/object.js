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

        var numProperties = 0;

        var isRequired = function (name) {
          var req = scope.schema.required || [];
          return req.indexOf(name) !== -1;
        };

        // listen for childs ready event and ready up when all fired
        var offready = scope.$on('ready', function(e) {

          e.stopPropagation();
          if (--numProperties === 0) {
            offready();
            scope.$emit('ready');
          }
        });

        // create templates for properties
        var tmpl = '';
        angular.forEach(scope.schema.properties, function(subSchema, key) {

          // ignore some keys
          if (crSchema.isPrivateProperty(key)) return;

          if (!scope.model.hasOwnProperty(key)) {
            scope.model[key] = crSchema.createValue(subSchema);
          }

          numProperties += 1;

          tmpl += crBuild(subSchema, scope.model[key],
                          'schema.properties.' + key, 'model.' + key,
                          (scope.path ? scope.path : '')  + '/' + key,
                          { isRequired: isRequired(key) });
        });
        // compile and link template
        var link = $compile(tmpl);
        var content = link(scope);
        elem.find('.properties').append(content);
      }
    };
  });

})();