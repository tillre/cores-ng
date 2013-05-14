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
    var name = schema.name || '';

    // otherwise use name from model path
    if (!name) {
      var items = modelPath.split('.');
      name = items[items.length - 1];
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    return name;
  }


  //
  // build the html element for the type
  //
  
  function buildElement(type, schemaPath, modelPath, name, options) {
    var e = '<div' +
          ' ' + NS + '-' + type +
          ' schema="' + schemaPath + '"' +
          ' model="' + modelPath + '"' +
          ' name="' + name + '"';

    angular.forEach(options, function(value, key) {
      e += ' ' + key + '="' + value + '"';
    });
    
    e += '/>';

    return e;
  }
  

  //
  // Create a template for a schema with optional view configuration
  // 
  
  function buildTemplate(schema, model, schemaPath, modelPath, options) {

    schemaPath = schemaPath || 'schema';
    modelPath = modelPath || 'model';
    options = options || {};
    
    // infer type
    if (!schema.type) {
      if (schema.properties) schema.type = 'object';
      if (schema.items) schema.type = 'array';
    }

    if (!angular.isString(schema.type)) {
      throw new Error('Only single types are supported');
    }

    var viewType = schema.type;
    var viewName = getModelName(schema, modelPath);

    // handle extended types
    
    if (schema.enum) {
      viewType = 'enum';
    }
    if (viewType === 'array' && schema.items.anyOf) {
      viewType = 'anyof-array';
    }

    if (schema.view) {

      // view can be a string or object with additional options
      
      if (angular.isObject(schema.view)) {
        viewType = schema.view.type;
        viewName = schema.view.name || viewName;

        // add view properties to options
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

    return buildElement(viewType, schemaPath, modelPath, viewName, options);
  }

  
  //
  // create the service module
  //
  
  module.service('cores', function($http, $q, $rootScope) {

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

      if (response.errors) {
        err.errors = response.errors;
      }
      return err;
    };

    
    //
    // Resource class
    //

    var Resource = function(type, config, options) {

      this.type = type;
      
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
    
    Resource.prototype.load = function(id, params) {

      var path = this.host + this.path;

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
      var def = $q.defer();

      $http.get(path, config).then(
        function(res) { def.resolve(res.data); },
        function(res) { def.reject(makeError(res)); }
      );
      return def.promise;
    };

    
    //
    // Save/update a resource on the server
    //
    
    Resource.prototype.save = function(doc, file) {

      var def = $q.defer();

      // create multipart formdata when saving files

      if (file) {
        var fd = new FormData();
        fd.append('type_', this.type);
        fd.append('doc', JSON.stringify(doc));
        fd.append('file', file);

        if (doc._id && doc._rev) {
          // when updating, add the id and rev
          fd.append('_id', doc._id);
          fd.append('_rev', doc._rev);
        }
        doc = fd;
      }
      
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

          // send multipart with a xhr for now, $http seems to have problems with it
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
            resources[key] = new Resource(key, value, { host: host });
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