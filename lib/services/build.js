(function() {

  var module = angular.module('cores.services');


  module.factory('crBuild', function($compile, crCommon, crOptions, crSchema, crJSONPointer) {

    //
    // get the label from the schema or alternativly from the path
    //
    function getModelLabel(schema, path) {

      if (schema.title) {
        return schema.title;
      }
      if (schema.name) {
        return crCommon.capitalize(schema.name);
      }
      var parts = path.split('/');
      return crCommon.capitalize(parts[parts.length - 1]);
    }


    //
    // Create a template for a schema with optional view configuration
    //
    function buildControl(scope, schema, absPath, options) {

      options = options || {};
      var modelPath = crJSONPointer.toObjectNotation(absPath);
      var type = schema.type;
      var label = getModelLabel(schema, absPath);

      // infer some types
      if (!schema.type) {
        if (schema.properties) type = 'object';
        if (schema.items) type = 'array';
      }

      // handle extended types
      if (schema.hasOwnProperty('enum')) {
        type = 'enum';
      }
      else if (schema.hasOwnProperty('$ref')) {
        type = 'ref';
      }
      else if (type === 'array' &&
               schema.hasOwnProperty('items') &&
               schema.items.anyOf) {
        type = 'anyof-array';
      }

      // use number directive for integers
      if (type === 'integer') {
        type = 'number';
        options.isInteger = true;
      }

      // add namespace prefix for default views
      type = 'cr-' + type;

      if (schema.hasOwnProperty('view')) {
        // custom view type and options
        if (angular.isObject(schema.view)) {
          type = schema.view.type || type;
          label = schema.view.name || label;

          // add specific view properties as options
          angular.forEach(schema.view, function(value, key) {
            if (key !== 'type' && key !== 'name') {
              options[key] = value;
            }
          });
        }
        else if (angular.isString(schema.view)) {
          type = schema.view;
        }
        else throw new Error('View has to be of type object or string');
      }

      var childScope = scope.$new();
      childScope.options = options;
      childScope.schema = schema;
      childScope.label = label;
      childScope.path = absPath;

      var tmpl = '<div cr-control ' + type + ' ng-model="' + modelPath + '"';
      if (options.required) {
        tmpl += ' ng-required="true"';
      }
      tmpl += '/>';

      var link = $compile(tmpl);
      var elem = link(childScope);
      return elem;
    }


    function buildObject(scope, schema, model) {

      function isRequired(name) {
        var req = schema.required || [];
        return req.indexOf(name) !== -1;
      };

      return Object.keys(schema.properties).filter(function(key) {
        // ignore some keys
        return !crSchema.isPrivateProperty(key);

      }).map(function(key) {
        // compile a control for each object property
        var subSchema = schema.properties[key];

        if (!model.hasOwnProperty(key)) {
          model[key] = crSchema.createValue(subSchema);
        }

        var absPath = (scope.path ? scope.path : '') + '/' + key;
        var options = { required: isRequired(key) };

        return buildControl(scope, subSchema, absPath, options);
      });
    }


    return {
      buildControl: buildControl,
      buildObject: buildObject
    };
  });

})();