

(function() {

  // var articleSchema = {
  //   properties: {
  //     invisible: { type: 'array', view: 'none' },
  //     image: { type: 'string', view: 'image' },
  //     title: { type: 'string' },
  //     author: { type: 'string' },
  //     choose: {
  //       'enum': ['hello', 'bye', 'noop']
  //     },
  //     content: {
  //       type: 'array',
  //       items: { properties: { value: { type: 'string' }}}
  //     },
  //     content2: {
  //       type: 'array',
  //       items: { anyOf: [
  //         { name: 'one', properties: { foo: { type: 'string' } }  },
  //         { name: 'two', properties: { bar: { type: 'boolean'} }  },
  //         { name: 'three', properties: { goo: { type: 'integer'} }  }
  //       ]}
  //     },
  //     foo: {
  //       type: 'object',
  //       properties: {
  //         bar: { type: 'number' },
  //         baz: { type: 'boolean'}
  //       }
  //     },
  //     notonmodel: { properties: { one: { type: 'string' }, two: { type: 'number' }}}
  //   }
  // };

  // var articleModel = {
  //   title: 'Hello COMODL',
  //   author: 'Some Dude',
  //   content: [
  //     { value: 'one' },
  //     { value: 'two' },
  //     { value: 'three' }
  //   ],
  //   content2: [
  //     { _type: 'two', bar: false },
  //     { _type: 'three', goo: 11 }
  //   ],
  //   foo: { bar: 42, baz: true }
  // };


  // var imageSchema = {
  //   view: 'image',
  //   properties: {
  //     title: { type: 'string' },
  //     caption: { type: 'string' },
  //     articles: {
  //       type: 'array',
  //       view: 'none',
  //       items: { type: 'string' }
  //     },
  //     galleries: {
  //       type: 'array',
  //       view: 'none',
  //       items: { type: 'string' }
  //     },
  //     files: {
  //       type: 'array',
  //       view: 'none',
  //       items: { type: 'string' }
  //     }
  //   }
  // };

  // var imageSchema = {
  //   properties: {
  //     title: { type: 'string' },
  //     file: { type: 'string', view: 'image' }
  //   }
  // };
  
  
  angular.module('testCoresAngular', ['cores.services', 'cores.directives'])
    .controller('AppCtrl', function($scope, cores) {
      // $scope.schema = articleSchema;
      // $scope.model = articleModel;
      // $scope.schema = imageSchema;
      // $scope.model = builder.createModel(imageSchema);

      cores.initialize().then(function() {
        console.log('cores intialized', cores);

        var resource = cores.getResource('Image');

        resource.schema().then(function(schema) {

          var model = cores.createModel(schema);
          
          console.log('schema', schema);
          console.log('model', model);

          $scope.type = resource.type;
          $scope.schema = schema;
          $scope.model = model;
        });
        
      });
    })
  ;
  
})();