
function handlePayload(payload, callback) {
  console.log("handlePayload handlePayload handlePayload");

  if (payload.isMultipart) {

    var doc = payload.doc;
    var file = payload.file;

    doc.file.path = file.path;

    console.log('image multipart', payload);
    
    callback(doc);
  }
  else {

    console.log('image json');
    
    callback(payload);
  }
}

module.exports = {
  create: handlePayload,
  save: handlePayload
};
