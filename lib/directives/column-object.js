(function() {

  var module = angular.module('cores.directives');


  module.directive('crColumnObject', function(
    $compile,
    crBuild,
    crOptions,
    crCommon,
    crSchema
  ) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      templateUrl: 'cr-column-object.html',

      link: function(scope, elem, attrs) {
        var defaults = {
          showLabel: true,
          showLabels : true,
          indent: false,
          inline: false
        };
        scope.options = crCommon.merge(defaults, crOptions.parse(attrs.options));

        var isRequired = function (name) {
          var req = scope.schema.required || [];
          return req.indexOf(name) !== -1;
        };

        var numProps = Object.keys(scope.schema.properties).filter(
          function(key) {
            return !crSchema.isPrivateProperty(key);
          }
        ).length;
        var cols = Math.round(12 / numProps);
        if (cols < 2) cols = 2;
        var colClass = 'col-md-' + cols;

        var tmpl = '<div class="row">';
        angular.forEach(scope.schema.properties, function(subSchema, key) {

          // ignore some keys
          if (crSchema.isPrivateProperty(key)) return;

          if (!scope.model.hasOwnProperty(key)) {
            scope.model[key] = crSchema.createValue(subSchema);
          }

          tmpl += '<div class="cr-seperate ' + colClass + '">';
          tmpl += crBuild.buildTemplate(subSchema, scope.model[key],
                                        'schema.properties.' + key, 'model.' + key,
                                        (scope.path ? scope.path : '')  + '/' + key,
                                        { isRequired: isRequired(key),
                                          showLabel: scope.options.showLabels });
          tmpl += '</div>';
        });
        tmpl += '</div>';

        var link = $compile(tmpl);
        var content = link(scope);
        elem.find('.properties').append(content);
      }
    };
  });

})();
