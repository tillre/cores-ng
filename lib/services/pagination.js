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

        loadNext: function loadNext() {
          prevKeys.push(curKey);
          return load(nextKey);
        },

        loadPrev: function loadPrev() {
          return load(prevKeys.pop());
        },

        hasNext: function hasNext() {
          return !!nextKey;
        },

        hasPrev: function hasPrev() {
          return prevKeys.length > 0;
        }
      });
    }


    function createSearchPaginator(resource, search, query) {

      query = query || {};

      var prevBookmarks = [];
      var curBookmark = null;
      var nextBookmark = null;
      var firstPage = true;

      function load(bookmark) {
        var q = angular.copy(query);
        q.limit = q.limit || 10;
        // add bookmark
        if (bookmark) {
          q.bookmark = bookmark;
        }
        // force include docs
        q.include_docs = true;
        return resource.search(search, q);
      }

      return Object.freeze({

        resource: resource,

        setQuery: function(q) {
          query = q;
        },

        loadInitial: function() {
          prevBookmarks = [];
          curBookmark = nextBookmark = null;
          firstPage = true;

          return load().then(function(result) {
            nextBookmark = result.bookmark;
            return result;
          });
        },

        loadNext: function loadNext() {
          return load(nextBookmark).then(function(result) {
            if (curBookmark) {
              prevBookmarks.push(curBookmark);
            }
            curBookmark = nextBookmark;
            nextBookmark = null;
            if (result.rows.length === (query.limit || 10)) {
              nextBookmark = result.bookmark;
            }
            firstPage = false;
            return result;
          });
        },

        loadPrev: function loadPrev() {
          var b = prevBookmarks.pop();
          if (!b) {
            firstPage = true;
          }
          return load(b).then(function(result) {
            curBookmark = b;
            nextBookmark = result.bookmark;
            return result;
          });
        },

        hasNext: function hasNext() {
          return !!nextBookmark;
        },

        hasPrev: function hasPrev() {
          return !firstPage || prevBookmarks.length > 0;
        }
      });
    }


    return {
      createViewPaginator: createViewPaginator,
      createSearchPaginator: createSearchPaginator
    };
  });

})();
