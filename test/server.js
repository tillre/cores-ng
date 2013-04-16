var path = require('path');
var fs = require('fs');

var hapi = require('hapi');

var comodlLoad = require('comodl-load');
var comodlHapi = require('comodl-hapi');


function setupServer(db, callback) {
  // run test server
  var server = new hapi.Server('0.0.0.0', 3333, {
    cors: {
      origin: ['*'],
      headers: ['X-Requested-With', 'Content-Type']
    }
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
  
  // load models and mount routes
  comodlLoad(db, './test/models', function(err, comodl) {

    if (err) return callback(err);
    
    comodlHapi(comodl, server);

    callback(null, comodl, server);
  });
}


module.exports = function(db, callback) {

  setupServer(db, function(err, comodl, server) {

    if (err) return callback(err);

    server.start();
    callback(server);
  });

};