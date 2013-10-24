(function() {

  //
  // module definitions
  //

  angular.module('cores',
                 ['ng',
                  'cores.services',
                  'cores.filters',
                  'cores.templates',
                  'cores.controllers',
                  'cores.directives']);

  angular.module('cores.services',
                 ['ng']);

  angular.module('cores.templates',
                 ['ng']);

  angular.module('cores.filters',
                 ['ng']);

  angular.module('cores.controllers',
                 ['ng']);

  angular.module('cores.directives',
                 ['ng',
                  'cores.services',
                  'cores.templates']);

})();
angular.module("cores.templates").run(["$templateCache", function($templateCache) {

  $templateCache.put("cr-anyof-array-item.html",
    "<div>\n" +
    "  <div class=\"cr-anyof-item-group\">\n" +
    "    <div class=\"cr-item-controls btn-group\">\n" +
    "      <button class=\"btn btn-default btn-xs\" ng-click=\"moveUp()\">\n" +
    "        <span class=\"glyphicon glyphicon-arrow-up\"></span>\n" +
    "      </button>\n" +
    "      <button class=\"btn btn-default btn-xs\" ng-click=\"moveDown()\">\n" +
    "        <span class=\"glyphicon glyphicon-arrow-down\"></span>\n" +
    "      </button>\n" +
    "      <button class=\"btn btn-danger btn-xs\" ng-click=\"remove()\">\n" +
    "        <span class=\"glyphicon glyphicon-minus\"></span>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "    <div class=\"cr-item-body\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"cr-item-footer\">\n" +
    "    <div class=\"btn-group\">\n" +
    "      <button class=\"btn btn-default btn-xs dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\">\n" +
    "        <span class=\"glyphicon glyphicon-plus\"></span><span class=\"caret\"/>\n" +
    "      </button>\n" +
    "      <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "        <li ng-repeat=\"schema in schemas\">\n" +
    "          <a ng-click=\"addItem(schema)\">{{schema.name}}</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-anyof-array.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{name}}:</label>\n" +
    "\n" +
    "  <div>\n" +
    "    <div class=\"btn-group\">\n" +
    "      <button class=\"btn btn-default btn-sm dropdown-toggle\"\n" +
    "              data-toggle=\"dropdown\" href=\"#\">\n" +
    "        <span class=\"glyphicon glyphicon-plus\"></span><span class=\"caret\"/>\n" +
    "      </button>\n" +
    "      <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "        <li ng-repeat=\"schema in schema.items.anyOf\">\n" +
    "          <a ng-click=\"addItem(schema)\">{{schema.name}}</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <ul class=\"list-unstyled\">\n" +
    "      <li ng-repeat=\"model in model\">\n" +
    "        <div cr-anyof-item\n" +
    "             model=\"model\"\n" +
    "             path=\"{{path}}[ {{$index}} ]\"\n" +
    "             schemas=\"schema.items.anyOf\"\n" +
    "             options=\"options.item\"></div>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-array-item.html",
    "<div>\n" +
    "  <div class=\"cr-array-item-group\">\n" +
    "    <div class=\"cr-item-controls btn-group\">\n" +
    "      <button class=\"btn btn-default btn-xs\" ng-click=\"moveUp()\">\n" +
    "        <span class=\"glyphicon glyphicon-arrow-up\"></span>\n" +
    "      </button>\n" +
    "      <button class=\"btn btn-default btn-xs\" ng-click=\"moveDown()\">\n" +
    "        <span class=\"glyphicon glyphicon-arrow-down\"></span>\n" +
    "      </button>\n" +
    "      <button class=\"btn btn-danger btn-xs\" ng-click=\"remove()\">\n" +
    "        <span class=\"glyphicon glyphicon-minus\"></span>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "    <div class=\"cr-item-body\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"cr-item-footer\">\n" +
    "    <button class=\"btn btn-default btn-xs\" ng-click=\"addItem()\">\n" +
    "      <span class=\"glyphicon glyphicon-plus\"></span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-array.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{name}}:</label>\n" +
    "\n" +
    "  <div>\n" +
    "    <button class=\"btn btn-default btn-sm\" ng-click=\"addItem(schema.items)\">\n" +
    "      <span class=\"glyphicon glyphicon-plus\"></span>\n" +
    "    </button>\n" +
    "    <ul class=\"list-unstyled\">\n" +
    "      <li ng-repeat=\"model in model\">\n" +
    "        <div cr-array-item\n" +
    "             schema=\"schema.items\"\n" +
    "             model=\"model\"\n" +
    "             path=\"{{path}}/{{$index}}\"\n" +
    "             options=\"options.item\"></div>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-boolean.html",
    "<div class=\"checkbox\">\n" +
    "  <label class=\"control-label\">\n" +
    "    <input type=\"checkbox\" ng-model=\"model\"> {{name}}\n" +
    "  </label>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-datetime.html",
    "<div class=\"form-group row\" ng-class=\"{ 'has-error': hasErrors() }\">\n" +
    "  <label class=\"col-md-12 control-label\" ng-show=\"options.showLabel\">{{name}}</label>\n" +
    "\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <div class=\"input-group date\">\n" +
    "      <input type=\"text\" class=\"form-control\" data-format=\"dd.MM.yyyy\" />\n" +
    "      <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-calendar\"></span></span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <div class=\"input-group time\">\n" +
    "      <input type=\"text\" class=\"form-control\" data-format=\"hh:mm\"/>\n" +
    "      <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-time\"></span></span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <!-- <div class=\"input-append date\" id=\"dp3\" data-date-format=\"dd.mm.yyyy\"> -->\n" +
    "  <!--   <input type=\"text\" class=\"input-small\"> -->\n" +
    "  <!--   <span class=\"add-on\"><i class=\"icon-th\"></i></span> -->\n" +
    "  <!-- </div> -->\n" +
    "\n" +
    "  <!-- <div class=\"input-append bootstrap-timepicker\"> -->\n" +
    "  <!--   <input class=\"time input-small\" type=\"text\" class=\"input-small\"> -->\n" +
    "  <!--   <span class=\"add-on\"><i class=\"icon-time\"></i></span> -->\n" +
    "  <!-- </div> -->\n" +
    "</div>\n"
  );

  $templateCache.put("cr-enum.html",
    "<div class=\"form-group\" ng-class=\"{ 'has-error': hasErrors() }\">\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{name}}:</label>\n" +
    "  <select class=\"form-control\" ng-model=\"model\" ng-options=\"e for e in schema.enum\"></select>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-image-preview.html",
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <div class=\"thumbnail\">\n" +
    "      <img src=\"{{model.file.url}}\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );

  $templateCache.put("cr-image.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"control-label\">{{name}}</label>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <div class=\"thumbnail\">\n" +
    "        <img class=\"img-rounded\" height=\"140\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <span class=\"btn btn-default cr-btn-file\">\n" +
    "        Browse <input type=\"file\">\n" +
    "      </span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-markdown.html",
    "<div class=\"form-group\" ng-class=\"{ 'has-error': hasErrors() }\">\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{name}}:</label>\n" +
    "\n" +
    "  <div class=\"cr-editor clearfix\" ng-class=\"{ 'cr-border': options.showBorder }\">\n" +
    "    <textarea class=\"form-control cr-editor-area\" ng-model=\"model\" rows=\"1\"></textarea>\n" +
    "    <div class=\"cr-editor-preview\"></div>\n" +
    "    <div class=\"btn-group pull-right\">\n" +
    "      <button class=\"btn btn-default\" ng-click=\"togglePreview()\">{{ isPreview ? \"Edit\" : \"Preview\" }}</button>\n" +
    "    </div>\n" +
    "    <p ng-show=\"hasErrors()\" class=\"help-block\">{{ getFirstError() }}</p>\n" +
    "  </div>\n" +
    "</div>"
  );

  $templateCache.put("cr-model-form.html",
    "<div>\n" +
    "  <form name=\"modelForm\"></form>\n" +
    "  <div ng-show=\"!valid\" class=\"alert alert-danger\">The form has errors</div>\n" +
    "  <div ng-show=\"debug\" class=\"cr-debug\">\n" +
    "    <h4>Debug</h4>\n" +
    "    <h5>Model</h5>\n" +
    "    <pre>{{ model | json }}</pre>\n" +
    "    <h5>Errors</h5>\n" +
    "    <ul><li ng-repeat=\"(name, active) in errors\">{{name}}: {{active}}</li></ul>\n" +
    "  </div>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-model-list-filter.html",
    "<form class=\"form-inline\">\n" +
    "  <div class=\"form-group\">\n" +
    "    <label>Filter:</label>\n" +
    "    <select class=\"form-control input-sm\" ng-model=\"selectedView\" ng-options=\"v.title for v in views\">\n" +
    "      <option value=\"\">{{defaultTitle}}</option>\n" +
    "    </select>\n" +
    "  </div>\n" +
    "</div>"
  );

  $templateCache.put("cr-model-list-modal.html",
    "<div id=\"{{modalId}}\" class=\"modal fade\" tabindex=\"-1\">\n" +
    "  <div class=\"modal-dialog\">\n" +
    "    <div class=\"modal-content\">\n" +
    "      <div class=\"modal-header\">\n" +
    "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "        <h4 class=\"modal-title\">{{type}}</h4>\n" +
    "      </div>\n" +
    "      <div class=\"modal-body\">\n" +
    "        <div cr-model-list type=\"{{type}}\" view=\"view\"></div>\n" +
    "      </div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <button ng-click=\"cancel\" class=\"btn btn-default pull-right\" data-dismiss=\"modal\">Cancel</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-model-list.html",
    "<div>\n" +
    "  <table class=\"table table-hover\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th ng-repeat=\"title in titles\" style=\"text-transform:capitalize;\">{{title}}</th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr ng-repeat=\"row in rows\" style=\"cursor:pointer;\" ng-click=\"select(row.id)\">\n" +
    "        <td ng-repeat=\"item in row.items\">{{item.value}}</td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "  <div ng-show=\"showPagination\" class=\"pagination\">\n" +
    "    <ul>\n" +
    "      <li class=\"{{ !isLoading && prevKeys.length  ? '' : 'disabled' }}\"><a href=\"\" ng-click=\"prev()\">Prev</a></li>\n" +
    "      <li class=\"{{ !isLoading && nextKey ? '' : 'disabled' }}\"><a href=\"\" ng-click=\"next()\">Next</a></li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>"
  );

  $templateCache.put("cr-model-modal.html",
    "<div id=\"{{modalId}}\" class=\"modal fade\" tabindex=\"-1\">\n" +
    "  <div class=\"modal-dialog\">\n" +
    "    <div class=\"modal-content\">\n" +
    "      <div class=\"modal-header\">\n" +
    "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "        <h4 class=\"modal-title\">{{type}}</h4>\n" +
    "      </div>\n" +
    "      <div class=\"modal-body\">\n" +
    "        <div cr-model-form schema=\"schema\" model=\"model\" valid=\"data.valid\" debug=\"data.debug\"></div>\n" +
    "        <div ng-switch on=\"data.state\">\n" +
    "          <div ng-switch-when=\"loading\" class=\"alert alert-info\">Loading...</div>\n" +
    "          <div ng-switch-when=\"saving\" class=\"alert alert-info\">Saving...</div>\n" +
    "          <div ng-switch-when=\"error\" class=\"alert alert-danger\"><h4>ERROR</h4><pre>{{data.error|json}}</pre><pre>{{data.error.stack}}</div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"modal-footer\" ng-show=\"data.state == 'editing'\">\n" +
    "        <button ng-click=\"save()\" ng-class=\"{ disabled: !data.valid }\" class=\"btn btn-primary pull-left\">Save</button>\n" +
    "        <button ng-click=\"cancel()\" class=\"btn btn-default pull-right\" data-dismiss=\"modal\">Cancel</button>\n" +
    "        <button ng-click=\"toggleDebug()\" class=\"btn btn-default\">Debug</button>\n" +
    "        <button ng-repeat=\"button in data.buttons\" class=\"btn btn-default\" ng-click=\"buttonClick(button.event)\">{{button.name}}</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-model.html",
    "<div>\n" +
    "  <div cr-model-form schema=\"schema\" model=\"model\" valid=\"data.valid\" debug=\"data.debug\"></div>\n" +
    "  <div ng-switch on=\"data.state\">\n" +
    "    <div ng-switch-when=\"loading\" class=\"alert alert-info\">Loading...</div>\n" +
    "    <div ng-switch-when=\"saving\" class=\"alert alert-info\">Saving...</div>\n" +
    "    <div ng-switch-when=\"error\" class=\"alert alert-danger\"><h4>ERROR</h4><pre>{{data.error|json}}</pre><pre>{{data.error.stack}}</div>\n" +
    "    <div ng-switch-when=\"editing\" class=\"well\">\n" +
    "      <button ng-click=\"save()\" ng-class=\"{ disabled: !data.valid }\" class=\"btn btn-primary\">Save</button>\n" +
    "      <button ng-click=\"destroy()\" ng-show=\"!isNew()\" class=\"btn btn-danger pull-right\">Delete</button>\n" +
    "      <button ng-click=\"toggleDebug()\" class=\"btn btn-default pull-right\">Debug</button>\n" +
    "\n" +
    "      <button ng-repeat=\"button in data.buttons\"\n" +
    "              class=\"btn btn-default\"\n" +
    "              ng-click=\"buttonClick(button.event)\">{{button.name}}</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-multi-select-ref.html",
    "<div class=\"form-group\" ng-class=\"{ 'has-error': hasErrors() }\">\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{name}}:</label>\n" +
    "\n" +
    "  <div class=\"cr-indent\">\n" +
    "    <ul class=\"list-unstyled\">\n" +
    "      <li class=\"checkbox\" ng-repeat=\"row in rows\">\n" +
    "        <label class=\"control-label\">\n" +
    "          <input type=\"checkbox\" ng-model=\"row.selected\"/> {{row.name}}\n" +
    "        </label>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <p ng-show=\"hasErrors()\" class=\"help-block\">{{ getFirstError() }}</p>\n" +
    "  </div>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-number.html",
    "<div class=\"form-group\" ng-class=\"{ 'has-error': hasErrors() }\">\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{name}}:</label>\n" +
    "  <input class=\"form-control\" type=\"number\" ng-model=\"model\"/>\n" +
    "  <p ng-show=\"hasErrors()\" class=\"help-block\">{{ getFirstError() }}</p>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-object.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"control-label cr-object-label\" ng-show=\"options.showLabel\">{{name}}:</label>\n" +
    "  <div ng-class=\"{ 'cr-indent': options.indent }\" class=\"properties\"></div>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-password.html",
    "<div class=\"form-group\" ng-class=\"{ 'has-error': hasErrors() }\">\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{name}}:</label>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <input class=\"form-control\" type=\"password\" ng-model=\"pass1\"/>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <input class=\"form-control\" type=\"password\" ng-model=\"pass2\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <p ng-show=\"hasErrors()\" class=\"help-block\">{{ getFirstError() }}</p>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-readonly.html",
    "<div class=\"form-group\" ng-class=\"{ 'has-error': hasErrors() }\">\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{name}}:</label>\n" +
    "  <span class=\"form-control\" disabled>{{model}}</span>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-ref-preview.html",
    "<p>{{ model | crJsonPointer:options.previewPath }}</p>\n"
  );

  $templateCache.put("cr-ref.html",
    "<div>\n" +
    "  <div class=\"form-group\" ng-class=\"{ 'has-error': hasErrors() }\">\n" +
    "    <label class=\"control-label\" ng-show=\"options.showLabel\">{{name}}:</label>\n" +
    "\n" +
    "    <div ng-show=\"model.id_\" class=\"cr-preview\"></div>\n" +
    "\n" +
    "    <div class=\"cr-ref-controls\">\n" +
    "      <div class=\"btn-group\">\n" +
    "        <button ng-click=\"newModel()\" class=\"btn btn-default\">New</button>\n" +
    "        <button ng-show=\"hasModel()\" ng-click=\"updateModel()\" class=\"btn btn-default\">Edit</button>\n" +
    "        <button ng-click=\"selectModel()\" class=\"btn btn-default\">Select</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div ng-show=\"hasErrors()\" class=\"help-block\">{{ getFirstError() }}</div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div cr-model-modal\n" +
    "       modal-id=\"{{editModalId}}\"\n" +
    "       type=\"{{schema.$ref}}\"\n" +
    "       path=\"{{path}}\"\n" +
    "       defaults=\"options.defaults\"></div>\n" +
    "\n" +
    "  <div cr-model-list-modal\n" +
    "       modal-id=\"{{selectModalId}}\"\n" +
    "       type=\"{{schema.$ref}}\"\n" +
    "       view=\"options.listView\"></div>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-single-select-ref.html",
    "<div class=\"form-group\" ng-class=\"{ 'has-error': hasErrors() }\">\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{name}}:</label>\n" +
    "\n" +
    "  <select class=\"form-control\" ng-model=\"selectedRow\" ng-options=\"r.name for r in rows\">\n" +
    "    <option value=\"\">-- choose --</option>\n" +
    "  </select>\n" +
    "  <p ng-show=\"hasErrors()\" class=\"help-block\">{{ getFirstError() }}</p>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-slug.html",
    "<div class=\"form-group\" ng-class=\"{ 'has-error': hasErrors() }\">\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{name}}:</label>\n" +
    "  <div class=\"input-group\">\n" +
    "    <span class=\"input-group-btn\">\n" +
    "      <button ng-click=\"generate()\" class=\"btn btn-default\">Generate</button>\n" +
    "    </span>\n" +
    "    <input class=\"form-control\" type=\"text\" ng-model=\"model\"/>\n" +
    "  </div>\n" +
    "  <p ng-show=\"hasErrors()\" class=\"help-block\">{{ getFirstError() }}</p>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-string.html",
    "<div class=\"form-group\" ng-class=\"{ 'has-error': hasErrors() }\">\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{name}}:</label>\n" +
    "  <input class=\"form-control\" type=\"text\" ng-model=\"model\"/>\n" +
    "  <p ng-show=\"hasErrors()\" class=\"help-block\">{{ getFirstError() }}</p>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-tab-object.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"control-label cr-object-label\" ng-show=\"options.showLabel\">{{name}}:</label>\n" +
    "  <div class=\"properties\"></div>\n" +
    "</div>\n"
  );

  $templateCache.put("cr-text.html",
    "<div class=\"form-group\" ng-class=\"{ 'has-error': hasErrors() }\">\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{name}}:</label>\n" +
    "  <textarea class=\"form-control\" ng-model=\"model\"/>\n" +
    "  <p ng-show=\"hasErrors()\" class=\"help-block\">{{ getFirstError() }}</p>\n" +
    "</div>"
  );

}]);

(function() {

  var module = angular.module('cores.filters');

  module.filter('crJsonPointer', function(crCommon, crJSONPointer) {

    return function(input, path) {
      if (!input) return null;
      return crJSONPointer.get(input, path);
    };
  });

})();
(function() {

  var module = angular.module('cores.controllers');


  module.controller('crAnyofArrayCtrl', function($injector, $controller, $scope, crSchema) {

    // inherit from ArrayCtrl
    $controller('crArrayCtrl', { $scope: $scope });

    angular.forEach($scope.schema.items.anyOf, function(anySchema, i) {
      if (!anySchema.name) throw new Error('AnyOf schema has to have a name');
    });

    // called by the anyof-item controller

    this.getSchema = function(type) {
      var schema;
      angular.forEach($scope.schema.items.anyOf, function(anySchema) {
        if (anySchema.name === type) {
          schema = anySchema;
        }
      });
      if (!schema) throw new Error('No schema for type found: ' + type);
      return schema;
    };
  });
})();
(function() {

  var module = angular.module('cores.controllers');


  module.controller('crArrayCtrl', function($scope, crSchema) {

    $scope.addItem = function(schema, index) {
      var obj = crSchema.createValue(schema, schema.name);
      if (typeof index === 'undefined' || index >= $scope.model.length) {
        $scope.model.push(obj);
      }
      else {
        $scope.model.splice(index, 0, obj);
      }
    };

    $scope.$on('cr:remove:item', function(e, index) {
      e.stopPropagation();
      $scope.model.splice(index, 1);
    });

    $scope.$on('cr:add:item', function(e, schema, index) {
      e.stopPropagation();
      $scope.addItem(schema, index + 1);
    });

    $scope.$on('cr:moveUp:item', function(e, index) {
      e.stopPropagation();
      if (index === 0) return;
      $scope.model.splice(index - 1, 0, $scope.model.splice(index, 1)[0]);
    });

    $scope.$on('cr:moveDown:item', function(e, index) {
      e.stopPropagation();
      if (index >= $scope.model.length) return;
      $scope.model.splice(index + 1, 0, $scope.model.splice(index, 1)[0]);
    });
  });
})();
(function() {

  var module = angular.module('cores.controllers');


  module.controller('crArrayItemCtrl', function($scope) {

    $scope.moveUp = function() {
      $scope.$emit('cr:moveUp:item', $scope.$parent.$index);
    };

    $scope.moveDown = function() {
      $scope.$emit('cr:moveDown:item', $scope.$parent.$index);
    };

    $scope.remove = function() {
      $scope.$emit('cr:remove:item', $scope.$parent.$index);
    };

    $scope.addItem = function(schema) {
      schema = schema || $scope.schema;
      $scope.$emit('cr:add:item', schema, $scope.$parent.$index);
    };
  });
})();
(function() {

  var module = angular.module('cores.controllers');


  module.controller('crModelCtrl', function(
    $scope,
    $q,
    crJSONPointer,
    crResources,
    crSchema,
    crCommon
  ) {

    var STATE_EDITING = 'editing';
    var STATE_LOADING = 'loading';
    var STATE_SAVING = 'saving';
    var STATE_ERROR = 'error';

    $scope.options = $scope.options || {};

    var self = this;
    var data = $scope.data = {
      valid: true,
      state: STATE_EDITING,
      debug: false,
      files: {},
      buttons: $scope.options.buttons || []
    };

    // add/update/remove files from the model

    $scope.$on('cr:file:set', function(e, id, file) {
      e.stopPropagation();
      data.files[id] = file;
    });

    $scope.$on('cr:file:remove', function(e, id) {
      e.stopPropagation();
      delete data.files[id];
    });

    // button methods

    $scope.save = function() {
      $scope.$emit('cr:model:save');
      return self.save();
    };

    $scope.cancel = function() {
      $scope.$emit('cr:model:cancel');
    };

    $scope.destroy = function() {
      $scope.$emit('cr:model:destroy');
      return self.destroy();
    };

    $scope.toggleDebug = function() {
      $scope.data.debug = !$scope.data.debug;
    };

    $scope.isNew = function() {
      if (!$scope.model) return true;
      return !$scope.model._rev;
    };

    $scope.buttonClick = function(e) {
      $scope.$emit(e, $scope.model);
    };
    //
    // methods
    //

    this.load = function(id) {
      data.state = STATE_LOADING;
      return this._resource.load(id).then(function(doc) {
        self.setModel(doc);
        data.state = STATE_EDITING;

      }, function(err) {
        data.state = STATE_ERROR;
        data.error = err;
      });
    };


    this.save = function() {
      var def = $q.defer();

      if (!$scope.data.valid) {
        def.reject(new Error('Model is not valid'));
        return def.promise;
      }
      data.state = STATE_SAVING;

      var fs = Object.keys(data.files).map(function(k) { return data.files[k]; });

      this._resource.save($scope.model, fs).then(function(doc) {

        self.setModel(doc);
        $scope.modelId = doc._id;
        data.state = STATE_EDITING;
        $scope.$emit('cr:model:saved', $scope.model);
        def.resolve(doc);

      }, function(err) {
        var rootErrors = [];
        if (err.errors && angular.isArray(err.errors)) {
          // error has form field errors
          data.state = STATE_EDITING;
          err.errors.forEach(function(v) {
            if (!v.path) {
              rootErrors.push(v);
            }
            else {
              $scope.$broadcast('cr:set:customError', v.path, v.code, v.message);
            }
          });
        }
        else {
          rootErrors.push(err);
        }
        if (rootErrors.length) {
          data.state = STATE_ERROR;
          data.error = rootErrors;
        }
        def.reject(err);
      });
      return def.promise;
    };


    this.destroy = function() {
      return this._resource.destroy($scope.model).then(
        function() {
          self.setModel();
          $scope.$emit('cr:model:destroyed');
        }
      );
    };


    this.setModel = function(model) {
      if (!model) {
        // create default model
        model = crSchema.createValue($scope.schema);
        // set custom default values
        if ($scope.defaults) {
          Object.keys($scope.defaults).forEach(function(key) {
            var value = $scope.defaults[key];
            crJSONPointer.set(model, key, value);
          });
        }
      }
      // reset files dict when model changes
      data.files = {};

      $scope.model = model;
    };


    //
    // init
    //
    data.state = STATE_LOADING;
    self._resource = crResources.get($scope.type);

    // load schema
    self._resource.schema().then(function(schema) {

      // load or create default model
      $scope.schema = schema;
      var id = $scope.modelId;

      if (!id) {
        self.setModel();
        data.state = STATE_EDITING;
      }
      else {
        return self.load(id);
      }
    }).then(function() {

      // watch for modelId changes to load/clear the model
      $scope.$watch('modelId', function(newId, oldId) {

        if (newId !== oldId) {
          if (newId) {
            // load model with new id
            self.load(newId);
          }
          else if (oldId) {
            // newId was set to null, create default value
            self.setModel();
          }
        }
      });
    });
  });

})();

(function() {

  var module = angular.module('cores.services');


  module.factory('crBuild', function($compile, crCommon, crOptions, crSchema) {

    //
    // get the title from the schema or alternativly from the path
    //
    function getModelName(schema, modelPath) {

      if (schema.title) {
        return schema.title;
      }
      if (schema.name) {
        return crCommon.capitalize(schema.name);
      }
      var items = modelPath.split('.');
      return crCommon.capitalize(items[items.length - 1]);
    }


    //
    // Create a template for a schema with optional view configuration
    //
    function buildTemplate(schema, model, schemaPath, modelPath, absPath, options) {

      schemaPath = schemaPath || 'schema';
      modelPath = modelPath || 'model';
      absPath = absPath || '';
      options = options || {};

      var viewType = schema.type;
      var viewName = getModelName(schema, modelPath);

      // infer some types
      if (!schema.type) {
        if (schema.properties) viewType = 'object';
        if (schema.items) viewType = 'array';
      }

      // handle extended types
      if (schema.hasOwnProperty('enum')) {
        viewType = 'enum';
      }
      else if (schema.hasOwnProperty('$ref')) {
        viewType = 'ref';
      }
      else if (viewType === 'array' &&
               schema.hasOwnProperty('items') &&
               schema.items.anyOf) {
        viewType = 'anyof-array';
      }

      // use number directive for integers
      if (viewType === 'integer') {
        viewType = 'number';
        options.isInteger = true;
      }

      // add namespace prefix for default views
      viewType = 'cr-' + viewType;

      if (schema.hasOwnProperty('view')) {
        // custom view type and options
        if (angular.isObject(schema.view)) {
          viewType = schema.view.type || viewType;
          viewName = schema.view.name || viewName;

          // add specific view properties as options
          angular.forEach(schema.view, function(value, key) {
            if (key !== 'type' && key !== 'name') {
              options[key] = value;
            }
          });
        }
        else if (angular.isString(schema.view)) {
          viewType = schema.view;
        }
        else throw new Error('View has to be of type object or string');
      }

      return  '<div ' + viewType +
        ' name="' + viewName + '"' +
        ' schema="' + schemaPath + '"' +
        ' model="' + modelPath + '"' +
        ' path="' + absPath + '"' +
        ' options="' + crOptions.stringify(options) + '"' +
        '/>';
    }


    return {
      buildTemplate: buildTemplate,
      getModelTitle: getModelName
    };
  });

})();
(function() {

  var module = angular.module('cores.services');

  // Create a new file id
  var createFileId = (function(id) {
    return function() { return 'file' + ++id; };
  })(0);


  // Create a new modal id
  var createModalId = (function(id) {
    return function() { return 'modal-' + ++id; };
  })(0);


  // Create a new object id
  var createObjectId = (function(id) {
    return function() { return 'object-' + ++id; };
  })(0);


  var slugify = function(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    var slug = '';
    var map = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss',
                '/': '-', '_': '-', ',': '-', ':': '-', ';': '-', '.': '-' };

    for (var i = 0; i < str.length; ++i) {
      var c = str.charAt(i);
      slug += map[c] || c;
    }

    slug = slug.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-') // collapse dashes
      .replace(/^-|-$/g, ''); // trim dashes

    return slug;
  };


  var capitalize = function(str) {
    if (!str || str.length === 0) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.substr(1);
  };


  var trim = function(str) {
    return this.replace(/^\s+|\s+$/g, '');
  };


  var merge = function(a, b) {
    for (var x in b) {
      a[x] = b[x];
    }
    return a;
  };


  module.service('crCommon', function($q) {

    return {
      createFileId: createFileId,
      createModalId: createModalId,
      createObjectId: createObjectId,

      slugify: slugify,
      capitalize: capitalize,

      merge: merge
    };
  });

})();
(function() {

  var module = angular.module('cores.services');

  //
  // wraps link functions for generic stuff
  //
  module.factory('crFieldLink', function(crCommon, crOptions) {

    return function(/*[defaults], linkFn*/) {

      var defaults = arguments.length === 2 ? arguments[0] : {
          showLabel: true
      };
      var linkFn = arguments[arguments.length - 1];

      return function(scope, elem, attrs) {
        scope.options = crCommon.merge(angular.copy(defaults),
                                       crOptions.parse(attrs.options));
        linkFn(scope, elem, attrs);
      };
    };
  });

})();
(function() {

  var module = angular.module('cores.services');

  // TODO: very incomplete implmentation


  function jsonPointerGet(obj, path) {
    // TODO: array paths
    if (!path) return obj;
    var parts = path.split('/');
    if (parts.length && parts[0] === '') parts.shift();
    if (parts.length && parts[parts.length - 1] === '') parts.pop();
    if (parts.length === 0) return obj;

    var value = obj[parts[0]];
    for (var i = 1; i < parts.length; ++i) {
      if (!value) break;
      value = value[parts[i]];
    }
    return value;
  }


  function jsonPointerSet(obj, path, value) {
    // TODO: array paths
    var parts = path.split('/');
    if (parts.length && parts[0] === '') parts.shift();
    if (parts.length && parts[parts.length - 1] === '') parts.pop();
    if (parts.length === 0) return;

    var o = obj;
    var p = parts[0];

    while(true) {
      parts.shift();
      if (parts.length === 0) {
        o[p] = value;
        return;
      }
      o = o[p];
      p = parts[0];
    }
  }


  //
  // json pointer get/set service
  //
  module.service('crJSONPointer', function() {

    return {
      get: jsonPointerGet,
      set: jsonPointerSet
    };
  });

})();
(function() {

  var module = angular.module('cores.services');

  //
  // attr options service
  //
  module.service('crOptions', function() {

    return {

      stringify: function(options) {
        options = options || {};
        return escape(JSON.stringify(options));
      },

      parse: function(options) {
        if (!options) return {};
        return JSON.parse(unescape(options));
      }
    };
  });

})();
(function() {

  var module = angular.module('cores.services');

  //
  // Create an error object from a response
  //
  function makeError(response) {

    var msg = response.msg || '';
    if (!msg && response.data) {
      msg = response.data.message || response.data.error;
    }

    var err = new Error(msg);
    err.code = response.code || response.status;

    if (response.config) {
      err.config = response.config;
    }

    if (response.data && response.data.errors) {
      err.errors = response.data.errors;
    }
    return err;
  };


  //
  // crResource
  //
  module.factory('crResource', function($http, $q, $rootScope) {

    var Resource = function(type, config, host) {

      this.type = type;

      // add config to this
      angular.extend(
        this,
        { path: '', schemaPath: '', viewPaths: {} },
        config
      );

      if (host) {
        this.path = host + this.path;
        this.schemaPath = host + this.schemaPath;

        var self = this;
        angular.forEach(this.viewPaths, function(path, name) {
          self.viewPaths[name] = host + path;
        });
      }
    };


    //
    // Get a resource schema
    //
    Resource.prototype.schema = function() {

      return $http.get(this.schemaPath).then(
        function(res) { return res.data; },
        function(res) { return $q.reject(makeError(res)); }
      );
    };


    //
    // Load a resource from the server
    //
    Resource.prototype.load = function(id, params) {

      var path = this.path;

      if (id) {
        if (typeof id === 'string') {
          path += '/' + id;
        }
        else if (typeof id === 'object' && !params) {
          // params passed as first arg
          params = id;
        }
      }
      var config = { params: params || {} };

      return $http.get(path, config).then(
        function(res) { return res.data; },
        function(res) { return $q.reject(makeError(res)); }
      );
    };


    //
    // Save/update a resource on the server
    //
    Resource.prototype.save = function(doc, files) {

      doc = JSON.parse(JSON.stringify(doc));

      if (files && !angular.isArray(files)) {
        files = [files];
      }
      var isMultipart = false;
      var docId = doc._id;
      var docRev = doc._rev;

      // create multipart formdata when saving files

      if (files && files.length) {
        var fd = new FormData();
        fd.append('type_', this.type);
        fd.append('doc', JSON.stringify(doc));

        files.forEach(function(file, i) {
          fd.append('file' + i, file);
        });
        fd.append('numFiles', files.length);

        // when updating, add the id and rev
        if (docId)  fd.append('_id', docId);
        if (docRev) fd.append('_rev', docRev);

        doc = fd;
        isMultipart = true;
      }

      var req  = {
        url: this.path,
        method: 'POST',
        data: doc
      };
      if (docId && docRev) {
        // update
        req.method = 'PUT';
        req.url += '/' + docId + '/' + docRev;
      }
      else if (docId) {
        // create with id
        req.method = 'PUT';
        req.url += '/' + docId;
      }

      if (isMultipart) {
        return this._sendMultipart(req);
      }
      else {
        return $http(req).then(
          function(res) { return res.data; },
          function(res) { return $q.reject(makeError(res)); }
        );
      }
    };


    Resource.prototype._sendMultipart = function(req) {
      var def = $q.defer();

      // send multipart manually with xhr for now, $http seems to have problems with it
      var xhr = new XMLHttpRequest();

      xhr.addEventListener('load', function() {

        var data = typeof xhr.response === 'string' ? JSON.parse(xhr.response) : xhr.response;

        if (xhr.status === 200) {
          def.resolve(data);
        }
        else {
          def.reject(makeError({code: xhr.status, data: data}));
        }
        // call apply, because we are outside the angular life-cycle
        $rootScope.$apply();
      });

      xhr.open(req.method, req.url);
      xhr.send(req.data);

      return def.promise;
    };


    //
    // Delete a resource on the server
    //
    Resource.prototype.destroy = function(doc) {

      if (!doc._id || !doc._rev) {
        throw new Error('Cannot delete doc without id or rev');
      }
      return $http.delete(this.path + '/' + doc._id + '/' + doc._rev).then(
        function(res) {},
        function(res) { return $q.reject(makeError(res)); }
      );
    };


    //
    // Call a couchdb view
    //
    Resource.prototype.view = function(name, params) {

      var path = this.viewPaths[name];
      if (!path) {
        throw new Error('No view with name found: ' + name);
      }

      var config = {
        params: {}
      };
      // stringify non string params as json, to preserve them
      // angularjs http will otherwise do funky stuff with array params
      for (var x in params) {
        if (typeof params[x] !== 'string') {
          config.params[x] = JSON.stringify(params[x]);
        }
        else {
          config.params[x] = params[x];
        }
      }
      return $http.get(path, config).then(
        function(res) { return res.data; },
        function(res) { return $q.reject(makeError(res)); }
      );
    };
    return Resource;
  });


  //
  // crResource
  //
  module.service('crResources', function($http, $q, $rootScope, crResource) {


    var Resources = function() {

      this._resources = {};
      this._path = '';
    };


    Resources.prototype.init = function(options) {

      options = options || {};
      this._host = options.host || '';
      this._path = this._host + (options.path || '');

      var self = this;

      return $http.get(this._path + '/_index').then(

        function(res) {
          angular.forEach(res.data, function(config, key) {
            self._resources[key] = new crResource(key, config, self._host);
          });
          return self._resources;
        },
        function(res) {
          return $q.reject(makeError(res));
        }
      );
    };


    Resources.prototype.getIds = function(count) {

      count = count || 1;

      return $http.get(this._path + '/_uuids?count=' + count).then(
        function(res) {
          return res.data.uuids;
        },
        function(res) {
          return $q.reject(makeError(res));
        }
      );
    };


    Resources.prototype.resources = function() {
      return this._resources;
    };


    Resources.prototype.get = function(type) {

      var r = this._resources[type];
      if (!r) {
        throw new Error('Resource with type not found: ' + type);
      }
      return r;
    };


    return new Resources();
  });

})();

