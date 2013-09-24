module.exports = {

  views: {
    altall: {
      map: function(doc) {
        if (doc.type_ === 'Bar') {
          emit(doc._id, null);
        }
      }
    },

    onlyASD: {
      map: function(doc) {
        if (doc.type_ === 'Bar' && doc.string1 === 'asd') {
          emit(doc._id, null);
        }
      }
    },

    by_string: {
      map: function(doc) {
        if (doc.type_ === 'Bar') {
          emit(doc.string1, null);
        }
      }
    }
  }

};