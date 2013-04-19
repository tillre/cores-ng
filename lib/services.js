(function() {

  //
  // create a object with default values from schema
  //
  
  function createDefaultModel(schema, typeName) {
    if (schema.enum) {
      return schema.enum[0];
    }
    
    // infer object and array
    if (!schema.type) {
      if (schema.properties) schema.type = 'object';
      if (schema.items) schema.type = 'array';
    }
    
    if (!schema.type) throw new Error('Cannot create default value for schema without type');

    switch(schema.type) {
    case 'boolean': return true;
    case 'integer': return 0;
    case 'number': return 0;
    case 'string': return '';
    case 'object':
      var obj = {};
      angular.forEach(schema.properties, function(propSchema, name) {
        // ignore some vals
        if (name === '_id' || name === '_rev' || name === 'type_') return;
        obj[name] = createDefaultModel(propSchema);
      });
      if (typeName) {
        obj.type = typeName;
      }
      return obj;
    case 'array': return [];
    default: throw new Error('Cannot create default value for unknown type: ' + schema.type);
    }
  }


  //
  // get the name from the schema or alternativly from the path
  //
  
  function getModelName(schema, modelPath) {
    // use schema name if it exists
    if (schema.name) return schema.name;

    // otherwise use name from model path
    var elems = modelPath.split('.');
    return elems[elems.length - 1];
  }


  //
  // build a enum html template
  //
  
  function buildEnumTemplate(schema, model, schemaPath, modelPath, options) {
      return '<enum name="' + getModelName(schema, modelPath) + '" schema="' + schemaPath + '" model="' + modelPath + '"/>';
  }


  //
  // build a anyOf html template
  //
  
  function buildAnyOfTemplate(schema, model, schemaPath, modelPath, options) {
    if (!angular.isObject(model) || !model._type) {
      throw new Error('AnyOf only works with models who have a type property');
    }
    // find subschema
    var index = -1;
    angular.forEach(schema.anyOf, function(ss, i) {
      if (ss.name === model._type) {
        return index = i;
      }
    });

    if (index === -1) {
      throw new Error('No anyOf schema with type found: ' + model._type);
    }

    var subSchema = schema.anyOf[index];

    return buildTemplate(subSchema, model,
                         schemaPath + '.anyOf[' + index + ']', modelPath,
                         options);
  }

  
  //
  // build a template for a view
  //
  
  function buildViewTemplate(schema, model, schemaPath, modelPath, options) {
    return '<div cm-' + schema.view + ' name="' + getModelName(schema, modelPath) + '" schema="' + schemaPath + '" model="' + modelPath + '"/>';
  }


  //
  // build a template for a type
  //
  
  function buildTypeTemplate(schema, model, schemaPath, modelPath, options) {
    if (angular.isArray(schema.type)) {
      throw new Error('Union types are not supported');
    }
    var type = schema.type;
    if (type === 'array' && schema.items && schema.items.anyOf) {
      console.log('++ anyof array ++');
      type = 'anyof-array';
    }
    
    var name = getModelName(schema, modelPath);
    
    return '<div cm-' + type + ' name="' + name + '" schema="' + schemaPath + '" model="' + modelPath + '"/>';
  }

  
  //
  // build a template for a schema/model combination
  //
  
  function buildTemplate(schema, model, schemaPath, modelPath, options) {
    // infer type
    if (!schema.type) {
      if (schema.properties) schema.type = 'object';
      if (schema.items) schema.type = 'array';
    }

    if (schema.enum) {
      return buildEnumTemplate.apply(null, arguments);
    }
    else if (schema.oneOf) {
      throw new Error('oneOf not implemented');
    }
    else if (schema.allOf) {
      throw new Error('allOf not implemented');
    }
    else if (schema.anyOf) {
      return buildAnyOfTemplate.apply(null, arguments);
    }
    else if (schema.view) {
      return buildViewTemplate.apply(null, arguments);
    }
    else if (schema.type) {
      return buildTypeTemplate.apply(null, arguments);
    }
    else if (schema.$ref) {
      throw new Error('$ref not implemented');
    }
    throw new Error('Unkown schema: ' + schemaPath);
  }
  

  
  //
  // create the service module
  //
  
  var module = angular.module('comodl.services', ['ng']);
  
  module.service('comodl', function($http, $q) {

    //
    // Resource class
    //

    var Resource = function(config) {
      angular.extend(this, config);
    };

    
    Resource.prototype.schema = function() {
      var def = $q.defer();
      $http.get(this.schemaPath).then(
        function(res) { def.resolve(res.data); },
        function(res) { def.reject(res.data); }
      );
      return def.promise;
    };

    
    Resource.prototype.load = function(id) {
      var def = $q.defer();
      $http.get(this.path).then(
        function(res) { def.resolve(res.data); },
        function(res) { def.reject(res.data); }
      );
      return def.promise;
    };

    
    Resource.prototype.save = function(doc) {
      var def = $q.defer();
      $http.post(this.path, doc).then(
        function(res) { def.resolve(res.data); },
        function(res) { def.reject(res.data); }
      );
      return def.promise;
    };

    
    Resource.prototype.destroy = function(doc) {
      var def = $q.defer();
      $http.delete(this.path + '/' + doc._id + '?rev=' + doc._rev).then(
        function(res) { def.resolve(); },
        function(res) { def.reject(res.data); }
      );
      return def.promise;
    };

    
    Resource.prototype.view = function(name) {
      var path = this.viewsPaths[name];
      if (!path) {
        throw new Error('No view with name found: ' + name);
      }

      var def = $q.defer();
      $http.get(path).then(
        function(res) { def.resolve(res.data); },
        function(res) { def.reject(res.data); }
      );
      return def.promise;
    };

    
    //
    // loads model config(urls) and create resources from it
    //
    
    var resources = {};

    function loadIndex() {
      var def = $q.defer();

      $http.get('/_index').then(
        function(res) {
          console.log('index', res.data);
          angular.forEach(res.data, function(value, key) {
            resources[key] = new Resource(value);
          });
          def.resolve();
        },

        function(res) {
          def.reject(res.data);
        }
      );
      return def.promise;
    }

    return {
      initialize: loadIndex,
      buildTemplate: buildTemplate,
      createModel: createDefaultModel,

      resources: resources
    };
  });

})();