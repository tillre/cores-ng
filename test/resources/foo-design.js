module.exports = {

  views: {
    names: {
      map: function(doc) {
        if (doc.type_ === 'Foo') {
          emit(doc._id, doc.name);
        }
      }
    }
  }

};