var j = require('jski');


module.exports = j.object({

  boolean: j.boolean(),
  number: j.number().minimum(-1.5).maximum(1.5),
  integer: j.integer().minimum(0).maximum(10).multipleOf(2),
  string: j.string().minLength(2).maxLength(10).pattern('[a-zA-Z]+'),

  none: j.string().custom('view', 'none'),
  readonly: j.string().default('readonly').custom('view', 'cr-readonly'),

  markdown: j.string().custom('view', 'cr-markdown'),

  slug: j.string()
    .format('slug')
    .custom('view', { type: 'cr-slug', source: ['string'] }),

  date: j.string().custom('view', 'cr-datetime'),

  'enum': j.enum(1, 2, 3),

  ref: j.ref('Foo')
    .custom('view', {
      previewPath: '/bar',
      defaults: { '/bar': 'some value' }
    }),

  image: j.ref('Image')
    .custom('view', { previewPath: 'title' }),

  singleSelRef: j.ref('Foo')
    .custom('view', { type: 'cr-single-select-ref', previewPath: '/bar' }),

  multiSelRef: j.array(j.ref('Foo'))
    .custom('view', { type: 'cr-multi-select-ref', previewPath: '/bar' }),

  object: j.object({
    foo: j.string(),
    bar: j.string()
  }),

  tabObject: j.object({
    tab1: j.string(),
    tab2: j.string()
  }).custom('view', 'cr-tab-object'),

  tabObject2: j.object({
    tab1: j.string(),
    tab2: j.string()
  }).custom('view', 'cr-tab-object'),


  array: j.array(j.object({
    foo: j.boolean()
  }).title('Some Title')),

  arrayRefs: j.array(j.object({
    foo: j.ref('Foo')
      .custom('view', { previewPath: 'bar' })
  })),
  arrayRefs2: j.array(
    j.ref('Foo')
      .custom('view', { previewPath: 'bar' })
      .title('Yam')
  ),

  anyof: j.array(j.anyOf(
    j.object({
      text: j.string(),
      images: j.array(j.object({ name: j.string() }))
    }).custom('name', 'textimage'),

    j.object({
      embed: j.string()
    }).custom('name', 'video'),

    j.object({
      images: j.array(j.object({ name: j.string() }))
    }).custom('name', 'gallery')
  )),

  anyofRefs: j.array(j.anyOf(
    j.object({ foo: j.ref('Foo').custom('view', { previewPath: 'bar' }) }).custom('name', 'foo1'),
    j.object({ bar: j.ref('Foo').custom('view', { previewPath: 'bar' }) }).custom('name', 'foo2')
  )),

  object: j.object({
    foo: j.number(),
    bar: j.string()
  }),

  text: j.string().custom('view', 'cr-text'),
  password: j.string().minLength(8).custom('view', 'cr-password')

}).required('string2', 'number', 'ref', 'enum', 'slug', 'text', 'singleSelRef');