(function() {

  var module = angular.module('cores.services');

  
  function isObjectSchema(schema) {
    return schema.type === 'object' || schema.properties;
  }
  
  function isArraySchema(schema) {
    return schema.type === 'array' || schema.items;
  }

  function isRefSchema(schema) {
    return typeof schema.$ref === 'string';
  }
  

  function isPrivateProperty(key) {
    return key === '_id' || key === '_rev' || key === 'type_';
  }

  
  //
  // create a object with default values from schema
  //
  
  function createValue(schema, typeName) {

    var hasDefaultValue = schema.hasOwnProperty('default');
    var type = schema.type;
    
    if (schema.enum) {
      return hasDefaultValue ? schema.default : schema.enum[0];
    }
    if (schema.$ref) {
      return hasDefaultValue ? schema.default : {};
    }
    if (!type) {
      // infer object and array
      if (schema.properties) type = 'object';
      if (schema.items) type = 'array';
    }
    
    if (!type) throw new Error('Cannot create default value for schema without type');

    switch(type) {
    case 'boolean': return hasDefaultValue ? schema.default : true;
    case 'integer': return hasDefaultValue ? schema.default : 0;
    case 'number': return hasDefaultValue ? schema.default : 0;
    case 'string': return hasDefaultValue ? schema.default : '';
    case 'object':
      if (hasDefaultValue) return schema.default;
      
      var obj = {};
      angular.forEach(schema.properties, function(propSchema, name) {
        // ignore some vals
        if (isPrivateProperty(name)) return;
        obj[name] = createValue(propSchema);
      });
      if (typeName) {
        obj.type_ = typeName;
      }
      return obj;
    case 'array': return hasDefaultValue ? schema.default : [];
    default: throw new Error('Cannot create default value for unknown type: ' + type);
    }
  }

  //
  // schema utility methods
  //
  
  module.service('crSchema', function() {

    return {
      createValue: createValue,
      
      isObjectSchema: isObjectSchema,
      isArraySchema: isArraySchema,
      isRefSchema: isRefSchema,

      isPrivateProperty: isPrivateProperty
    };
  });

})();
(function() {

  var module = angular.module('cores.services');


  module.factory('crValidation', function() {

    return function(scope, watchExpr) {

      watchExpr = watchExpr || 'model';

      // clientside errors
      var errors = {};
      // serverside errors
      var customErrors = {};

      var constraints = [];


      scope.hasErrors = function() {
        return Object.keys(errors).length > 0 || Object.keys(customErrors).length > 0;
      };


      scope.hasError = function(name) {
        return !!(errors[name] || customErrors[name]);
      };


      scope.getFirstError = function() {
        for (var x in errors) {
          if (errors[x]) return errors[x];
        }
        for (var y in customErrors) {
          if (customErrors[y]) return customErrors[y];
        }
      };


      var setError = function(name, message) {
        errors[name] = message;
        scope.$emit('cr:set:error', scope.path + ':' + name);
      };


      var removeError = function(name) {
        if (errors.hasOwnProperty(name)) {
          delete errors[name];
          scope.$emit('cr:remove:error', scope.path + ':' + name);
        }
      };


      var setCustomError = function(name, message) {
        customErrors[name] = message;
        scope.$emit('cr:set:error', scope.path + ':' + name);
      };


      var removeCustomError = function(name) {
        if (customErrors.hasOwnProperty(name)) {
          delete customErrors[name];
          scope.$emit('cr:remove:error', scope.path + ':' + name);
        };
      };


      var clearCustomErrors = function() {
        angular.forEach(customErrors, function(error, name) {
          removeCustomError(name);
        });
      };


      var addConstraint = function(name, message, condition, isCustomConstraint) {
        // only check constraints that are defined in the schema
        if (!isCustomConstraint &&
            !scope.schema.hasOwnProperty(name)) return;

        constraints.push(function(value) {
          condition(value) ? removeError(name) : setError(name, message);
        });
      };


      scope.$on('cr:set:customError', function(e, path, code, message) {
        if (path === scope.path) {
          setCustomError(code, message);
          return true;
        }
      });


      scope.$watch(watchExpr, function(newValue, oldValue, scope) {
        constraints.forEach(function(c) {
          c(newValue);
        });
        clearCustomErrors();
      });


      return {
        setError: setError,
        removeError: removeError,
        addConstraint: addConstraint
      };
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crAnyofItem', function($compile, crCommon, crBuild) {
    return {
      require: '^crAnyofArray',
      scope: {
        model: '=',
        name: '@',
        path: '@',
        schemas: '=',
        options: '=?'
      },

      replace: true,
      templateUrl: 'cr-anyof-array-item.html',

      controller: 'crArrayItemCtrl',

      link: function(scope, elem, attrs, anyof) {

        // get the schema from the anyof-array
        scope.schema = anyof.getSchema(scope.model.type_);
        scope.array = anyof;

        var tmpl = crBuild.buildTemplate(scope.schema, scope.model, 'schema', 'model',
                                         scope.path, { indent: false });
        var link = $compile(tmpl);
        var e = link(scope);
        elem.find('.cr-item-body').html(e);
        elem.find('.dropdown-toggle').dropdown();
      }
    };
  });


  module.directive('crAnyofArray', function($compile, crCommon, crFieldLink) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-anyof-array.html',

      controller: 'crAnyofArrayCtrl',

      link: crFieldLink({ showLabel: true, indent: true }, function(scope, elem, attrs) {

        elem.find('.dropdown-toggle').dropdown();
      })
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crArrayItem', function($compile, crCommon, crBuild) {
    return {
      scope: {
        model: '=',
        schema: '=',
        path: '@',
        options: '=?'
      },

      replace: true,
      templateUrl: 'cr-array-item.html',

      controller: 'crArrayItemCtrl',

      link: function(scope, elem, attrs) {

        var tmpl = crBuild.buildTemplate(scope.schema, scope.model, 'schema', 'model', scope.path,
                                         { showLabel: false, indent: false });

        var link = $compile(tmpl);
        var e = link(scope);
        elem.find('.cr-item-body').html(e);
      }
    };
  });


  module.directive('crArray', function(crCommon, crSchema, crFieldLink) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-array.html',

      controller: 'crArrayCtrl',

      link: crFieldLink({ showLabel: true, indent: true }, function(scope, elem, attrs) {

        // ngrepeat can only bind to references when it comes to form fields
        // thats why we can only work with items of type object not primitives
        // this may change in a feature release
        if (!crSchema.isObjectSchema(scope.schema.items) &&
            !crSchema.isRefSchema(scope.schema.items)) {
          throw new Error('Array items schema is not of type object: ' + JSON.stringify(scope.schema.items));
        }
      })
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crBoolean', function() {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-boolean.html'
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crDatetime', function(crFieldLink, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-datetime.html',

      link: crFieldLink(function(scope, elem, attrs) {

        var validation = crValidation(scope);
        if (scope.options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return !!value && value !== '';
          }, true);
        }

        var date = new Date();
        if (!scope.model) {
          scope.model = date.toISOString();
        }

        // datepicker
        elem.find('.date').datetimepicker({
          maskInput: true,
          pickDate: true,
          pickTime: false
        })
          .datetimepicker('setValue', date)
          .on('changeDate', function(e) {
            e.stopPropagation();

            date.setFullYear(e.date.getFullYear());
            date.setMonth(e.date.getMonth());
            date.setDate(e.date.getDate());

            scope.model = date.toISOString();
            scope.$apply();
          });

        // timepicker
        elem.find('.time').datetimepicker({
          maskInput: true,
          pickDate: false,
          pickTime: true,
          pickSeconds: false
        })
          .datetimepicker('setValue', date)
          .on('changeDate', function(e) {
            e.stopPropagation();

            date.setHours(e.date.getHours());
            date.setMinutes(e.date.getMinutes());

            scope.model = date.toISOString();
            scope.$apply();
          });

      })
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crEnum', function(crFieldLink) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-enum.html',

      link: crFieldLink(function(scope, elem, attrs) {
      })
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crImage', function($compile, crCommon, crFieldLink, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-image.html',


      link: crFieldLink(function(scope, elem, attrs) {

        var validation = crValidation(scope, 'model.name');
        if (scope.options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return !!scope.model.name && scope.model.name !== '';
          }, true);
        }

        var fileId = crCommon.createFileId();

        var input = elem.find('input[type="file"]');
        var preview = elem.find('img');

        // preview when already saved
        scope.$watch('model.url', function(url) {
          preview.attr('src', url);
        });

        input.on('change', function(e) {

          var files = input[0].files;
          if (files.length === 0) {
            // no file selected
            return;
          }

          var file = files[0];

          // preview selected image
          var fr = new FileReader();
          fr.onload = function(e) {
            preview.attr('src', e.target.result);
          };
          fr.readAsDataURL(file);

          scope.model.name = file.name;

          // notify model about file
          scope.$emit('cr:file:set', fileId, file);
          scope.$apply();
        });
      })
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crMarkdown', function(crCommon, crFieldLink, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-markdown.html',

      link: crFieldLink({
        showLabel: true,
        showBorder: true
      }, function(scope, elem, attrs) {

        var validation = crValidation(scope);
        validation.addConstraint(
          'maxLength',
          'Text is longer than ' + scope.schema.maxLength,
          function(value) {
            return value.length <= scope.schema.maxLength;
          });

        validation.addConstraint(
          'minLength',
          'Text is shorter than ' + scope.schema.minLength,
          function(value) {
            return value.length >= scope.schema.minLength;
          });

        if (scope.options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return !!value && value !== '';
          }, true);
        }

        var $area = elem.find('.cr-editor-area');
        var $preview = elem.find('.cr-editor-preview');
        $area.autosize();

        scope.isPreview = false;
        scope.togglePreview = function() {
          scope.isPreview = !scope.isPreview;
          if (scope.isPreview) {
            $preview.html(markdown.toHTML($area.val()));
          }
          $area.toggle();
          $preview.toggle();
        };

        // manually trigger autosize on first model change
        var unwatch = scope.$watch('model', function(newValue, oldValue) {
          if (newValue) {
            unwatch();
            $area.trigger('autosize.resize');
          }
        });
      })
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crModelForm', function($compile, crBuild, crSchema, crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        valid: '=',
        debug: '='
      },

      replace: true,
      templateUrl: 'cr-model-form.html',

      controller: function($scope) {

        $scope.valid = true;
        $scope.errors = {};

        $scope.$on('cr:set:error', function(e, id) {
          e.stopPropagation();
          $scope.errors[id] = true;
          $scope.valid = false;
        });

        $scope.$on('cr:remove:error', function(e, id) {
          e.stopPropagation();
          delete $scope.errors[id];
          $scope.valid = Object.keys($scope.errors).length === 0;
        });
      },

      link: function(scope, elem) {

        var childScope;

        scope.$watch('model', function() {
          if (!scope.schema) return;
          scope.valid = true;
          scope.errors = {};

          if (!crSchema.isObjectSchema(scope.schema)) {
            throw new Error('Top level schema has to be an object');
          }

          // cleanup dom and scope
          if (childScope) {
            elem.find('form').empty();
            childScope.$destroy();
          }
          // create markup
          var tmpl = crBuild.buildTemplate(scope.schema, scope.model, 'schema', 'model',
                                           '', { showLabel: false, indent: false });

          // compile and link with new scope
          childScope = scope.$new();
          var link = $compile(tmpl);
          var content = link(childScope);
          elem.find('form').html(content);
        });
      }
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crModelListFilter', function() {
    return {
      scope: {
        views: '=',
        view: '='
      },

      replace: true,
      templateUrl: 'cr-model-list-filter.html',

      link: function(scope, elem, attrs) {

        var firstSelect = true;
        var defaultConfig = '';

        scope.defaultTitle = scope.view ? (scope.view.title || 'Default') : 'Default';

        scope.$watch('selectedView', function(newConfig, oldConfig) {
          if (firstSelect && newConfig) {
            // remeber default view config
            defaultConfig = scope.view;
            firstSelect = false;
          }
          if (!firstSelect) {
            scope.view = newConfig || defaultConfig;
          }
        });
      }
    };
  });


  module.directive('crModelList', function(crCommon, crResources, crSchema, crJSONPointer) {
    return {
      scope: {
        type: '@',
        view: '=?',
        limit: '=?',
        headers: '=?'
      },

      replace: true,
      templateUrl: 'cr-model-list.html',

      link: function(scope, elem, attrs) {

        var resource;
        var schema;

        function initScope() {
          scope.isLoading = false;
          scope.prevKeys = [];
          scope.curKey = null;
          scope.nextKey = null;
          scope.rows = [];
          scope.showPagination = false;
        }
        initScope();

        function load(startkey) {

          scope.isLoading = true;

          var limit = scope.limit || 20;
          var params = {
            include_docs: true,
            include_refs: true,
            // fetch one more and use the id as the startkey for the next page
            limit: limit + 1,
            startkey: startkey
          };

          var view = 'all';
          if (scope.view) {
            view = scope.view.name;
            for (var x in scope.view.params) {
              // only overwrite startkey on first load
              if (x === 'startkey' && params.startkey) {
                continue;
              }
              params[x] = scope.view.params[x];
            }
          }

          resource.view(view, params).then(function success(result) {
            if(result.total_rows === 0) return;

            // table rows values according to header
            scope.rows = result.rows.map(function(row) {
              return {
                id: row.id,
                items: scope.headers.map(function(path, i) {
                  return { value: crJSONPointer.get(row.doc, path) };
                })
              };
            });

            if (result.rows.length > 0) {
              scope.curKey = result.rows[0].key;
              scope.nextKey = null;

              if (result.rows.length > limit) {
                // there a more pages left, remember the last row's key and do not display it
                scope.nextKey = result.rows[limit].key;
                scope.rows.pop();
                scope.showPagination = true;
              }
            }
            scope.isLoading = false;

          }, function(err) {
            console.log('ERROR', err);
            throw err;
          });
        }

        scope.select = function(id) {
          scope.$emit('cr:list:select', id);
        };

        scope.next = function() {
          if (scope.nextKey) {
            scope.prevKeys.push(scope.curKey);
            load(scope.nextKey);
          }
        };

        scope.prev = function() {
          if (scope.prevKeys.length > 0) {
            load(scope.prevKeys.pop());
          }
        };

        scope.$on('cr:reload:list', function(e) {
          e.preventDefault();
          load();
        });

        var unwatch = scope.$watch('type', function() {
          unwatch();
          resource = crResources.get(scope.type);
          resource.schema().then(function(s) {
            schema = s;

            // auto generate headers when not set
            if (!scope.headers || scope.headers.length === 0) {
              scope.headers = Object.keys(schema.properties).filter(function(key) {
                return !crSchema.isPrivateProperty(key);
              });
            }
            // table column titles
            scope.titles = scope.headers.map(function(header) {
              return header.split('.')[0];
            });

            load();
          });
        });

        scope.$watch('view', function(newValue, oldValue) {
          if (newValue === oldValue) return;
          if (!resource) return;
          // reload list on view change
          initScope();
          load();
        });
      }
    };
  });



  module.directive('crModelListModal', function() {
    return {
      scope: {
        type: '@',
        modalId: '@',
        view: '=?'
      },

      replace: true,
      templateUrl: 'cr-model-list-modal.html',

      link: function(scope, elem, attrs) {

        if (!scope.view) {
          scope.view = {
            name: 'all'
          };
        }

        scope.$on('cr:list:select', function(e, id) {
          elem.modal('hide');
        });

        scope.$on('cr:showModal:list', function(e, modalId, reload) {

          if (modalId === scope.modalId) {
            e.preventDefault();
            elem.modal('show');
            if (reload) {
              scope.$broadcast('cr:reload:list');
            }
          }
        });
      }
    };
  });


})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crModelModal', function() {
    return {
      scope: {
        type: '@',
        path: '@',
        modalId: '@',
        defaults: '=?',
        options: '=?'
      },

      replace: true,
      templateUrl: 'cr-model-modal.html',

      controller: 'crModelCtrl',


      link: function(scope, elem, attrs) {

        scope.$on('cr:model:saved', function() {
          // close on save
          elem.modal('hide');
        });

        scope.$on('cr:showModal:model', function(e, modalId, modelId) {
          if (modalId === scope.modalId) {
            e.preventDefault();
            scope.modelId = modelId;
            elem.modal('show');
          }
        });
      }
    };
  });
})();

