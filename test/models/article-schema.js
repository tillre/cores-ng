var js = require('jski');

module.exports = js.object({

  image: js.ref('Image')
    .custom('view', { preview: 'cr-image-ref-preview' }),

  category: js.ref('Category')
    .custom('view', { type: 'model-select-ref', property: 'title' }),

  title: js.string(),

  publish: js.boolean(),
  draft: js.boolean().default(false),

  seconds: js.integer(),
  average: js.number(),

  choose: js.enum(['one', 'two', 'three']),

  author: js.object({
    firstname: js.string(),
    lastname: js.string()
  }),

  tags: js.array(js.object({ name: js.string() })),

  content: js.string().custom('view', 'text'),

  body: js.array(js.anyOf([
    js.object({
      text: js.string()
    }).custom('name', 'paragraph'),

    js.object({
      check: js.boolean()
    }).custom('name', 'doit')
  ]))
  
}).required(['title', 'author', 'body']);
