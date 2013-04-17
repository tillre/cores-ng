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
    },
    payload: {
      maxBytes: 10 * 1024 * 1024 // 10MB
    }
  });


  // logging
  server.on('request', function(req) {
    if (req.path === '/favicon.ico') return;
    console.log('-- request', req.path, req);
  });
  server.on('response', function(res) {
    console.log('-- response', res);
  });
  server.on('tail', function(event) {
    console.log('-- tail');
  });
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



  server.route({
    path: '/postit',
    method: 'POST',
    handler: function(req) {
      console.log('req', req);
      req.reply('HOOOAHAHOAHAOHAOAH');
    }
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