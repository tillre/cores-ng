(function() {

  var module = angular.module('cores.templates');

  
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
      '<span><label>{{name}}:</label><input type="number" ng-model="model"/></span>'
    );

    // number

    $templateCache.put(
      'cr-number.html',
      '<span><label>{{name}}:</label><input type="number" ng-model="model"/></span>'
    );

    // string

    $templateCache.put(
      'cr-string.html',
      '<span><label>{{name}}:</label><input class="input-xlarge" type="text" ng-model="model"/></span>'
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
      '<fieldset>' +
        '<label><strong>{{name}}:<strong></label>' +
        '<div class="indent properties"></div>' +
      '</fieldset>'
    );

    $templateCache.put(
      'cr-object-minimal.html',
      '<fieldset>' +
        '<div class="properties"></div>' +
      '</fieldset>'
    );

    // array

    $templateCache.put(
      'cr-array-item.html',

      '<div>' +
        '<hr>' +
        '<div class="item-controls">' +
          '<div class="btn-group"">' +
            '<button class="btn btn-small" ng-click="moveUp()">Up</button>' +
            '<button class="btn btn-small" ng-click="moveDown()">Down</button>' +
          '</div>' +
          '<button class="btn btn-small btn-danger" ng-click="remove()">Remove</button>' +
        '</div>' +
      '</div>'
    );

    $templateCache.put(
      'cr-array.html',

      '<div>' +
        '<label><strong>{{name}}</strong></label>' +

        '<div class="indent">' +
          '<button class="btn" ng-click="addItem(schema.items)">Add</button>' +

          '<ul class="unstyled">' +
            '<li ng-repeat="model in model">' +
              '<div cr-array-item schema="schema.items" model="model"></div>' +
            '</li>' +
          '</ul>' +
        '</div>' +
      '</div>'
    );

    // anyof
    
    $templateCache.put(
      'cr-anyof-array.html',

      '<div>' +
        '<label><strong>{{name}}</strong></label>' +

        '<div class="indent">' +
          '<div class="btn-group">' +
            '<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">Add <span class="caret"/></a>' +
            '<ul class="dropdown-menu" role="menu">' +
              '<li ng-repeat="schema in schema.items.anyOf">' +
                '<a ng-click="addItem(schema)">{{schema.name}}</a>' +
              '</li>' +
            '</ul>' +
          '</div>' +

          '<ul class="unstyled">' + 
            '<li ng-repeat="model in model"><div cr-anyof-item model="model"></div></li>' +
          '</ul>' +
        '</div>' +
      '</div>'
    );

    // image
    
    $templateCache.put(
      'cr-image.html',
      '<span>' +
        '<label>{{name}}</label>' +
        '<input type="file"/>' +
        '<img class="img-rounded" height="140">' +
      '</span>'
    );

    $templateCache.put(
      'cr-image-preview.html',
      '<div><img></div>'
    );
    
    // text
    
    $templateCache.put(
      'cr-text.html',
      '<div><label>{{name}}:</label><textarea ng-model="model"/></div>'
    );
    
    // model-ref
    
    $templateCache.put(
      'cr-model-ref.html',
      '<div>' +
        '<label><strong>{{name}}:</strong></label>' +
        '<div class="indent">' +
          '<button href="#{{modalId}}" class="btn" data-toggle="modal">Change</button>' +
          '<div cr-modal-model modal-id="{{modalId}}" type="{{schema.$ref}}"></div>' +
        '</div>' +
      '</div>'
    );
    
    // model

    $templateCache.put(
      'cr-model.html',
      '<div>' +
        '<div cr-model-form schema="schema" model="model"></div>' +
        '<div class="form-actions">' +
          '<button ng-click="save()" class="btn btn-primary">Save</button>' +
          '<button ng-click="cancel()" class="btn">Cancel</button>' +
          '<button ng-click="destroy()" class="btn btn-danger pull-right">Delete</button>' +
        '</div>' +
        '<pre>{{ model | json }}</pre>' +
      '</div>'
    );

    $templateCache.put(
      'cr-modal-model.html',
      '<div>' +
        '<div id="{{modalId}}" class="modal hide fade" tabindex="-1" role="dialog">' +
          '<div class="modal-header">' +
            '<button class="close" data-dismiss="modal">x</button>' +
            '<h3>{{type}}</h3>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div cr-model-form schema="schema" model="model"></div>' +
            '<pre>{{ model | json }}</pre>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button ng-click="submit()" class="btn btn-primary pull-left">Submit</button>' +
            '<button ng-click="cancel()" class="btn pull-right" data-dismiss="modal">Cancel</button>' +
        '</div>' +
      '</div>'
    );

    $templateCache.put(
      'cr-model-form.html',
      '<form></form>'
    );
    
  }]);
})();