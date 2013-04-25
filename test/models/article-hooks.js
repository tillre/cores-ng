module.exports = {
  save: function(res, doc, callback) {
    doc.author.firstname = 'Tom';
    callback(null, doc);
  }
};