

(function() {

  var articleSchema = {
    properties: {
      invisible: { type: 'array', view: 'none' },
      image: { type: 'string', view: 'image' },
      title: { type: 'string' },
      author: { type: 'string' },
      choose: {
        'enum': ['hello', 'bye', 'noop']
      },
      content: {
        type: 'array',
        items: { type: 'string' }
      },
      content2: {
        type: 'array',
        items: { anyOf: [
          { name: 'one', properties: { foo: { type: 'number' } }  },
          { name: 'two', properties: { bar: { type: 'boolean'} }  },
          { name: 'three', properties: { goo: { type: 'integer'} }  }
        ]}
      },
      foo: {
        type: 'object',
        properties: {
          bar: { type: 'number' },
          baz: { type: 'boolean'}
        }
      },
      notonmodel: { properties: { one: { type: 'string' }, two: { type: 'number' }}}
    }
  };

  var articleModel = {
    title: 'Hello COMODL',
    author: 'Some Dude',
    content: ['one', 'two', 'three'],
    content2: [
      { _type: 'two', bar: 11 },
      { _type: 'three', goo: false }
    ],
    foo: { bar: 42, baz: true }
  };


  var imageSchema = {
    view: 'image',
    properties: {
      title: { type: 'string' },
      caption: { type: 'string' },
      articles: {
        type: 'array',
        view: 'none',
        items: { type: 'string' }
      },
      galleries: {
        type: 'array',
        view: 'none',
        items: { type: 'string' }
      },
      files: {
        type: 'array',
        view: 'none',
        items: { type: 'string' }
      }
    }
  };

  
  angular.module('testComodlAngular', ['comodl.directives'])
    .controller('AppCtrl', function($scope) {
      $scope.schema = articleSchema;
      $scope.model = articleModel;
      // $scope.schema = imageSchema;
      // $scope.model = builder.createModel(imageSchema);
    })
  ;
  
})();