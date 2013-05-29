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
    };
  });
  
})();