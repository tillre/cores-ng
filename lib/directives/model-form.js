(function() {

  var module = angular.module('cores.directives');


  module.directive('crModelForm', function($compile, crBuild, crSchema, crCommon) {
    return {
      require: 'form',
      scope: {
        model: '=',
        schema: '=',
        valid: '='
      },

      replace: true,
      templateUrl: 'cr-model-form.html',

      link: function(scope, elem, attrs, formCtrl) {

        console.log('formCtrl', formCtrl);

        scope.formCtrl = formCtrl;
        scope.$watch('formCtrl.$valid', function(value) {
          scope.valid = formCtrl.$valid;
        });

        var childScope;

        scope.$watch('model', function() {
          if (!scope.schema) return;
          if (!crSchema.isObjectSchema(scope.schema)) {
            throw new Error('Top level schema has to be an object');
          }

          // cleanup dom and scope
          if (childScope) {
            elem.find('form').empty();
            childScope.$destroy();
          }

          var objElem = crBuild.buildControl(scope, scope.schema, '/model', { showLabel: false, indent: false });
          elem.html(objElem);
        });
      }
    };
  });
})();