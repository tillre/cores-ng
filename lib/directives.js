/*global angular*/


(function() {

  angular.module('comodl.directives', ['ng', 'comodl.services'])

    // -- type directives --------------------------------------------------
  
    .directive('cmBoolean', function() {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          model: '=',
          name: '@'
        },
        template: '<label>{{name}}<input type="checkbox" ng-model="model"/></label>'
      };
    })
  
    .directive('cmInteger', function() {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          model: '=',
          name: '@'
        },
        template: '<label>{{name}}<input type="integer" ng-model="model"/></label>'
      };
    })
  
    .directive('cmNumber', function() {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          model: '=',
          name: '@'
        },
        template: '<label>{{name}}<input type="number" ng-model="model"/></label>'
      };
    })
  
    .directive('cmString', function() {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          model: '=',
          name: '@'
        },
        template: '<label>{{name}}<input type="text" ng-model="model"/></label>'
      };
    })


    .directive('cmEnum', function($compile) {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          model: '=',
          schema: '=',
          name: '@'
        },
        template: '<label>{{name}}<select ng-model="model" ng-options="e for e in schema.enum"></select></label>'
      };
    })
  

    .directive('cmObject', function($compile, builder) {
      return {
        restrict: 'A',
        replace: 'true',
        scope: {
          model: '=',
          schema: '=',
          name: '@'
        },
        template: '<div></div>',

        link: function postLink(scope, elem, attrs) {
          // console.log('-- link object --', scope.schema, scope.model);

          var tmpl = '<label>{{name}}</label><ul>';
          angular.forEach(scope.schema.properties, function(subSchema, key) {

            if (!scope.model.hasOwnProperty(key)) {
              scope.model[key] = builder.createModel(subSchema);
            }
            
            tmpl += builder.build(subSchema, scope.model[key],
                                  'schema.properties.' + key, 'model.' + key);
          });
          tmpl += '</ul>';
          
          // compile and link
          var link = $compile(tmpl);
          var content = link(scope);
          elem.append(content);
        }
      };
    })

    .directive('cmArray', function($compile, builder) {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          model: '=',
          schema: '=',
          name: '@'
        },
        template: '<div></div>',
        
        link: function postLink(scope, elem, attrs) {
          // console.log('-- link array  --');

          var tmpl = '<label>{{name}}</label><ol>';
          angular.forEach(scope.model, function(value, index) {
            tmpl += '<li>' + builder.build(scope.schema.items, value,
                                           'schema.items', 'model[' + index + ']') + '</li>';
          });
          tmpl += '</ol>';

          // compile and link
          var link = $compile(tmpl);
          var content = link(scope);
          elem.append(content);
        }
      };
    })

    // -- view directives --------------------------------------------------

    .directive('cmImage', function($compile, builder) {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          model: '=',
          schema: '=',
          name: '@'
        },
        // template: '<label>{{name}}<input type="file"></label>',
        template: '<div></div>',
        
        link: function postLink(scope, elem, attrs) {
          // console.log('-- link image --');

          // var tmpl = builder.build(scope.schema, scope.model, 'schema', 'model');

          // // compile and link
          // var link = $compile(tmpl);
          // var content = link(scope);
          // elem.append(content);
        }
      };
    })

    // -- model directive --------------------------------------------------

    .directive('cmModel', function($compile, builder) {

      return {
        scope: {
          model: '=',
          schema: '='
        },

        link: function postLink(scope, elem, attrs, controller) {

          // console.log('-- link cm-model --');
          
          // rebuild whenever the model reference changes
          
          var currentModel;
          
          scope.$watch(function(scope) {

            // check for changes
            if (scope.model === currentModel) {
              return;
            }
            if (!scope.schema) {
              throw new Error('No Schema defined');
            }
            currentModel = scope.model;

            var tmpl = builder.build(scope.schema, scope.model, 'schema', 'model');
            var link = $compile(tmpl);
            var content = link(scope);
            elem.prepend(content);
          });
        }
      };
    })
  
  ;

  
})();
