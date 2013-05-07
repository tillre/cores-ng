module.exports = {
  properties: {
    foo: {
      type: 'array',
      items: {
        anyOf: [
          { properties: { bar: 'number' } },
          { properties: { baz: 'boolean'} }
        ]
      }
    }
  }
};