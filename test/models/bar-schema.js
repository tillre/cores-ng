var j = require('jski');

module.exports = j.object({

  boolean: j.boolean(),
  number: j.number().minimum(-1.5).maximum(1.5),
  integer: j.integer().minimum(0).maximum(10).multipleOf(2),
  string1: j.string().minLength(2).maxLength(10).pattern('[a-zA-Z]+'),
  string2: j.string(),

  'enum': j.enum(1, 2, 3),

  ref: j.ref('Foo').custom('preview', 'bar'),

  array: j.array(j.object({
    foo: j.boolean()
  })),

  // arrayRefs: j.array(j.ref('Foo').custom('preview', 'bar')),
  
  anyof: j.array(j.anyOf(
    j.object({ foo: j.number() }).custom('name', 'foo'),
    j.object({ bar: j.string() }).custom('name', 'bar')
  )),
  
  anyofRefs: j.array(j.anyOf(
    j.object({ foo: j.ref('Foo').custom('preview', 'bar') }).custom('name', 'foo1'),
    j.object({ bar: j.ref('Foo').custom('preview', 'bar') }).custom('name', 'foo2')
  )),
  
  object: j.object({
    foo: j.number(),
    bar: j.string()
  }),

  text: j.string().custom('view', 'text'),
  password: j.string().minLength(8).custom('view', 'password')

}).required('string2', 'number', 'ref');