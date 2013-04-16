var _ = require('underscore');
var fs = require('fs');
var path = require('path');

//
// Create an angular api service js file and return its src
// params: comodl, [options], callback
//
module.exports = function(comodl, options, callback) {

  if (arguments.length === 2) {
    callback = options;
    options = {};
  }
  
  var layouts = {};

  
  _.each(comodl.layouts, function(layout, name) {
    layouts[name] = {
      name: name,
      path: layout.path,
      viewPaths: layout.viewPaths,
      schema: layout.schema
    };
  });

  
  fs.readFile(path.resolve(__dirname, './templates/service.jst'), function(err, data) {
    if (err) return callback(err);
    
    var template = _.template(data.toString());
    var src = template({
      host: options.host || '',
      layouts: JSON.stringify(layouts)
    });
    callback(null, src);
  });
};
