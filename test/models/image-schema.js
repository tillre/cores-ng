module.exports = {

  name: 'Image',
  
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