(function() {

  var module = angular.module('cores.directives');


  module.directive('crModel', function() {
    return {
      scope: {
        type: '@',
        path: '@',
        modelId: '=',
        defaults: '=?',
        options: '=?'
      },

      replace: true,
      templateUrl: 'cr-model.html',

      controller: 'crModelCtrl'
    };
  });
})();

(function() {

  var module = angular.module('cores.directives');


  module.directive('crMultiSelectRef', function(
    crFieldLink,
    crResources,
    crCommon,
    crJSONPointer
  ) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-multi-select-ref.html',

      link: crFieldLink(function(scope, elem, attrs) {

        scope.rows = [];

        // load docs
        var unwatch = scope.$watch('schema.items.$ref', function(newValue) {
          if (!scope.schema.items.$ref) return;
          unwatch();

          crResources.get(scope.schema.items.$ref).view(
            'all', { include_docs: true }
          ).then(function(result) {
            // create rows
            scope.rows = result.rows.map(function(row) {
              var r = {
                id: row.id,
                selected: false,
                name: crJSONPointer.get(row.doc, scope.options.previewPath)
              };
              return r;
            });
            // select rows when id is in model
            scope.model.forEach(function(ref) {
              scope.rows.forEach(function(row) {
                if (row.id == ref.id_) { row.selected = true; }
              });
            });
          });
        });

        // watch for selection changes
        scope.$watch('rows', function(newValue, oldValue) {
          if (!newValue || (newValue && newValue.length === 0)) return;
          // sync selected rows with model
          scope.model = scope.rows.filter(function(row) {
            return row.selected;
          }).map(function(row) {
            return { id_: row.id };
          });
        }, true);
      })
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crNumber', function(crFieldLink, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-number.html',

      link: crFieldLink(function(scope, elem, attrs) {

        var validation = crValidation(scope);

        if (scope.options.isInteger) {
          validation.addConstraint(
            'integer',
            'Value is not an integer',
            function(value) {
              return Math.floor(value) === value;
            }, true);
        }
        else {
          elem.find('input[type="number"]').attr('step', 'any');
        }

        validation.addConstraint(
          'multipleOf',
          'Value is not a multiple of ' + scope.schema.multipleOf,
          function(value) {
            return (value % scope.schema.multipleOf) === 0;
          });

        validation.addConstraint(
          'minimum',
          'Value is less than ' + scope.schema.minimum,
          function(value) {
            return value >= scope.schema.minimum;
          });

        validation.addConstraint(
          'maximum',
          'Value is greater than ' + scope.schema.maximum,
          function(value) {
            return value <= scope.schema.maximum;
          });


        if (scope.options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return angular.isNumber(value);
          }, true);
        }
      })
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crObject', function(
    $compile,
    crBuild,
    crOptions,
    crCommon,
    crSchema
  ) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      templateUrl: 'cr-object.html',

      link: function(scope, elem, attrs) {
        var defaults = {
          showLabel: true,
          indent: true
        };
        scope.options = crCommon.merge(defaults, crOptions.parse(attrs.options));

        var isRequired = function (name) {
          var req = scope.schema.required || [];
          return req.indexOf(name) !== -1;
        };

        var tmpl = '';
        angular.forEach(scope.schema.properties, function(subSchema, key) {

          // ignore some keys
          if (crSchema.isPrivateProperty(key)) return;

          if (!scope.model.hasOwnProperty(key)) {
            scope.model[key] = crSchema.createValue(subSchema);
          }

          tmpl += crBuild.buildTemplate(subSchema, scope.model[key],
                                        'schema.properties.' + key, 'model.' + key,
                                        (scope.path ? scope.path : '')  + '/' + key,
                                        { isRequired: isRequired(key) });
        });
        // compile and link template
        var link = $compile(tmpl);
        var content = link(scope);
        elem.find('.properties').append(content);
      }
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');

  module.directive('crPassword', function(crFieldLink, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-password.html',

      link: crFieldLink(function(scope, elem, attrs) {

        var validation = crValidation(scope);

        validation.addConstraint(
          'maxLength',
          'Password is longer than ' + scope.schema.maxLength,
          function(value) {
            return value.length <= scope.schema.maxLength;
          });

        validation.addConstraint(
          'minLength',
          'Password is shorter than ' + scope.schema.minLength,
          function(value) {
            return value.length >= scope.schema.minLength;
          });

        if (scope.options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return value && value !== '';
          }, true);
        }

        scope.pass1 = '';
        scope.pass2 = '';
        var oldPass = scope.model;

        var compareValue = function(v1, v2) {
          // only set model when passwords are equal and not empty
          if (v1 === v2) {
            if (v1 !== '') {
              scope.model = v1;
            }
            else {
              scope.model = oldPass;
            }
            validation.removeError('match');
          }
          else {
            scope.model = oldPass;
            validation.setError('match', 'Passwords do not match');
          }
        };

        scope.$watch('pass1', function(newValue) {
          compareValue(newValue, scope.pass2);
        });

        scope.$watch('pass2', function(newValue) {
          compareValue(newValue, scope.pass1);
        });
      })
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crReadonly', function(crFieldLink) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-readonly.html',

      link: crFieldLink(function(scope, elem, attrs) {
      })
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crRef', function(
    $compile,
    $timeout,
    crCommon,
    crFieldLink,
    crValidation
  ) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-ref.html',

      controller: function($scope) {

        $scope.$on('cr:model:saved', function(e, model) {
          e.stopPropagation();
          $scope.model.id_ = model._id;
          $scope.$broadcast('cr:update:preview');
        });

        $scope.$on('cr:list:select', function(e, id) {
          e.stopPropagation();
          $scope.model.id_ = id;
          $scope.$broadcast('cr:update:preview');
        });
      },


      link: crFieldLink({
        showLabel: true, preview: 'cr-ref-preview'
      }, function(scope, elem, attrs) {

        scope.editModalId = crCommon.createModalId();
        scope.selectModalId = crCommon.createModalId();

        // scope methods
        scope.newModel = function() {
          scope.$broadcast('cr:showModal:model', scope.editModalId, null);
        };

        scope.updateModel = function() {
          scope.$broadcast('cr:showModal:model', scope.editModalId, scope.model.id_);
        };

        scope.selectModel = function() {
          scope.$broadcast('cr:showModal:list', scope.selectModalId, true);
        };

        scope.hasModel = function() {
          return !!scope.model.id_;
        };

        // validation
        var validation = crValidation(scope, 'model.id_');
        if (scope.options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return !!scope.model.id_;
          }, true);
        }

        // create preview
        var tmpl = '<div ' + scope.options.preview +
              ' type="{{schema.$ref}}"' +
              ' id="model.id_"' +
              ' options="options">' +
              '</div>';

        var link = $compile(tmpl);
        var content = link(scope);
        elem.find('.cr-preview').html(content);
      })
    };
  });




  var previewLink = function(crResources) {
    return function(scope, elem, attrs) {

      var update = function(id) {
        if (id) {
          crResources.get(scope.type).load(id).then(function(doc) {
            scope.model = doc;
          });
        }
      };

      scope.$watch('id', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          update(newValue);
        }
      });

      scope.$on('cr:update:preview', function(e) {
        update(scope.id);
      });
      update(scope.id);
    };
  };


  module.directive('crRefPreview', function(crResources) {
    return {
      scope: {
        type: '@',
        id: '=',
        options: '='
      },

      replace: true,
      templateUrl: 'cr-ref-preview.html',

      link: previewLink(crResources)
    };
  });


  module.directive('crImagePreview', function(crResources) {
    return {
      scope: {
        type: '@',
        id: '=',
        options: '='
      },

      replace: true,
      templateUrl: 'cr-image-preview.html',

      link: previewLink(crResources)
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crSingleSelectRef', function(
    crFieldLink,
    crValidation,
    crResources,
    crCommon,
    crJSONPointer
  ) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-single-select-ref.html',

      link: crFieldLink(function(scope, elem, attrs) {

        scope.rows = [];

        // validation
        var validation = crValidation(scope, 'model.id_');
        if (scope.options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return !!scope.model.id_;
          }, true);
        }

        // load docs
        var unwatch = scope.$watch('schema.$ref', function() {
          if (!scope.schema.$ref) return;
          unwatch();

          crResources.get(scope.schema.$ref).view('all', { include_docs: true }).then(function(result) {

            scope.rows = result.rows.map(function(row) {
              var r = {
                id: row.id,
                name: crJSONPointer.get(row.doc, scope.options.previewPath)
              };
              if (scope.model.id_ && r.id === scope.model.id_) {
                scope.selectedRow = r;
              }
              return r;
            });
          });
        });

        // watch for selection changes
        scope.$watch('selectedRow', function(newValue, oldValue) {
          if (newValue === oldValue) return;
          if (!newValue) {
            delete scope.model.id_;
          }
          else {
            scope.model.id_ = newValue.id;
          }
        });
      })
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crSlug', function(crCommon, crFieldLink, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-slug.html',

      link: crFieldLink(function(scope, elem, attrs) {

        var validation = crValidation(scope);

        validation.addConstraint(
          'maxLength',
          'Slug is longer than ' + scope.schema.maxLength,
          function(value) {
            return value.length <= scope.schema.maxLength;
          });

        validation.addConstraint(
          'minLength',
          'Slug is shorter than ' + scope.schema.minLength,
          function(value) {
            return value.length >= scope.schema.minLength;
          });

        validation.addConstraint(
          'pattern',
          'Slug does not match the pattern',
          function(value) {
            return new RegExp(scope.schema.pattern).test(value);
          });

        if (scope.options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return !!value && value !== '';
          }, true);
        }


        scope.generate = function() {
          var sources = [];
          var val = '';

          // allow single string or array of strings for source option
          if (typeof scope.options.source === 'string') {
            sources = [scope.options.source];
          }
          else if (angular.isArray(scope.options.source)) {
            sources = scope.options.source;
          }

          angular.forEach(sources, function(src) {
            val += (val !== '' ? '-' : '') + scope.$parent.model[src];
          });
          scope.model = crCommon.slugify(val);
        };
      })
    };
  });

})();

