var path = require('path');
var fs = require('fs');
var async = require('async');

var hapi = require('hapi');
var cores = require('cores');


var port = 3333;


function setupServer(db, callback) {

  cores = cores(db);

  // test server

  var server = new hapi.Server('0.0.0.0', port, {
    cors: {
      origin: ['*'],
      headers: ['X-Requested-With', 'Content-Type']
    },
    payload: {
      maxBytes: 10 * 1024 * 1024 // 10MB
    }
  });


  // Logging
  
  // server.on('request', function(req) {
  //   console.log('-- request', req.method, req.path, req.params);
  // });
  // server.on('response', function(res) {
  //   console.log('-- response', res);
  // });
  // server.on('tail', function(event) {
  //   console.log('-- tail');
  // });
  server.on('internalError', function(req, error) {
    console.log('-- internalError', error);
  });

  // listen on pack events to get plugin log events as well

  server.pack.events.on('log', function(e) {
    console.log('-- log', e.tags, e.data);
  });
  
  // serve index.html
  
  server.route({
    path: '/',
    method: 'GET',
    handler: { file: './test/public/index.html' }
  });
  
  // serve files
  
  server.route({
    path: '/{path*}',
    method: 'GET',
    handler: { directory: { path: '.', listing: true }}
  });

  // app data
  
  var app = {
    upload: {
      dir: path.join(__dirname, '/public/upload'),
      url: '/test/public/upload/'
    }
  };

  // create upload dir

  fs.mkdir(app.upload.dir, function(err) {
    if (err && err.code !== 'EEXIST') {
      callback(err);
      return;
    }

    // load models and create the api
    console.log('loading models');
    
    cores.load('./test/models', { app: app, recursive: true }, function(err, resources) {
      if (err) return callback(err);

      var options = {
        cores: cores,
        resources: resources,
        handlers: __dirname + '/models'
      };
      server.pack.require('cores-hapi', options, function(err) {
        if (err) return callback(err);
        callback(null, resources, server);
      });
    });
  });
}


module.exports = function(db, callback) {

  setupServer(db, function(err, resources, server) {

    if (err) {
      callback(err);
      return;
    }

    server.start();
    console.log('started server on port:', port);
    callback(server);
  });

};