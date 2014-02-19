var J = require('jski')();

module.exports = J.object({

  title: J.string().minLength(3),
  baz: J.number().multipleOf(3),
  slug: J.string().custom('view', { type: 'cr-slug', source: 'title' }).format('slug')

}).required('title', 'slug');