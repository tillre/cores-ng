var js = require('jski');

module.exports = js.object({

  title: js.string(),

  items: js.array(js.object({
    category: js.ref('Category').custom('view', { type: 'model-select-ref', property: 'title' })
  }))
});