module.exports = {
  properties: {
    foo: {
      type: 'array',
      items: {
        anyOf: [
          { properties: { bar: { type: 'number' } } },
          { properties: { baz: { type: 'boolean'} } }
        ]
      }
    }
  }
};