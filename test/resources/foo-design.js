module.exports = {

  views: {
    bars: {
      map: function(doc) {
        if (doc.type_ === 'Foo') {
          emit(doc._id, doc.bar);
        }
      }
    }
  }
  
};