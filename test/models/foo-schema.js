var js = require('jski');

module.exports = js.object({

  bar: js.string().minLength(3)

}).required('bar');