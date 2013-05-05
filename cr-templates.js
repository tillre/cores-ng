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
      '<div>' +
        '<label class="checkbox">{{name}}' +
          '<input type="checkbox" ng-model="model"/>' +
        '</label>' + 
      '</div>'
    );

    // integer

    $templateCache.put(
      'cr-integer.html',
      '<div><label>{{name}}:</label><input type="number" ng-model="model"/></div>'
    );

    // number

    $templateCache.put(
      'cr-number.html',
      '<div><label>{{name}}:</label><input type="number" ng-model="model"/></div>'
    );

    // string

    $templateCache.put(
      'cr-string.html',
      '<div><label>{{name}}:</label><input type="text" ng-model="model"/></div>'
    );

    // enum

    $templateCache.put(
      'cr-enum.html',
      '<div>' +
        '<label>{{name}}:</label>' +
        '<select ng-model="model" ng-options="e for e in schema.enum"></select>' +
      '</div>'
    );

    // object

    $templateCache.put(
      'cr-object.html',
      '<fieldset>' +
        '<label><strong>{{name}}:<strong></label>' +
        '<div style="padding-left: 12px; border-left: 10px solid #eee" class=""></div>' +
      '</fieldset>'
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