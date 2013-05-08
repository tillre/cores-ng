var path = require('path');
var fs = require('fs');
var async = require('async');

var hapi = require('hapi');

var loadResources = require('cores-load');
var mountResources = require('cores-hapi');

var port = 3333;


function setupServer(db, callback) {

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


  // logging
  
  server.on('internalError', function(req, error) {
    console.log('-- internalError', error);
  });
  server.on('error', function(err) {
    console.log(err);
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
      return callback(err);
    }

    // load models and mount routes

    loadResources(db, './test/models', { app: app, recursive: true }, function(err, res) {
      if (err) return callback(err);
      
      mountResources(res, server);
      callback(null, res, server);
    });
  });
}


module.exports = function(db, callback) {

  setupServer(db, function(err, resources, server) {

    if (err) return callback(err);

    server.start();
    console.log('started server on port:', port);
    callback(server);
  });

};