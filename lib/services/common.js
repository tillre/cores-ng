(function() {

  var module = angular.module('cores.services');

  // Get a new file id

  var getFileId = (function(id) {
    return function() { return 'file' + ++id; };
  })(0);


  // Get a new modal id

  var getModalId = (function(id) {
    return function() { return 'modal-' + ++id; };
  })(0);


  var createSlug = function(str) {

    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    var slug = '';
    var map = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss',
                '/': '-', '_': '-', ',': '-', ':': '-', ';': '-', '.': '-' };

    for (var i = 0; i < str.length; ++i) {
      var c = str.charAt(i);
      slug += map[c] || c;
    }

    slug = slug.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-') // collapse dashes
      .replace(/^-|-$/g, ''); // trim dashes

    return slug;
  };

  var capitalize = function(str) {
    if (!str || str.length === 0) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.substr(1);
  };


  module.service('crCommon', function($q) {

    return {
      getFileId: getFileId,
      getModalId: getModalId,

      createSlug: createSlug,
      capitalize: capitalize
    };
  });

})();