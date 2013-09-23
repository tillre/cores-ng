module.exports = {

  views: {
    altall: {
      map: function(doc) {
        if (doc.type_ === 'Bar') {
          emit(doc._id, null);
        }
      }
    }
  }

};