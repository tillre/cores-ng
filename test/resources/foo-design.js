module.exports = {

  views: {
    titles: {
      map: function(doc) {
        if (doc.type_ === 'Foo') {
          emit(doc._id, doc.title);
        }
      }
    }
  }

};