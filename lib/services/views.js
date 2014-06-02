(function() {

  var module = angular.module('cores.services');


  module.factory('crViews', function() {

    var views = {};

    function addView(id, spec) {
      if (views[id]) {
        throw new Error('View does already exist: ' + id);
      }
      views[id] = spec;
    }

    return {

      //
      // get a view by id
      //
      get: function(id) {
        console.log('get view', id);
        var v = views[id];
        if (!v) {
          throw new Error('View does not exist: ' + (typeof id === 'string' ? id : JSON.stringify(id)));
        }
        return v;
      },

      //
      // add one or a map of view
      // either (id, spec) or ({id1: spec1, id2: spec2})
      //
      add: function(id, spec) {
        if (arguments.length === 1) {
          Object.keys(id).forEach(function(key) {
            addView(key, id[key]);
          });
        }
        else {
          addView(id, spec);
        }
      }
    };
  });

})();