(function() {

  var module = angular.module('cores.directives');

  module.directive('crString', function(crFieldLink, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-string.html',

      link: crFieldLink(function(scope, elem, attrs) {

        var validation = crValidation(scope);

        validation.addConstraint(
          'maxLength',
          'Text is longer than ' + scope.schema.maxLength,
          function(value) {
            return value.length <= scope.schema.maxLength;
          });

        validation.addConstraint(
          'minLength',
          'Text is shorter than ' + scope.schema.minLength,
          function(value) {
            return value.length >= scope.schema.minLength;
          });

        validation.addConstraint(
          'pattern',
          'Text does not match the pattern',
          function(value) {
            return new RegExp(scope.schema.pattern).test(value);
          });

        if (scope.options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return !!value && value !== '';
          }, true);
        }
      })
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crTabObject', function(
    $compile,
    crBuild,
    crOptions,
    crCommon,
    crSchema
  ) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      templateUrl: 'cr-tab-object.html',

      link: function(scope, elem, attrs) {
        var defaults = {
          showLabel: true,
          indent: false
        };
        scope.options = crCommon.merge(defaults, crOptions.parse(attrs.options));

        var objId = crCommon.createObjectId();

        var isRequired = function (name) {
          var req = scope.schema.required || [];
          return req.indexOf(name) !== -1;
        };

        var navTmpl = '<ul class="nav nav-tabs">';
        var contentTmpl = '<div class="tab-content">';
        var isFirst = true;
        angular.forEach(scope.schema.properties, function(subSchema, key) {

          // ignore some keys
          if (crSchema.isPrivateProperty(key)) return;

          if (!scope.model.hasOwnProperty(key)) {
            scope.model[key] = crSchema.createValue(subSchema);
          }
          var id = key + '-' + objId;

          navTmpl += '<li' + (isFirst ? ' class="active"' : '') + '>' +
            '<a href="#' + id + '">' + crBuild.getModelTitle(subSchema, key) + '</a></li>';

          contentTmpl += '<div' +
            ' ng-class="{ \'cr-indent\': options.indent }"' +
            ' class="tab-pane' + (isFirst ? ' active' : '') + '"' +
            ' id="' + id + '">';

          contentTmpl += crBuild.buildTemplate(subSchema, scope.model[key],
                                               'schema.properties.' + key, 'model.' + key,
                                               (scope.path ? scope.path : '')  + '/' + key,
                                               { isRequired: isRequired(key), showLabel: false });
          contentTmpl += '</div>';
          isFirst = false;
        });
        navTmpl += '</ul>';
        contentTmpl += '</div>';

        // compile and link template
        var link = $compile(navTmpl + contentTmpl);
        var content = link(scope);
        elem.find('.properties').append(content);

        elem.find('.nav-tabs a').on('click', function(e) {
          e.preventDefault();
          $(this).tab('show');
        });
      }
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crText', function(crCommon, crFieldLink, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-text.html',

      link: crFieldLink(function(scope, elem, attrs) {

        var validation = crValidation(scope);

        validation.addConstraint(
          'maxLength',
          'Text is longer than ' + scope.schema.maxLength,
          function(value) {
            return value.length <= scope.schema.maxLength;
          });

        validation.addConstraint(
          'minLength',
          'Text is shorter than ' + scope.schema.minLength,
          function(value) {
            return value.length >= scope.schema.minLength;
          });

        validation.addConstraint(
          'pattern',
          'Text does not match the pattern',
          function(value) {
            return new RegExp(scope.schema.pattern).test(value);
          });

        if (scope.options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return !!value && value !== '';
          }, true);
        }
      })
    };
  });

})();