var J = require('jski')();


module.exports = J.object({

  boolean: J.boolean(),
  number: J.number().minimum(1).maximum(10).multipleOf(2),
  integer: J.integer().minimum(1).maximum(10).multipleOf(2),
  string: J.string().minLength(2).maxLength(10).pattern('[a-zA-Z]+'),

  object: J.object({
    string: J.string(),
    number: J.number()
  }).required('string'),

  array: J.array(J.object({
    foo: J.boolean()
  })),

  arrayAnyOf: J.array(J.anyOf(
    J.object({
      string: J.string()
    }).custom('name', 'foo'),
    J.object({
      number: J.number()
    }).custom('name', 'bar')
  )),

  anyOf: J.anyOf(
    J.object({
      string: J.string()
    }).custom('name', 'foo'),
    J.object({
      number: J.number()
    }).custom('name', 'bar')
  ),

  none: J.string().custom('view', 'none'),
  readonly: J.string().default('readonly').custom('view', 'readonly'),

  'enum': J.enum(1, 2, 3),

  ref: J.ref('Foo').custom('view', 'ref'),

  selectRef: J.ref('Foo').custom('view', 'selectRef'),

  image: J.ref('Image').custom('view', 'image'),

  singleSelRef: J.ref('Foo').custom('view', 'singleSelRef'),

  multiSelRef: J.array(J.ref('Foo')).custom('view', 'multiSelRef'),

  tags: J.array(
    J.object({ name: J.string(), slug: J.string() })
  ).custom('view', 'tags'),

  tag: J.object(
    { name: J.string(), slug: J.string() }
  ).custom('view', 'selTag'),

  date: J.string().custom('view', 'datetime'),

  slug: J.string().format('slug').custom('view', 'slug'),

  inlineObject: J.object({
    foo: J.string(),
    bar: J.number()
  }).custom('view', 'inline'),

  columnObject: J.object({
    foo: J.string(),
    bar: J.string(),
    baz: J.array(J.object({ num: J.number() }))
  }).custom('view', 'columnObject'),

  tabObject: J.object({
    tab1: J.string(),
    tab2: J.object({
      foo: J.string(),
      bar: J.number()
    }).custom('view', 'inline')
  }).custom('view', 'tabObject'),

  arrayRefs: J.array(
    J.ref('Foo')
      .custom('view', 'arrayRef')
      .title('Yam')
  ),

  text: J.string().custom('view', 'text').minLength(10),
  password: J.string().minLength(8).custom('view', 'password')

}).custom('view', 'base').required('string');
