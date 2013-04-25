var expect = chai.expect;


// var schema = {
//   properties: {
//     boolean: { type: 'boolean' },
//     integer: { type: 'integer' },
//     number: { type: 'number' },
//     string: { type: 'string' },
//     stringarray: {
//       type: 'array',
//       items: { type: 'string' }
//     },
//     object: {
//       type: 'object',
//       properties: {
//         foo: { type: 'number' },
//         bar: { type: 'string' }
//       }
//     }
//   }
// };


describe('cores angular', function() {

  var injector = angular.injector(['cores', 'ng']);

  var cores;
  

  describe('services', function() {

    it('should initialize', function(done) {
      injector.invoke(function(cores) {
        cores.initialize('http://localhost:3333').then(done, done);
      });
    });


    it('should have the resources', function(done) {
      injector.invoke(function(cores) {
        expect(cores.getResource('Article')).to.be.a('object');
        expect(cores.getResource('Image')).to.be.a('object');
        done();
      });
    });


    it('should create default model', function(done) {
      injector.invoke(function(cores) {
        expect(cores.createModel({ type: 'boolean' })).to.be.a('boolean');
        expect(cores.createModel({ type: 'integer' })).to.be.a('number');
        expect(cores.createModel({ type: 'number' })).to.be.a('number');
        expect(cores.createModel({ type: 'string' })).to.be.a('string');

        var obj = cores.createModel({
          properties: {
            foo: { type: 'boolean' }, bar: { type: 'number'}
          }
        });
        expect(obj).to.be.a('object');
        expect(obj.foo).to.be.a('boolean');
        expect(obj.bar).to.be.a('number');

        expect(cores.createModel({ items: { type: 'string' }})).to.be.a('array');
        
        done();
      });
    });
    
    it('should build the template', function(done) {
      injector.invoke(function(cores) {
        var schema = { properties: {
          foo: { type: 'boolean' }, bar: { type: 'number' }
        }};
        var model = cores.createModel(schema);
        var template = cores.buildTemplate(schema, model);

        expect(template.match('cr-object').length).to.equal(1);
        expect(template.match('model="model"').length).to.equal(1);
        expect(template.match('schema="schema"').length).to.equal(1);
        
        console.log('template', template);
        done();
      });
    });
  });


  describe('resource', function() {

    
    
  });
  
  
  describe('directives', function() {
  
    function buildFromSchema(schema, value, callback) {

      if (typeof value === 'function') {
        callback = value;
        value = null;
      }
      
      injector.invoke(function($rootScope, $compile, cores) {
        var scope = $rootScope.$new();
        scope.schema = schema;
        scope.model = value || cores.createModel(schema);

        var elem = angular.element('<div cr-model model="model" schema="schema"/>');
        $compile(elem)(scope);
        scope.$apply();

        $('body').append(elem);
        $('body').append($('<hr>'));
        
        callback(scope, elem);
      });
    }

    
    it('should build boolean input', function(done) {
      buildFromSchema({properties: { test: { type: 'boolean' }}}, function(scope, elem) {
        expect(elem.find('input[type="checkbox"]').length).to.equal(1);
        done();
      });
    });

    
    it('should build integer input', function(done) {
      buildFromSchema({ properties: { test: { type: 'integer' }}}, function(scope, elem) {
        expect(elem.find('input[type="number"]').length).to.equal(1);
        done();
      });
    });

    
    it('should build number input', function(done) {
      buildFromSchema({ properties: { test: { type: 'number' }}}, function(scope, elem) {
        expect(elem.find('input[type="number"]').length).to.equal(1);
        done();
      });
    });

    
    it('should build string input', function(done) {
      buildFromSchema({ properties: { test: { type: 'string' }}}, function(scope, elem) {
        expect(elem.find('input[type="text"]').length).to.equal(1);
        done();
      });
    });

    
    it('should build enum form', function(done) {
      buildFromSchema(
        { properties: { test: { type: 'string', 'enum': ['one', 'two', 'three'] }}},
        function(scope, elem) {
          expect(elem.find('option').length).to.equal(3);
          done();
        }
      );
    });

    
    it('should build object form', function(done) {
      buildFromSchema(
        { properties: { foo: { type: 'string'}, bar: { type: 'number'} } },
        function(scope, elem) {
          expect(elem.find('input[type="text"]').length).to.equal(1);
          expect(elem.find('input[type="number"]').length).to.equal(1);
          done();
        });
    });

    
    it('should build array form', function(done) {
      buildFromSchema(
        { items: { properties: { foo: { type: 'string'}}}},
        [ {foo:'a'}, {foo:'b'}, {foo:'c'} ],

        function(scope, elem) {
          expect(elem.find('input[type="text"]').length).to.equal(3);
          done();
        }
      );
    });

    
    it('should build anyOf form', function(done) {
      buildFromSchema(
        { items: { anyOf: [
          { name: 'one', properties: { foo: { type: 'string' }}},
          { name: 'two', properties: { bar: { type: 'number' }}}
        ]}},
        [ { type_: 'one', foo: 'hello' }, { type_: 'two', bar: 42 }],
        function(scope, elem) {
          expect(elem.find('input[type="text"]').length).to.equal(1);
          expect(elem.find('input[type="number"]').length).to.equal(1);
          done();
        }
      );
    });


    // it('should build image form', function(done) {
    //   cores.getResource('Image').schema().then(
    //     function(schema) {
    //       buildFromSchema(schema, function(scope, elem) {
    //         console.log(elem[0]);
    //         done();
    //       });
    //     },
    //     done
    //   );
    //   // buildFromSchema(
    //   //   { properties: {
    //   //     file: {
    //   //       view: 'image',
    //   //       properties: {
    //   //         name: { type: 'string' },
    //   //         url: { type: 'string' }
    //   //       }
    //   //     }
    //   //   }},
    //   //   function(scope, elem) {
    //   //     console.log(elem[0]);
    //   //     done();
    //   //   }
    //   // );
    // });
  }); // build


  
});

