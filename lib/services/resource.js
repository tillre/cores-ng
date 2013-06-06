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

      return $http.get(this.host + this.schemaPath).then(
        function(res) { return res.data; },
        function(res) { throw makeError(res); }
      );
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

      return $http.get(path, config).then(
        function(res) { return res.data; },
        function(res) { throw makeError(res); }
      );
    };

    
    //
    // Save/update a resource on the server
    //
    
    Resource.prototype.save = function(doc, files) {

      if (files && !angular.isArray(files)) {
        files = [files];
      }
      var isMultipart = false;
      
      // create multipart formdata when saving files

      if (files && files.length) {
        var fd = new FormData();
        fd.append('type_', this.type);
        fd.append('doc', JSON.stringify(doc));
        // fd.append('file', file);

        files.forEach(function(file, i) {
          fd.append('file' + i, file);
        });
        fd.append('numFiles', files.length);

        // when updating, add the id and rev
        if (doc._id)  fd.append('_id', doc._id);
        if (doc._rev) fd.append('_rev', doc._ref);

        doc = fd;
        isMultipart = true;
      }

      var req  = {
        url: this.host + this.path,
        method: 'POST',
        data: doc
      };


      if (doc._id && doc._rev) {
        // update
        req.method = 'PUT';
        req.url += '/' + doc._id + '/' + doc._rev;
      }
      else if (doc._id) {
        // new with id
        req.method = 'PUT';
        req.url += '/' + doc._id;
      }

      if (isMultipart) {
        return this._sendMultipart(req);
      }
      else {
        return $http(req).then(
          function(res) { return res.data; },
          function(res) { throw  makeError(res); }
        );
      }
    };


    Resource.prototype._sendMultipart = function(req) {

      var def = $q.defer();
      
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

      xhr.open(req.method, req.url);
      xhr.send(req.data);

      return def.promise;
    };

    
    //
    // Delete a resource on the server
    //
    
    Resource.prototype.destroy = function(doc) {

      return $http.delete(this.host + this.path + '/' + doc._id + '/' + doc._rev).then(
        function(res) {},
        function(res) { throw makeError(res); }
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
      path = this.host + path;

      var config = {
        params: params || {}
      };

      return $http.get(path, config).then(
        function(res) { return res.data; },
        function(res) { throw makeError(res); }
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
      this._host = '';
    };


    Resources.prototype.init = function(host) {

      this._host = host || '';
      var self = this;

      return $http.get(this._host + '/_index').then(

        function(res) {
          angular.forEach(res.data, function(value, key) {
            self._resources[key] = new crResource(key, value, { host: self._host });
          });
          return self._resources;
        },
        function(res) {
          throw makeError(res);
        }
      );
    };


    Resources.prototype.getIds = function(count) {

      count = count || 1;

      return $http.get(this._host + '/_uuids?count=' + count).then(
        function(res) {
          return res.data.uuids;
        },
        function(res) {
          throw makeError(res);
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