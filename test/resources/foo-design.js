module.exports = {

  views: {
    ids: {
      map: function(doc) {
        if (doc.type_ === 'Foo') {
          emit(doc._id, doc.name);
        }
      }
    },

    names: {
      map: function(doc) {
        if (doc.type_ === 'Foo') {
          emit(doc.name);
        }
      }
    }

  }

};