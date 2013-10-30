var js = require('jski')();

module.exports = js.object({

  bar: js.string().minLength(3),
  date: js.string().custom('view', 'cr-datetime'),
  slug: js.string().custom('view', { type: 'cr-slug', source: 'bar' }).format('slug')

}).required('bar');