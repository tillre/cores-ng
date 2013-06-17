var js = require('jski');

module.exports = js.object({

  bar: js.string()

}).required('bar');