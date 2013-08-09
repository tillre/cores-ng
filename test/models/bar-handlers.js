
var reportError = function(request, resource, payload, callback) {
  // callback(new Error('NOOOOOOOOOOOOOOOOOOOOOOOO WAY'));
  callback(null, payload);
};

module.exports = {
  create: reportError,
  update: reportError
};