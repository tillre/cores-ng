(function() {  

  var module = angular.module('cores.services');

  
  module.service('crResource', function($http, $q, $rootScope) {

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
              def.resolve(data);
            }
            else {
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

      refCtrls = refCtrls || [];
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
      index: loadIndex,
      get: getResource,
      save: saveWithRefs
    };
  });

})();