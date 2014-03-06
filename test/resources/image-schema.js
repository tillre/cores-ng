var J = require('jski')();

module.exports = function(context) {

  return J.object({

    title: J.string(),

    file: J.object({
      name: J.string(),
      url: J.string()
    }).custom('view', { type: 'cr-image', baseUrl: context.imagesUrl })

  });
};