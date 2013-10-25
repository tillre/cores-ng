var path = require('path');
var fs = require('fs');
var Q = require('kew');
var cs = require('cores-server');


function init(server) {

  // logging
  server.on('response', function(req) {
    console.log(req.raw.res.statusCode, req.method.toUpperCase(), req.path);
  });
  server.on('internalError', function(req, error) {
    console.log('ERROR', error);
  });

  server.route([
    // index
    {
      path: '/',
      method: 'GET',
      handler: { file: './test/public/index.html' }
    },
    // static files
    {
      path: '/{path*}',
      method: 'GET',
      handler: { directory: { path: '.', listing: true }}
    }
  ]);

  // app data
  var app = server.pack.app = {
    upload: {
      dir: path.join(__dirname, '/public/upload'),
      url: '/test/public/upload/'
    }
  };

  // image resource handlers
  function imageHandler(payload) {
    var doc = payload;

    if (payload.isMultipart) {

      var numFiles = parseInt(payload.numFiles, 10);
      // console.log('isMultipart, numFiles', numFiles);
      // for (var i = 0; i < numFiles; ++i) {
      //   console.log('file', i, payload['file' + i]);
      // }
      doc = payload.doc;

      if (numFiles > 0) {
        var file = payload['file0'];
        var destFile = app.upload.dir + '/' + file.name;
        var defer = Q.defer();

        fs.rename(file.path, destFile, function(err) {
          if (err) return defer.reject(err);
          doc.file.url = app.upload.url /*'/test/public/upload/'*/ + file.name;
          defer.resolve(doc);
        });
        return defer.promise;
      }
    }
    return Q.resolve(doc);
  };

  server.app.api.setHandler('create', 'Image', function(payload) {
    return imageHandler(payload);
  });

  server.app.api.setHandler('update', 'Image', function(payload) {
    return imageHandler(payload);
  });

  // create upload dir
  var defer = Q.defer();
  fs.mkdir(app.upload.dir, function(err) {
    if (err && err.code !== 'EEXIST') return defer.reject(err);
    server.start(function(err) {
      if (err) return defer.reject(err);
      defer.resolve();
    });
  });
  return defer.promise;
}


module.exports = function setupServer(callback) {

  cs.createServer({
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
    return cs.createApi(server);

  }).then(function(server) {
    return init(server);

  }).then(function() {
    callback();
  }, function(err) {
    callback(err);
  });
};
