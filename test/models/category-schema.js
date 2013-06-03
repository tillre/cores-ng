var js = require('jski');

module.exports = js.object({

  title: js.string(),
  slug: js.string(),

  foo: js.ref('Image').custom('view', { type: 'cr-model-select-ref' }),
  bar: js.ref('Image').custom('view', { type: 'cr-model-create-ref' })
  
}).required(['title', 'slug']);