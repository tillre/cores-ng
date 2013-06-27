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

    // number/integer

    $templateCache.put(
      'cr-number.html',
      '<span class="control-group" ng-class="{ error: hasErrors() }">' +
        '<div class="controls">' +
          '<label>{{name}}:</label><input type="number" ng-model="model"/>' +
          '<p ng-show="hasError(\'integer\')" class="help-inline">Value is not an integer</p>' +
          '<p ng-show="hasError(\'multipleOf\')" class="help-inline">Value is not a multiple of</p>' +
          '<p ng-show="hasError(\'minimum\')" class="help-inline">Value is less than minimum</p>' +
          '<p ng-show="hasError(\'maximum\')" class="help-inline">Value is greater than maximum</p>' +
        '</div>' +
      '</span>'
    );

    // string

    $templateCache.put(
      'cr-string.html',
      '<span class="control-group" ng-class="{ error: hasErrors() }">' +
        '<div class="controls">' +
          '<label>{{name}}:</label><input class="input-xlarge" type="text" ng-model="model"/>' +
          '<p ng-show="hasError(\'maxLength\')" class="help-inline">Value is too long</p>' +
          '<p ng-show="hasError(\'minLength\')" class="help-inline">Value is too short</p>' +
          '<p ng-show="hasError(\'pattern\')" class="help-inline">Value does not match the pattern</p>' +
          '<p ng-show="hasError(\'format\')" class="help-inline">Value does not match the format</p>' +
        '</div>' +
      '</span>'
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
              '<div cr-array-item schema="schema.items" model="model" path="{{path}}[{{$index}}]"></div>' +
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
            '<li ng-repeat="model in model"><div cr-anyof-item model="model" path="{{path}}[{{$index}}]"></div></li>' +
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
    
    // password
    
    $templateCache.put(
      'cr-password.html',
      '<div class="control-group" ng-class="{error: hasError}">' +
        '<label class="control-label">{{name}}:</label>' +
        '<input type="password" ng-model="pass1" style="margin-right: 4px"/>' +
        '<input type="password" ng-model="pass2"/>' +
        '<p ng-show="hasError" class="help-inline">{{ error }}</p>' +
      '</div>'
    );

    // ref

    $templateCache.put(
      'cr-ref.html',
      '<div>' +
        '<label><strong>{{name}}:</strong></label>' +
        '<div class="indent">' +
          '<div cr-ref-preview type="{{schema.$ref}}" options="{{schema.preview}}"></div>' +
          '<div class="btn-group">' +
            '<button ng-click="newModel()" class="btn">New</button>' +
            '<button ng-show="model.id" ng-click="updateModel()" class="btn">Edit</button>' +
            '<button ng-click="selectModel()" class="btn">Select</button>' +
          '</div>' +
        '</div>' +
        '<div cr-model-modal modal-id="{{editModalId}}" type="{{schema.$ref}}"></div>' +
        '<div cr-model-list-modal modal-id="{{selectModalId}}" type="{{schema.$ref}}"></div>' +
      '</div>'
    );

    $templateCache.put(
      'cr-ref-preview.html',
      '<p>{{ model[options] }}</p>'
    );
    
    // model

    $templateCache.put(
      'cr-model.html',
      '<div>' +
        '<div ng-switch on="data.state">' +
          '<div ng-switch-when="loading" class="alert alert-info">Loading...</div>' +
          '<div ng-switch-when="saving" class="alert alert-info">Saving...</div>' +
          '<div ng-switch-default cr-model-form schema="schema" ng-model="model" valid="data.valid"></div>' +
        '</div>' +
        '<div ng-show="!data.valid" class="alert alert-error">The form has errors</div>' +
        '<div class="form-actions btn-toolbar">' +
          '<button ng-click="save()" ng-class="{ disabled: !data.valid }" class="btn btn-primary">Save</button>' +
          '<button ng-click="destroy()" ng-show="!isNew()" class="btn btn-danger pull-right">Delete</button>' +
        '</div>' +
        '<pre>{{ model | json }}</pre>' +
      '</div>'
    );

    // model modal
    
    $templateCache.put(
      'cr-model-modal.html',
      '<div id="{{modalId}}" class="modal hide fade" tabindex="-1" role="dialog">' +
        '<div class="modal-header">' +
          '<button class="close" data-dismiss="modal">x</button>' +
          '<h3>{{type}}</h3>' +
        '</div>' +
        '<div class="modal-body" ng-switch on="data.state">' +
          '<div ng-switch-when="loading" class="alert alert-info">Loading...</div>' +
          '<div ng-switch-when="saving" class="alert alert-info">Saving...</div>' +
          '<div ng-switch-default cr-model-form schema="schema" ng-model="model" valid="data.valid"></div>' +
          '<div ng-show="!data.valid" class="alert alert-error">The form has errors</div>' +
          '<pre>{{ model | json }}</pre>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<div class="btn-toolbar">' +
            '<button ng-click="save()" ng-class="{ disabled: !data.valid }" class="btn btn-primary pull-left">Save</button>' +
            '<button ng-click="cancel()" class="btn pull-right" data-dismiss="modal">Cancel</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
    
    
    // model form
    
    $templateCache.put(
      'cr-model-form.html',
      '<form name="modelForm"></form>'
    );

    // model list

    $templateCache.put(
      'cr-model-list.html',
      '<table class="table">' +
        '<thead>' +
          '<tr>' +
            '<th ng-repeat="header in headers">{{header}}</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          '<tr ng-repeat="row in rows">' +
             '<td ng-click="select(item.id)" ng-repeat="item in row">{{item.value}}</td>' +
          '</tr>' +
        '</tbody>' +
      '</table>'
    );

    // model list modal

    $templateCache.put(
      'cr-model-list-modal.html',
      '<div id="{{modalId}}" class="modal hide fade" tabindex="-1" role="dialog">' +
        '<div class="modal-header">' +
          '<button class="close" data-dismiss="modal">x</button>' +
          '<h3>{{type}}</h3>' +
        '</div>' +
        '<div class="modal-body">' +
          '<div cr-model-list type="{{type}}"></div>' +
        '</div>' +
        '<div class="modal-footer btn-toolbar">' +
          '<button ng-click="cancel" class="btn pull-right" data-dismiss="modal">Cancel</button>' +
        '</div>' +
      '</div>'
    );
    
  }]);
})();