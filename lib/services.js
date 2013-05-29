(function() {

  var NS = 'cr';
  var module = angular.module('cores.services', ['ng']);

  
  //
  // create a object with default values from schema
  //
  
  function createDefaultModel(schema, typeName) {

    var hasDefaultValue = schema.hasOwnProperty('default');
    
    if (schema.enum) {
      return hasDefaultValue ? schema.default : schema.enum[0];
    }
    if (schema.$ref) {
      return hasDefaultValue ? schema.default : {};
    }
    // infer object and array
    if (!schema.type) {
      if (schema.properties) schema.type = 'object';
      if (schema.items) schema.type = 'array';
    }
    
    if (!schema.type) throw new Error('Cannot create default value for schema without type');

    switch(schema.type) {
    case 'boolean': return hasDefaultValue ? schema.default : true;
    case 'integer': return hasDefaultValue ? schema.default : 0;
    case 'number': return hasDefaultValue ? schema.default : 0;
    case 'string': return hasDefaultValue ? schema.default : '';
    case 'object':
      if (hasDefaultValue) return schema.default;
      
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
    case 'array': return hasDefaultValue ? schema.default : [];
    default: throw new Error('Cannot create default value for unknown type: ' + schema.type);
    }
  }


  //
  // get the name from the schema or alternativly from the path
  //
  
  function getModelName(schema, modelPath) {
    // use schema name if it exists
    var name = schema.title || '';

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

    if (schema.type && !angular.isString(schema.type)) {
      throw new Error('Only single types are supported');
    }

    var viewType = schema.type;
    var viewName = getModelName(schema, modelPath);

    // handle extended types
    
    if (schema.enum) {
      viewType = 'enum';
    }
    if (schema.$ref) {
      viewType = 'model-ref';
    }
    if (viewType === 'array' && schema.items.anyOf) {
      viewType = 'anyof-array';
    }

    if (schema.view) {

      // view can be a string or object with additional options
      
      if (angular.isObject(schema.view)) {
        viewType = schema.view.type || viewType;
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
        console.log('create multipart data');
        var fd = new FormData();
        fd.append('type_', this.type);
        fd.append('doc', JSON.stringify(doc));
        fd.append('file', file);

        // when updating, add the id and rev
        if (doc._id)  fd.append('_id', doc._id);
        if (doc._rev) fd.append('_rev', doc._ref);
        // if (doc._id && doc._rev) {
        //   // when updating, add the id and rev
        //   fd.append('_id', doc._id);
        //   fd.append('_rev', doc._rev);
        // }
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
    // internal module state
    //

    var internal = {
      resources: {},
      host: ''
    };
    
    //
    // loads model config(urls) and create resources from it
    //

    function loadIndex(host) {

      internal.host = host || '';
      
      var def = $q.defer();

      $http.get(internal.host + '/_index').then(

        function(res) {
          angular.forEach(res.data, function(value, key) {
            internal.resources[key] = new Resource(key, value, { host: internal.host });
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
    // get a new uuid for a resource
    //
    
    function getUUIds(count) {

      count = count || 1;
      var def = $q.defer();

      $http.get(internal.host + '/_uuids?count=' + count).then(

        function(res) {
          def.resolve(res.data);
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

      var r = internal.resources[type];
      if (!r) {
        throw new Error('Resource with type not found: ' + type);
      }
      return r;
    }


    //
    // save a model including its referenced models
    //

    function saveWithRefs(modelCtrl, refCtrls) {

      var newCtrls = [];
      var ids;

      // collect controllers of new models
      
      if (!modelCtrl.getId())
        newCtrls.push(modelCtrl);

      refCtrls.forEach(function(ctrl) {
        if (!ctrl.getId())
          newCtrls.push(ctrl);
      });

      // call save on all models and return an array of the promises

      var saveAll = function() {

        // TODO: check if model has not changed and must not be saved

        return refCtrls.concat([modelCtrl]).map(function(ctrl) {
          return ctrl.save().then(
            function(doc) {
              ctrl.setModel(doc);
            }
          );
        });
      };
      
      if (newCtrls.length === 0) {

        // no new models, just save all

        return $q.all.apply($q, saveAll());
      }
      else {

        // get ids for new models

        return getUUIds(newCtrls.length).then(

          function(res) {

            // assign ids to models

            newCtrls.forEach(function(ctrl) {
              ctrl.setId(res.uuids.pop());
            });

            // assign parent ids to submodels

            // var parentId = newCtrls[0].getId();
            var parentId = modelCtrl.getId();
            refCtrls.forEach(function(ctrl) {
              ctrl.setParentId(parentId);
            });

            // save models
            
            return $q.all.apply($q, saveAll());
          }
        );
      }
    }
    

    //
    // public
    //
    
    return {
      initialize: loadIndex,
      getResource: getResource,
      saveWithRefs: saveWithRefs,
      // getIds: getUUIds,
      createModel: createDefaultModel,
      buildTemplate: buildTemplate
    };
  });

})();