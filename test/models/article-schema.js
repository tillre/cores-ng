module.exports = {

  properties: {

    image: {
      $ref: 'Image',
      view: {
        preview: 'cr-image-preview'
      }
    },
    
    title: { type: 'string', minLength: 1 },
    publish: { type: 'boolean' },
    draft: { type: 'boolean', default: false },
    seconds: { type: 'integer' },
    average: { type: 'number' },
    choose: { type: 'string', 'enum': ['one', 'two', 'three'] },
    author: {
      properties: {
        firstname: { type: 'string'},
        lastname: { type: 'string' }
      }
    },
    tags: {
      items: {
        properties: { name: {type: 'string' }}
      }
    },
    content: { type: 'string', view: 'text' },
    body: {
      items: {
        anyOf: [
          {
            name: 'paragraph',
            properties: {
              text: { type: 'string' }
            }
          },
          {
            name: 'doit',
            properties: {
              check: { type: 'boolean' }
            }
          }
        ]
      }
    }
  },
  required: ['title', 'author', 'body']
};


