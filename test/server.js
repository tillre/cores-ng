var path = require('path');
var fs = require('fs');

var hapi = require('hapi');

var comodlLoad = require('comodl-load');
var comodlHapi = require('comodl-hapi');
var comodlNGService = require('../index.js');


function setupServer(db, callback) {
  // run test server
  var server = new hapi.Server('0.0.0.0', 3333, {
    cors: {
      origin: ['*'],
      headers: ['X-Requested-With', 'Content-Type']
    }
  });

  // load models and mount routes
  comodlLoad(db, './test/models', function(err, comodl) {

    if (err) return callback(err);
    
    comodlHapi(comodl, server);

    callback(null, comodl, server);
  });
}


function createServiceFile(comodl, serviceFile, callback) {
  comodlNGService(comodl, { host: 'http://localhost:3333' }, function(err, src) {

    if (err) return callback(err);

    console.log('writing service file:', serviceFile);
    
    fs.writeFile(serviceFile, src, function(err) {

      callback(err);
      
    });
  });
}


module.exports = function(db, serviceFile, callback) {

  setupServer(db, function(err, comodl, server) {

    if (err) return callback(err);

    createServiceFile(comodl, serviceFile, function(err) {

      if (err) return callback(err);
      
      server.start();
      callback(server);
    })
  });

};