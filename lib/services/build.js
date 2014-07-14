(function() {

  var module = angular.module('cores.services');


  module.factory('crBuild', function($compile, crCommon, crViews, crSchema, crJSONPointer) {

    function getDefaultType(schema) {
      var type = schema.type;

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

      // add namespace prefix for default views
      type = 'cr-' + type;
      return type;
    }


    function getLabel(schema, path) {
      var label = schema.type;

      if (schema.title) {
        label = schema.title;
      }
      else if (schema.name) {
        label = crCommon.capitalize(schema.name);
      }
      else if (path) {
        var parts = path.split('.');
        label = crCommon.capitalize(parts[parts.length - 1]);
      }

      if (schema.hasOwnProperty('view') && angular.isObject(schema.view)) {
        label = schema.view.name || label;
      }
      return label;
    }


    function buildControl(scope, schemaPath, modelPath, absPath, required) {
      var tmpl = '<div cr-control'
            + ' model="' + (modelPath || 'model') + '"'
            + ' schema="' + (schemaPath || 'schema') + '"'
            + ' path="' + (absPath || '') + '"';
      if (required) {
        tmpl += ' required';
      }
      tmpl += '></div>';
      return $compile(tmpl)(scope);
    }


    function buildType(scope, schema) {
      var type = getDefaultType(schema);
      scope.options = scope.options || {};

      if (schema.view) {
        if (typeof schema.view === 'string') {
          // get view config
          schema.view = crViews.get(schema.view);
        }
        type = schema.view.type || type;

        // merge options from view
        scope.options = angular.extend({
          showLabel: true
        }, scope.schema.view);
      }

      var tmpl = '<div ' + type + '></div>';
      return $compile(tmpl)(scope);
    }


    function buildProperties(scope, schema, model, path) {

      function isRequired(name) {
        var req = schema.required || [];
        return req.indexOf(name) !== -1;
      };

      return Object.keys(schema.properties).filter(function(key) {
        // ignore some keys
        return !crSchema.isPrivateProperty(key);

      }).map(function(key) {
        // create a control for each object property
        var subSchema = schema.properties[key];
        var absPath = (path ? path + '.' : '') + key;

        if (!model.hasOwnProperty(key)) {
          model[key] = crSchema.createValue(subSchema);
        }
        return {
          schema: subSchema,
          path: absPath,
          elem:  buildControl(scope,
                              'schema.properties.' + key,
                              'model.' + key,
                              absPath,
                              isRequired(key))
        };
      });
    }


    return {
      getLabel: getLabel,

      buildControl: buildControl,
      buildType: buildType,
      buildProperties: buildProperties
    };
  });

})();
