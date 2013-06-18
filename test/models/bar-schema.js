var j = require('jski');

module.exports = j.object({

  boolean: j.boolean(),
  number: j.number(),
  integer: j.integer(),
  string: j.string(),

  'enum': j.enum(1, 2, 3),

  array: j.array(j.object({
    foo: j.boolean()
  })),

  anyof: j.array(j.anyOf(
    j.object({ foo: j.number() }).custom('name', 'foo'),
    j.object({ bar: j.string() }).custom('name', 'bar')
  )),
  
  object: j.object({
    foo: j.number(),
    bar: j.string()
  }),

  text: j.string().custom('view', 'text'),
  password: j.string().custom('view', 'password')
});