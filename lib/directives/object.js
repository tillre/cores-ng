(function() {

  var module = angular.module('cores.directives');


  module.directive('crObject', function(
    crBuild
  ) {
    return {
      templateUrl: 'cr-object.html',

      link: function(scope, elem, attrs) {
        scope.options = angular.extend({
          indent: true,
          inline: false
        }, scope.options);


        // listen to own init event
        var initOff = scope.$on('cr:control:init', function(e) {
          e.stopPropagation();
          initOff();

          var content = crBuild.buildObject(scope, scope.schema, scope.model);
          elem.find('.properties').append(content);

          // listen to childs init event
          scope.$on('cr:control:init', function(e) {
            e.stopPropagation();
          });
        });
      }
    };
  });

})();