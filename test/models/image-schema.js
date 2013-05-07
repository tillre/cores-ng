module.exports = {

  properties: {
    title: { type: 'string' },
    file: {
      type: 'object',
      view: 'image',
      properties: {
        name: { type: 'string' },
        url: { type: 'string' }
      }
    }
  }
};