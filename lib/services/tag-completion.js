(function() {

  var module = angular.module('cores.services');


  module.factory('crTagCompletion', function() {

    var items = [];
    var itemsMap = {};

    function createKey(str) {
      return str.toLowerCase().replace(/ +?/g, '');
    }

    return {

      getItem: function(slug) {
        return itemsMap[slug];
      },

      addItem: function(name, slug) {
        if (itemsMap[slug]) return false;
        var t = { name: name, slug: slug, key: createKey(slug) };
        items.push(t);
        itemsMap[slug] = t;
        return true;
      },

      match: function(str) {
        var re = new RegExp('^' + createKey(str));
        return items.filter(function(i) {
          return i.key.match(re);
        });
      }
    };
  });

})();