var j = require('jski');

module.exports = j.object({

  title: j.string(),

  file: j.object({
    name: j.string(),
    url: j.string()
  }).custom('view', 'cr-image')

});