(function() {

  //
  // main module
  //
  angular.module('cores', ['ng',
                           'cores.services',
                           'cores.templates',
                           'cores.directives']);

  
  var NS = 'cr';
  var module = angular.module('cores.templates', ['ng']);

  
  module.run(['$templateCache', function($templateCache) {

    // boolean

    $templateCache.put(
      'cr-boolean.html',
      '<label>{{name}}<input type="checkbox" ng-model="model"/></label>'
    );

    // integer

    $templateCache.put(
      'cr-integer.html',
      '<label>{{name}}<input type="number" ng-model="model"/></label>'
    );

    // number

    $templateCache.put(
      'cr-number.html',
      '<label>{{name}}<input type="number" ng-model="model"/></label>'
    );

    // string

    $templateCache.put(
      'cr-string.html',
      '<label>{{name}}<input type="text" ng-model="model"/></label>'
    );

    // enum

    $templateCache.put(
      'cr-enum.html',
      '<label>{{name}}<select ng-model="model" ng-options="e for e in schema.enum"></select></label>'
    );

    // object

    $templateCache.put(
      'cr-object.html',
      '<div><label>{{name}}</label><ul></ul></div>'
    );

    // anyof
    
    $templateCache.put(
      'cr-anyof-item.html',
      '<div><button ng-click="remove()">Remove</button></div>'
    );

    $templateCache.put(
      'cr-anyof-array.html',
      '<div><label>{{name}}</label><div class="controls"/><ul><li ng-repeat="model in model"><div ' + NS + '-anyof-item model="model"></div></li></ul></div>'
    );

    // array

    $templateCache.put(
      'cr-array-item.html',
      '<div><button ng-click="remove()">Remove</button></div>'
    );

    $templateCache.put(
      'cr-array.html',
      '<div><label>{{name}}</label><button ng-click="addItem()">Add</button><ul><li ng-repeat="model in model"><div ' + NS + '-array-item schema="schema.items" model="model"></div></li></ul></div>'
    );

    // image
    
    $templateCache.put(
      'cr-image.html',
      '<div><label>{{name}}<input type="file"/></label><img height="240"></div>'
    );

    // model

    $templateCache.put(
      'cr-model.html',
      '<div><button ng-click="save()">SNED</button></div>'
    );
    
  }]);
})();