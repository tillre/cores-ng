module.exports = {

  name: 'Article',
  
  properties: {
    title: { type: 'string', minLength: 1 },
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


