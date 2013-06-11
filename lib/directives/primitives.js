(function() {

  var module = angular.module('cores.directives');
  
  //
  // boolean
  //
  
  module.directive('crBoolean', function(crCommon) {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-boolean.html',
      controller: crCommon.StandardCtrl
    };
  });


  //
  // integer
  //
  
  module.directive('crInteger', function(crCommon) {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-integer.html',
      controller: crCommon.StandardCtrl
    };
  });


  //
  // number
  //
  
  module.directive('crNumber', function(crCommon) {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-number.html',
      controller: crCommon.StandardCtrl
    };
  });

  
  //
  // string
  //
  
  module.directive('crString', function(crCommon) {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-string.html',
      controller: crCommon.StandardCtrl
    };
  });


  //
  // enum
  //

  module.directive('crEnum', function(crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-enum.html',

      controller: crCommon.StandardCtrl

      // link: function(scope, elem, attrs) {

      //   crCommon.watch(scope, function(scope) { return !!scope.schema; }).then(
      //     function(scope) {

      //       var numItems = scope.enum.length;

      //       if (numItems === 0) {
      //         scope.$emit('ready');
      //         return;
      //       }

      //       var off = scope.$on('ready', function(e) {
      //         e.stopPropagation();
      //         if (--numItems === 0) {
      //           off();
      //           scope.$emit('ready');
      //         }
      //       });
      //     }
      //   );
      // }
    };
  });
  
})();