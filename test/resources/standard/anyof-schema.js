module.exports = {
  properties: {
    foo: {
      type: 'array',
      items: {
        anyOf: [
          { name: 'bar', properties: { bar: { type: 'number' } } },
          { name: 'baz', properties: { baz: { type: 'boolean'} } }
        ]
      }
    }
  }
};