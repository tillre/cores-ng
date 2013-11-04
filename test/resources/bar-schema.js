var J = require('jski')();


module.exports = J.object({

  boolean: J.boolean(),
  number: J.number().minimum(-1.5).maximum(1.5),
  integer: J.integer().minimum(0).maximum(10).multipleOf(2),
  string: J.string().minLength(2).maxLength(10).pattern('[a-zA-Z]+'),

  none: J.string().custom('view', 'none'),
  readonly: J.string().default('readonly').custom('view', 'cr-readonly'),

  markdown: J.string().custom('view', 'cr-markdown'),

  slug: J.string()
    .format('slug')
    .custom('view', { type: 'cr-slug', source: ['string'] }),

  date: J.string().custom('view', 'cr-datetime'),

  'enum': J.enum(1, 2, 3),

  ref: J.ref('Foo')
    .custom('view', {
      previewPath: '/bar',
      defaults: { '/bar': 'some value' },
      listView: { name: 'bars' }
    }),

  image: J.ref('Image')
    .custom('view', { preview: 'cr-image-preview' }),

  singleSelRef: J.ref('Foo')
    .custom('view', { type: 'cr-single-select-ref', previewPath: '/bar' }),

  multiSelRef: J.array(J.ref('Foo'))
    .custom('view', { type: 'cr-multi-select-ref', previewPath: '/bar' }),

  object: J.object({
    foo: J.string(),
    bar: J.number()
  }),

  inlineObject: J.object({
    foo: J.string(),
    bar: J.number()
  }).custom('view', { inline: true }),

  tabObject: J.object({
    tab1: J.string(),
    tab2: J.object({
      foo: J.string(),
      bar: J.number()
    }).custom('view', { inline: true })
  }).custom('view', 'cr-tab-object'),

  tabObject2: J.object({
    tab1: J.string(),
    tab2: J.string().custom('view', 'cr-markdown')
  }).custom('view', 'cr-tab-object'),

  array: J.array(J.object({
    foo: J.boolean()
  })).title('Some Array').custom('view'),

  array2: J.array(J.object({
    foo: J.string().custom('view', 'cr-markdown')
  })).title('Some Array').custom('view', { indent: false }),

  arrayRefs: J.array(J.object({
    foo: J.ref('Foo')
      .custom('view', { previewPath: 'bar' })
  })),

  arrayRefs2: J.array(
    J.ref('Foo')
      .custom('view', { previewPath: 'bar' })
      .title('Yam')
  ),

  anyof: J.array(J.anyOf(
    J.object({
      text: J.string(),
      images: J.array(J.object({ name: J.string() }))
    }).custom('name', 'textimage'),

    J.object({
      embed: J.string()
    }).custom('name', 'video'),

    J.object({
      text: J.string().custom('view', { type: 'cr-markdown', showBorder: false, showLabel: false })
    }).custom('name', 'markdown'),

    J.object({
      images: J.array(J.object({ name: J.string() }))
    }).custom('name', 'gallery')
  )),

  anyofRefs: J.array(J.anyOf(
    J.object({ foo: J.ref('Foo').custom('view', { previewPath: 'bar' }) }).custom('name', 'foo1'),
    J.object({ bar: J.ref('Foo').custom('view', { previewPath: 'bar' }) }).custom('name', 'foo2')
  )).custom('view', { item: { indent: false }}),

  text: J.string().custom('view', 'cr-text'),
  password: J.string().minLength(8).custom('view', 'cr-password')

}).required('string', 'number', 'ref', 'enum', 'slug', 'text', 'singleSelRef');
