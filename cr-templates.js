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
      '<span>' +
        '<label class="checkbox">{{name}}' +
          '<input type="checkbox" ng-model="model"/>' +
        '</label>' + 
      '</span>'
    );

    // integer

    $templateCache.put(
      'cr-integer.html',
      '<span><label>{{name}}:</label><input style="width:100%" type="number" ng-model="model"/></span>'
    );

    // number

    $templateCache.put(
      'cr-number.html',
      '<span><label>{{name}}:</label><input style="width:100%" type="number" ng-model="model"/></span>'
    );

    // string

    $templateCache.put(
      'cr-string.html',
      '<span><label>{{name}}:</label><input style="width:100%" type="text" ng-model="model"/></span>'
    );

    // enum

    $templateCache.put(
      'cr-enum.html',
      '<span>' +
        '<label>{{name}}:</label>' +
        '<select ng-model="model" ng-options="e for e in schema.enum"></select>' +
      '</span>'
    );

    // object

    $templateCache.put(
      'cr-object.html',
      '<form class="">' +
        '<label><strong>{{name}}:<strong></label>' +
        '<div style="padding-left: 12px; border-left: 10px solid #eee"></div>' +
      '</form>'
    );

    // anyof
    
    $templateCache.put(
      'cr-anyof-item.html',
      '<div><button class="btn" ng-click="remove()">Remove</button></div>'
    );

    $templateCache.put(
      'cr-anyof-array.html',
      '<div>' +
        '<label><strong>{{name}}</strong></label>' +
        '<div class="controls"/><div>' +
        '<div>' + 
          '<div ng-repeat="model in model"><div ' + NS + '-anyof-item model="model"></div></div>' +
        '</div>' + 
      '</div>'
    );

    // array

    $templateCache.put(
      'cr-array-item.html',
      '<div><button ng-click="remove()">Remove</button></div>'
    );

    $templateCache.put(
      'cr-array.html',
      '<div>' +
        '<label><strong>{{name}}</strong></label>' +
        '<button class="btn" ng-click="addItem()">Add</button>' +
        '<ul class="unstyled">' +
          '<li ng-repeat="model in model">' +
            '<div ' + NS + '-array-item schema="schema.items" model="model"></div>' +
          '</li>' +
        '</ul>' +
      '</div>'
    );

    // image
    
    $templateCache.put(
      'cr-image.html',
      '<div><label>{{name}}<input type="file"/></label><img height="240"></div>'
    );

    // text
    
    $templateCache.put(
      'cr-text.html',
      '<div><label>{{name}}:</label><textarea ng-model="model"/></div>'
    );
    
    // model

    $templateCache.put(
      'cr-model.html',
      '<div>' +
        '<form></form>' +
        '<div class="form-actions">' +
          '<button ng-click="save()" class="btn btn-primary">Save</button>' +
          '<button ng-click="cancel()" class="btn">Cancel</button>' +
          '<button ng-click="destroy()" class="btn btn-danger pull-right">Delete</button>' +
        '</div>' +
      '</div>'
    );
    
  }]);
})();