
var handlePayload = function(app, payload, callback) {

  var doc = payload.doc;
  var numFiles = parseInt(payload.numFiles, 10);

  for (var i = 0; i < numFiles; ++i) {
    doc['file' + i] = JSON.parse(payload['file' + i]).name;
  }

  callback(null, doc);
};

module.exports = {
  save: handlePayload
};