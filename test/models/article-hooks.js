module.exports = {
  save: function(res, doc, callback) {
    doc.author.firstname = 'Tom';

    // cut of arrays for testing html model form update
    
    if (doc.tags.length > 2) {
      doc.tags = doc.tags.slice(0, 2);
    }

    if (doc.body.length > 1) {
      doc.body = doc.body.slice(0, 1);
    }
    
    callback(null, doc);
  }
};