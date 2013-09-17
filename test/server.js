var path = require('path');
var fs = require('fs');

var coresServer = require('cores-server');


function configureServer(server, callback) {

  server.on('response', function(req) {
    console.log(req.method, req.path, req.raw.res.statusCode);
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
