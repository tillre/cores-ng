(function() {

  var module = angular.module('cores.directives');


  module.directive('crModel', function(crResources) {
    return {
      requice: 'crModel',
      scope: {
        type: '@',
        path: '@',
        // modelId: '=',
        // model: '?=',
        defaults: '=?',
        options: '=?'
      },

      replace: true,
      templateUrl: 'cr-model.html',

      // controller: 'crModelCtrl',

      link: function(scope, elem, attrs, ctrl) {

        // add/update/remove files from the model

        // button methods

        // scope.save = function() {
        //   return ctrl.save();
        // };

        // scope.cancel = function() {
        //   ctrl.cancel();
        // };

        // scope.destroy = function() {
        //   return ctrl.destroy();
        // };

        // scope.toggleDebug = function() {
        //   scope.debug = !scope.debug;
        // };

        // scope.isNew = function() {
        //   if (!scope.model) return true;
        //   return !scope.model._rev;
        // };

        // scope.buttonClick = function(e, eventName) {
        //   e.stopPropagation();
        //   scope.$emit(eventName, scope.model);
        // };



        //
        // build when type is set
        //
        // scope.$watch('type', function(newType) {
        //   if (!newType) {
        //     return;
        //   }
        //   scope.type = newType;
        //   ctrl.setState(ctrl.STATE_LOADING);

        //   var resource = crResources.get(scope.type);
        //   ctrl.setResource(crResources.get(scope.type));

        //   // load schema
        //   resource.schema().then(function(schema) {

        //     // load or create default model
        //     scope.schema = schema;
        //     var id = scope.modelId;

        //     if (!id) {
        //       ctrl.setModel();
        //       ctrl.setState(ctrl.STATE_EDITING);
        //     }
        //     else {
        //       return ctrl.load(id);
        //     }
        //   }).then(function() {

        //     // watch for modelId changes to load/clear the model
        //     scope.$watch('modelId', function(value) {
        //       console.log('model id changed');
        //       if (value) {
        //         ctrl.load(value);
        //       }
        //       else {
        //         ctrl.setModel();
        //       }
        //       // if (newId !== oldId) {
        //       //   if (newId) {
        //       //     // load model with new id
        //       //     console.log('load model');
        //       //     ctrl.load(newId);
        //       //   }
        //       //   else if (oldId) {
        //       //     // newId was set to null, create default value
        //       //     console.log('create new default value');
        //       //     ctrl.setModel();
        //       //   }
        //       // }
        //       // else {
        //       //   console.log('set model');
        //       //   ctrl.setModel();
        //       // }
        //     });
        //   });
        // });

      }
    };
  });
})();
