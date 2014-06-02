(function() {

  var module = angular.module('cores.services');


  module.factory('crPagination', function() {

    function createViewPaginator(resource, view, query) {

      view = view || 'all';
      query = query || {};

      var prevKeys = [];
      var curKey = null;
      var nextKey = null;

      function load(startkey) {
        var q = angular.copy(query);
        // get one more to see if there is a next page
        q.limit = q.limit ? q.limit + 1 : 11;
        q.view = q.view || 'all';
        // overwrite startkey on consecutive
        q.startkey = startkey || q.startkey;
        // force include docs
        q.include_docs = true;

        return resource.view(view, q).then(function(result) {
          if (result.rows.length > 0) {
            curKey = result.rows[0].key;
            nextKey = null;

            if (result.rows.length > q.limit - 1) {
              // there is a next page
              nextKey = result.rows[result.rows.length - 1].key;
              result.rows.pop();
            }
          }
          return result;
        });
      }

      return Object.freeze({

        resource: resource,

        loadInitial: function() {
          prevKeys = [];
          curKey = nextKey = null;
          return load();
        },

        hasNext: function hasNext() {
          return !!nextKey;
        },

        hasPrev: function hasPrev() {
          return prevKeys.length > 0;
        },

        loadNext: function loadNext() {
          prevKeys.push(curKey);
          return load(nextKey);
        },

        loadPrev: function loadPrev() {
          return load(prevKeys.pop());
        }
      });
    }


    function createSearchPaginator(resource, search, query) {


      return Object.freeze({

        resource: resource,

        loadInitial: function() {
        },

        hasNext: function hasNext() {
        },

        hasPrev: function hasPrev() {
        },

        loadNext: function loadNext() {
        },

        loadPrev: function loadPrev() {
        }
      });
    }


    return {
      createViewPaginator: createViewPaginator,
      createSearchPaginator: createSearchPaginator
    };
  });

})();
