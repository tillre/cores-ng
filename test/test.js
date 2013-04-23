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

  describe('builder', function() {
  
    var injector = angular.injector(['cores.directives', 'ng']);

    function buildFromSchema(schema, callback) {
      injector.invoke(function($rootScope, $compile, builder) {
        var scope = $rootScope;
        scope.schema = schema;
        scope.model = builder.createModel(schema);
        
        var elem = angular.element('<div cm-model model="model" schema="schema"/>');
        var link = $compile(elem);
        link(scope);
        scope.$digest();

        callback(scope, elem);
      });
    }

    it('should build boolean input', function(done) {
      buildFromSchema({ properties: { foo: { type: 'boolean' } } }, function(scope, elem) {
        expect(elem.find('input[type="checkbox"]').length).to.equal(1);
        done();
      });
    });

    it('should build integer input', function(done) {
      buildFromSchema({ properties: { foo: { type: 'integer' } } }, function(scope, elem) {
        expect(elem.find('input[type="integer"]').length).to.equal(1);
        done();
      });
    });

    it('should build number input', function(done) {
      buildFromSchema({ properties: { foo: { type: 'number' } } }, function(scope, elem) {
        expect(elem.find('input[type="number"]').length).to.equal(1);
        done();
      });
    });
  

    it('should build string input', function(done) {
      buildFromSchema({ properties: { foo: { type: 'string' } } }, function(scope, elem) {
        var input = elem.find('input[type="text"]');
        expect(input.length).to.equal(1);
        done();
      });
    });

    // it('should build object form', function(done) {
    //   var s = {
    //     properties: {
    //       foo: {
    //         properties: { bar: { type: string } }
    //       }
    //     }
    //   };
    //   buildFromSchema({ properties: { foo: { type: 'string' } } }, function(elem) {
    //     expect(elem.find('input[type="text"]').length).to.equal(1);
    //     done();
    //   });
    // });
    
  }); // builder
    
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