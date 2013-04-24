(function() {

  var module = angular.module('cores.templates', ['ng']);

  module.run(['$templateCache', function($templateCache) {

    // boolean

    $templateCache.put(
      'cr-boolean.html',
      '<label>{{name}}<input type="checkbox" ng-model="model" name="{{name}}"/></label>'
    );

    // integer

    $templateCache.put(
      'cr-integer.html',
      '<label>{{name}}<input type="number" ng-model="model" name="{{name}}"/></label>'
    );

    // number

    $templateCache.put(
      'cr-number.html',
      '<label>{{name}}<input type="number" ng-model="model" name="{{name}}"/></label>'
    );

    // string

    $templateCache.put(
      'cr-string.html',
      '<label>{{name}}<input type="text" ng-model="model" name="{{name}}"/></label>'
    );

    // enum

    $templateCache.put(
      'cr-enum.html',
      '<label>{{name}}<select ng-model="model" ng-options="e for e in schema.enum" name="{{name}}"></select></label>'
    );

    // object

    $templateCache.put(
      'cr-object.html',
      '<div name={{name}}></div>'
    );

    // anyof
    
    $templateCache.put(
      'cr-anyof-item.html',
      '<div name="{{name}}"><button ng-click="remove()">Remove</button></div>'
    );

    $templateCache.put(
      'cr-anyof-array.html',
      '<div name={{name}}><div class="controls"/><ul><li ng-repeat="model in model"><div ' + NS + '-anyof-item model="model"></div></li></ul></div>'
    );

    // array

    $templateCache.put(
      
    );
    
  }]);
})();