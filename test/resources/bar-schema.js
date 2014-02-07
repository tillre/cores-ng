var J = require('jski')();


module.exports = J.object({

  boolean: J.boolean(),
  number: J.number().minimum(1).maximum(10).multipleOf(2),
  integer: J.integer().minimum(1).maximum(10).multipleOf(2),
  string: J.string().minLength(2).maxLength(10).pattern('[a-zA-Z]+'),

  object: J.object({
    string: J.string().minLength(3),
    number: J.number()
  }).required('string'),

  array: J.array(J.object({
    foo: J.boolean()
  })),

  anyof: J.array(J.anyOf(
    J.object({
      string: J.string()
    }).custom('name', 'foo'),

    J.object({
      number: J.number()
    }).custom('name', 'bar')
  )),

  none: J.string().custom('view', { type: 'none' }),
  readonly: J.string().default('readonly').custom('view', { type: 'cr-readonly' }),

  'enum': J.enum(1, 2, 3),

  ref: J.ref('Foo')
    .custom('view', {
      previewPaths: ['/bar', '/slug'],
      defaults: { '/bar': 'some value' },
      list: {
        headers: [ { path: 'slug' } ],
        view: { name: 'bars' }
      }
    }),

  image: J.ref('Image')
    .custom('view', { preview: 'cr-image-preview'}),

  singleSelRef: J.ref('Foo')
    .custom('view', { type: 'cr-single-select-ref', previewPaths: ['/bar', '/slug'] }),

  multiSelRef: J.array(J.ref('Foo'))
    .custom('view', { type: 'cr-multi-select-ref', previewPath: '/bar' }),

  date: J.string().custom('view', { type: 'cr-datetime' }),

  markdown: J.string().custom('view', { type: 'cr-markdown' }).minLength(2).maxLength(10),

  slug: J.string()
    .format('slug')
    .custom('view', { type: 'cr-slug', source: ['string'] }),


  inlineObject: J.object({
    foo: J.string(),
    bar: J.number()
  }).custom('view', { inline: true }),

  columnObject: J.object({
    foo: J.string(),
    bar: J.string(),
    baz: J.array(J.object({ num: J.number() }))
  }).custom('view', { type: 'cr-column-object', showLabels: true }),

  tabObject: J.object({
    tab1: J.string(),
    tab2: J.object({
      foo: J.string(),
      bar: J.number()
    }).custom('view', { inline: true })
  }).custom('view', { type: 'cr-tab-object' }),

  arrayRefs2: J.array(
    J.ref('Foo')
      .custom('view', { previewPath: 'bar' })
      .title('Yam')
  ),

  text: J.string().custom('view', { type: 'cr-text' }).minLength(10),
  password: J.string().minLength(8).custom('view', { type: 'cr-password' })

}).required('string');
