(function() {

  function createDefaultModel(schema, typeName) {
    if (schema.enum) {
      return schema.enum[0];
    }
    // if (schema.anyOf ) {
    //   // TODO...
    //   return '';
    // }
    
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
        obj[name] = createDefaultModel(propSchema);
      });
      if (typeName) {
        obj._type = typeName;
      }
      return obj;
    case 'array': return [];
    default: throw new Error('Cannot create default value for unknown type: ' + schema.type);
    }
  }


  function getModelName(schema, modelPath) {
    // use schema name if it exists
    if (schema.name) return schema.name;

    // otherwise use name from model path
    var elems = modelPath.split('.');
    return elems[elems.length - 1];
  }


  function buildEnumTemplate(schema, model, schemaPath, modelPath, options) {
      return '<enum name="' + getModelName(schema, modelPath) + '" schema="' + schemaPath + '" model="' + modelPath + '"/>';
  }

  
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

  
  function buildViewTemplate(schema, model, schemaPath, modelPath, options) {
    return '<div cm-' + schema.view + ' name="' + getModelName(schema, modelPath) + '" schema="' + schemaPath + '" model="' + modelPath + '"/>';
  }

  
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
  


  angular.module('comodl.services', ['ng'])
    .service('builder', function() {
      return {
        build: buildTemplate,
        createModel: createDefaultModel
      };
    })
  ;
  
  
  // var layouts = <%= layouts %>;
  // var basePath = '<%= host %>';
  

  // function createService($http) {


  //   function load(type, id, callback) {
  //     var layout = layouts[type];
  //     $http({ method: 'GET', url: basePath + layout.path + '/' + id })
  //       .success(function(res) { callback(null, res); })
  //       .error(function(res) { callback(res); })
  //     ;
  //   }

    
  //   function save(doc, callback) {
  //     if (!doc.type) return callback(new Error('Doc has no type property'));
  //     var layout = layouts[doc.type];

  //     if (doc._id) {
  //       $http({ method: 'PUT',
  //               url: basePath + layout.path + '/' + doc._id + '?rev=' + doc._rev,
  //               data: doc })
  //         .success(function(res) { callback(null, res); })
  //         .error(function(res) { callback(res); })
  //       ;
  //     }
  //     else {
  //       $http({ method: 'POST',
  //               url: basePath + layout.path,
  //               data: doc })
  //         .success(function(res) { callback(null, res); })
  //         .error(function(res) { callback(res); })
  //       ;
  //     }
  //   }

    
  //   function destroy(doc, callback) {
  //     if (!doc.type) return callback(new Error('Doc is missing type property'));
  //     if (!doc._id)  return callback(new Error('Doc is missing no _id property'));
  //     if (!doc._rev) return callback(new Error('Doc is missing _rev property'));
      
  //     var layout = layouts[doc.type];
  //     $http({ method: 'DELETE', url: basePath + layout.path + '/' + doc._id + '?rev=' + doc._rev })
  //       .success(function(res) { callback(null, res); })
  //       .error(function(res) { callback(res); })
  //     ;
  //   }

    
  //   function view(type, name, callback) {
  //     var layout = layouts[type];

  //     if (!layout.viewPaths[name]) return callback(new Error('View does not exist: ' + name));

  //     $http({ method: 'GET', url: basePath + layout.viewPaths[name] })
  //       .success(function(res) { callback(null, res); })
  //       .error(function(res) { callback(res); })
  //     ;
  //   }

    
  //   function schema(type) {
  //     return layouts[type].schema;
  //   }

    
  //   return {
  //     load: load,
  //     save: save,
  //     destroy: destroy,
  //     view: view,
  //     schema: schema
  //   };
  // }
  
  // angular.module('comodl.services', [])
  //   .service('comodl', function($http) {
  //     return createService($http);
  //   })
  // ;

})();