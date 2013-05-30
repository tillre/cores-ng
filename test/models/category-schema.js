var js = require('jski');

module.exports = js.object({

  title: js.string(),
  slug: js.string()
  
}).required(['title', 'slug']);