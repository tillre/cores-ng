var expect = chai.expect;



var schema = {
  properties: {
    boolean: { type: 'boolean' },
    integer: { type: 'integer' },
    number: { type: 'number' },
    string: { type: 'string' },
    stringarray: {
      type: 'array',
      items: { type: 'string' }
    },
    object: {
      type: 'object',
      properties: {
        foo: { type: 'number' },
        bar: { type: 'string' }
      }
    }
  }
};


// var AppCtrl = function($scope, builder) {
//   $scope.schema = schema;
//   $scope.model = builder.createModel(schema);
// };


describe('cores angular', function() {

  describe('build', function() {
  
    var injector = angular.injector(['cores.directives', 'ng']);

    
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
        scope.$digest();

        callback(scope, elem);
      });
    }

    
    it('should build boolean input', function(done) {
      buildFromSchema({ type: 'boolean' }, function(scope, elem) {
        expect(elem.find('input[type="checkbox"]').length).to.equal(1);
        done();
      });
    });

    it('should build integer input', function(done) {
      buildFromSchema({ type: 'integer' }, function(scope, elem) {
        expect(elem.find('input[type="number"]').length).to.equal(1);
        done();
      });
    });

    it('should build number input', function(done) {
      buildFromSchema({ type: 'number' }, function(scope, elem) {
        expect(elem.find('input[type="number"]').length).to.equal(1);
        done();
      });
    });
  
    it('should build string input', function(done) {
      buildFromSchema({ type: 'string' }, function(scope, elem) {
        expect(elem.find('input[type="text"]').length).to.equal(1);
        done();
      });
    });

    it('should build enum form', function(done) {
      buildFromSchema(
        { type: 'string', 'enum': ['one', 'two', 'three'] },
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
        {items: { properties: { foo: { type: 'string'}}}},
        [ {foo:'a'}, {foo:'b'}, {foo:'c'} ],

        function(scope, elem) {
          expect(elem.find('input[type="text"]').length).to.equal(3);
          done();
        }
      );
    });

    it('should build anyOf form', function(done) {
      buildFromSchema(
        {items: { anyOf: [
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