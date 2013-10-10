var path = require('path');
var fs = require('fs');

var coresServer = require('cores-server');


function configureServer(server, callback) {

  server.on('response', function(req) {
    console.log(req.raw.res.statusCode, req.method.toUpperCase(), req.path);
  });

  server.on('internalError', function(req, error) {
    console.log('ERROR', error);
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

  var app = server.pack.app = {
    upload: {
      dir: path.join(__dirname, '/public/upload'),
      url: '/test/public/upload/'
    }
  };

  // create upload dir

  fs.mkdir(app.upload.dir, function(err) {
    if (err && err.code !== 'EEXIST') return callback(err);
    server.start(callback);
  });

  // image resource handlers

  function imageHandler(payload) {
    var doc = payload;
    if (payload.isMultipart) {
      var numFiles = parseInt(payload.numFiles, 10);
      console.log('isMultipart, numFiles', numFiles);
      for (var i = 0; i < numFiles; ++i) {
        console.log('file', i, payload['file' + i]);
      }
      doc = payload.doc;
    }
    console.log('doc', doc);
    return doc;
  };

  server.app.api.addHandler('create', 'Image', function(payload) {
    console.log('create image');
    return imageHandler(payload);
  });

  server.app.api.addHandler('update', 'Image', function(payload) {
    console.log('update image');
    return imageHandler(payload);
  });
}


module.exports = function setupServer(callback) {

  coresServer({
    server: {
      host: '0.0.0.0',
      port: 3333,
      options: {
        cors: {
          origin: ['*'],
          headers: ['X-Requested-With', 'Content-Type']
        },
        payload: {
          maxBytes: 10 * 1024 * 1024 // 10MB
        }
      }
    },
    db: {
      name: 'test-cores-ng'
    },
    resourcesDir: __dirname + '/resources'

  }).then(function(server) {
    configureServer(server, callback);
  }, function(err) {
    callback(err);
  });
};
