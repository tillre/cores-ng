
var fs = require('fs');
var path = require('path');
var url = require('url');


function handlePayload(request, resource, payload, callback) {

  var self = this;
  
  if (payload.isMultipart) {

    var app = request.server.pack.app;
    var doc = payload.doc;
    var file = payload.file0;

    // file is a string when testing with fake file data
    if (typeof file === 'string') file = JSON.parse(file);

    var targetFile = path.join(app.upload.dir, file.name);

    if (file.isTest) {
      // when testing no real file is send
      doc.file.url = file.path;
      callback(null, doc);
    }
    else {
      fs.rename(file.path, targetFile, function(err) {

        if (err) {
          err.code = 500;
          return callback(err);
        }
        
        doc.file.url = url.resolve(app.upload.url, file.name);
        callback(null, doc);
      });
    }
  }
  else {
    callback(null, payload);
  }
}


module.exports = {
  create: handlePayload,
  update: handlePayload
};
