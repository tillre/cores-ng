var J = require('jski')();

module.exports = J.object({

  title: J.string(),

  file: J.object({
    name: J.string(),
    url: J.string()
  }).custom('view', 'cr-image')

});