(function() {

  var module = angular.module('cores.directives');

  
  module.directive('crObject', function($compile, $templateCache, crSchema, crBuild, crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        template: '@'
      },

      compile: function(tElem, tAttrs) {

        var templates = {
          'default': 'cr-object.html',
          'minimal': 'cr-object-minimal.html'
        };
        
        var mode = tAttrs.mode || 'default';
        var template = $templateCache.get(templates[mode]);
        // TODO: use replaceWith instead of append, as soon as angular supports it
        // tElem.replaceWith(template);
        tElem.append(template);

        // Linking function
        
        return function(scope, elem, attrs) {

          scope.numProperties = 0;

          // listen for childs ready event and ready up when all fired
          var offready = scope.$on('ready', function(e) {
            e.stopPropagation();
            if (--scope.numProperties === 0) {
              offready();
              scope.$emit('ready');
            }
          });

          crCommon.watchUntil(
            scope,
            function condition(scope) { return scope.model && scope.schema; },
            function then(scope) {

              // create templates for properties
              var tmpl = '';
              angular.forEach(scope.schema.properties, function(subSchema, key) {

                // ignore some keys
                if (key === '_id' || key === '_rev' || key === 'type_') return;
                
                if (!scope.model.hasOwnProperty(key)) {
                  scope.model[key] = crSchema.createModel(subSchema);
                }

                scope.numProperties += 1;
                
                tmpl += crBuild(subSchema, scope.model[key],
                                'schema.properties.' + key, 'model.' + key);
              });

              // compile and link templates
              var content = $compile(tmpl)(scope);
              elem.find('.properties').append(content);
            }
          );
        };
      }
    };
  });

})();