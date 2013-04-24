var path = require('path');
var fs = require('fs');

var hapi = require('hapi');

var loadResources = require('cores-load');
var mountResources = require('cores-hapi');

var port = 3333;

function setupServer(db, callback) {
  // run test server
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
  // server.on('request', function(req) {
  //   if (req.path === '/favicon.ico') return;
  //   console.log('-- request', req.path, req);
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

  var ext = {
    uploadDir: path.join(__dirname, '/upload'),
    uploadUrl: '/upload/'
  };
  
  // load models and mount routes
  loadResources(db, './models', ext, function(err, resources) {

    if (err) return callback(err);
    
    mountResources(resources, server);

    callback(null, resources, server);
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