// describe('cores angular', function() {

//   var cores;
//   var doc = {
//     type: 'Article',
//     title: 'Some Article',
//     author: {
//       firstname: 'Balou',
//       lastname: 'The Bear'
//     },
//     tags: ['one', 'two'],
//     body: 'The actual body...'
//   };
  
  
//   before(function() {
//     angular.module('comodlTest', ['http']);
//   });


//   describe('service', function() {
  
//     it('should get the service from injector', function() {
//       var $injector = angular.injector(['comodl.services', 'ng']);
//       comodl = $injector.get('comodl');
//       expect(comodl).to.be.a('object');
//     });


//     it('should save a document', function(done) {
//       comodl.save(doc, function(err, d) {
//         expect(err).to.not.exist;
//         expect(d._id).to.be.a('string');
//         expect(d._rev).to.be.a('string');
//         doc = d;
//         done();
//       });
//     });

    
//     it('should save an updated document', function(done) {
//       doc.title = 'New Content';
//       comodl.save(doc, function(err, d) {
//         expect(err).to.not.exist;
//         expect(d._id).to.equal(doc._id);
//         expect(d._rev).to.not.equal(doc._rev);
//         doc = d;
//         done();
//       });
//     });

    
//     it('should get the document', function(done) {
//       comodl.load('Article', doc._id, function(err, d) {
//         expect(err).to.not.exist;
//         expect(d._id).to.equal(doc._id);
//         expect(d._rev).to.equal(doc._rev);
//         done();
//       });
//     });


//     it('should call the all view', function(done) {
//       comodl.view('Article', 'all', function(err, docs) {
//         expect(err).to.not.exist;
//         expect(docs).to.be.a('array');
//         expect(docs.length).to.equal(1);
//         done();
//       });
//     });


//     it('should call the titles view', function(done) {
//       comodl.view('Article', 'titles', function(err, titles) {
//         expect(err).to.not.exist;
//         expect(titles).to.be.a('array');
//         expect(titles.length).to.equal(1);
//         expect(titles[0]).to.equal('New Content');
//         done();
//       });
//     });
    
    
//     it('should destroy a document', function(done) {
//       comodl.destroy(doc, function(err) {
//         expect(err).to.not.exist;
//         done();
//       });
//     });


//     it('should not get a non existant document', function(done) {
//       comodl.load('Article', doc._id, function(err, d) {
//         expect(err).to.exist;
//         expect(err.code).to.equal(404);
//         done();
//       });
//     });
//   });
// });