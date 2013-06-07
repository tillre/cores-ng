var js = require('jski');

module.exports = js.object({

  title: js.string(),
  slug: js.string(),

  foo: js.ref('Foo').custom('view', { type: 'model-select-ref' }),
  bar: js.ref('Foo').custom('view', { type: 'model-create-ref' })
  
}).required(['title']);