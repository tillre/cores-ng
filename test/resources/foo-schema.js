var js = require('jski');

module.exports = js.object({

  bar: js.string().minLength(3),
  slug: js.string().custom('view', 'cr-slug').format('slug')

}).required('bar');