(function() {

  var NS = 'cr';
  var module = angular.module('cores.services', ['ng']);

  
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
        obj.type_ = typeName;
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
      return '<div ' + NS + '-enum name="' + getModelName(schema, modelPath) + '" schema="' + schemaPath + '" model="' + modelPath + '"/>';
  }


  //
  // build a anyOf html template
  //
  
  function buildAnyOfTemplate(schema, model, schemaPath, modelPath, options) {
    if (!angular.isObject(model) || !model._type) {
      throw new Error('AnyOf model does not have a type property: ' + JSON.stringify(model));
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
    return '<div ' + NS + '-' + schema.view + ' name="' + getModelName(schema, modelPath) + '" schema="' + schemaPath + '" model="' + modelPath + '"/>';
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
      type = 'anyof-array';
    }
    
    var name = getModelName(schema, modelPath);

    return '<div ' + NS + '-' + type + ' name="' + name + '" schema="' + schemaPath + '" model="' + modelPath + '"/>';
  }

  
  //
  // build a template for a schema/model combination
  //
  
  function buildTemplate(schema, model, schemaPath, modelPath, options) {

    // default values for paths
    schemaPath = schemaPath || 'schema';
    modelPath = modelPath || 'model';

    var args = [schema, model, schemaPath, modelPath];
    
    // infer type
    if (!schema.type) {
      if (schema.properties) schema.type = 'object';
      if (schema.items) schema.type = 'array';
    }

    if (schema.enum) {
      return buildEnumTemplate.apply(null, args);
    }
    else if (schema.oneOf) {
      throw new Error('oneOf not implemented');
    }
    else if (schema.allOf) {
      throw new Error('allOf not implemented');
    }
    else if (schema.anyOf) {
      return buildAnyOfTemplate.apply(null, args);
    }
    else if (schema.view) {
      return buildViewTemplate.apply(null, args);
    }
    else if (schema.type) {
      return buildTypeTemplate.apply(null, args);
    }
    else if (schema.$ref) {
      throw new Error('$ref not implemented');
    }
    throw new Error('Unkown schema: ' + schemaPath + ': ' + JSON.stringify(schema));
  }
  

  
  //
  // create the service module
  //
  
  // var module = angular.module('cores.services', ['ng']);
  
  module.service('cores', function($http, $q, $rootScope) {

    //
    // Create error object from response
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

      if (response.errors) {
        err.errors = response.errors;
      }
      return err;
    };

    
    //
    // Resource class
    //

    var Resource = function(config, options) {

      // add config to this
      angular.extend(
        this,
        { path: '', schemaPath: '', viewPaths: {} },
        config
      );

      // add options to this
      angular.extend(
        this,
        { host: '' },
        options
      );
    };


    //
    // Get a resource schema
    //
    
    Resource.prototype.schema = function() {

      var def = $q.defer();

      $http.get(this.host + this.schemaPath).then(
        function(res) { def.resolve(res.data); },
        function(res) { def.reject(makeError(res)); }
      );
      return def.promise;
    };

    
    //
    // Load a resource from the server
    //
    
    Resource.prototype.load = function(id) {

      var path = this.host + this.path;
      if (id) {
        path += '/' + id;
      }
      var def = $q.defer();

      $http.get(path).then(
        function(res) { def.resolve(res.data); },
        function(res) { def.reject(makeError(res)); }
      );
      return def.promise;
    };

    
    //
    // Save/update a resource on the server
    //
    
    Resource.prototype.save = function(doc) {

      var def = $q.defer();

      if (doc._id && doc._rev) {

        // update
        
        $http.put(this.host + this.path + '/' + doc._id + '/' + doc._rev, doc).then(
          function(res) { def.resolve(res.data); },
          function(res) { def.reject(makeError(res)); }
        );
      }
      else {

        // create

        if (doc instanceof FormData) {

          // send formdata multipart with a xhr for now, $http seems to have problems with it
          var xhr = new XMLHttpRequest();

          xhr.addEventListener('load', function() {

            var data = typeof xhr.response === 'string' ? JSON.parse(xhr.response) : xhr.response;

            if (xhr.status === 200) {
              // success
              def.resolve(data);
            }
            else {
              // error
              def.reject(makeError(data));
            }
            // call apply, because we are outside the angular life-cycle
            $rootScope.$apply();
          });
          
          xhr.open('POST', this.host + this.path);
          xhr.send(doc);
        }
        else {
          $http.post(this.host + this.path, doc).then(
            function(res) { def.resolve(res.data); },
            function(res) { def.reject(makeError(res.data)); }
          );
        }
      }
      return def.promise;
    };


    //
    // Delete a resource on the server
    //
    
    Resource.prototype.destroy = function(doc) {

      var def = $q.defer();
      $http.delete(this.host + this.path + '/' + doc._id + '/' + doc._rev).then(
        function(res) { def.resolve(); },
        function(res) { def.reject(makeError(res)); }
      );
      return def.promise;
    };


    //
    // Call a couchdb view
    //
    
    Resource.prototype.view = function(name, params) {

      var path = this.viewPaths[name];
      if (!path) {
        throw new Error('No view with name found: ' + name);
      }
      path = this.host + path;

      var config = {
        params: params || {}
      };

      var def = $q.defer();
      $http.get(path, config).then(
        function(res) { def.resolve(res.data); },
        function(res) { def.reject(makeError(res)); }
      );
      return def.promise;
    };


    
    
    //
    // loads model config(urls) and create resources from it
    //
    
    var resources = {};

    function loadIndex(host) {

      host = host || '';
      
      var def = $q.defer();

      $http.get(host + '/_index').then(
        function(res) {
          angular.forEach(res.data, function(value, key) {
            resources[key] = new Resource(value, { host: host });
          });
          def.resolve();
        },
        
        function(res) {
          def.reject(makeError(res));
        }
      );
      return def.promise;
    }


    //
    // get a Resource object
    //
    
    function getResource(type) {

      var r = resources[type];
      if (!r) {
        throw new Error('Resource with type not found: ' + type);
      }
      return r;
    }


    //
    // public
    //
    
    return {
      initialize: loadIndex,
      getResource: getResource,
      createModel: createDefaultModel,
      buildTemplate: buildTemplate
    };
  });

})();