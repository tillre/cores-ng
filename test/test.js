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
        
        done();
      });
    });
  });


  describe('resource', function() {

    var articleDoc = {
      type_: 'Article',
      title: 'Some Title',
      author: { firstname: 'Bob', lastname: 'Bobsen' },
      tags: [],
      body: []
    };
    var fileDoc = {
      title: 'Some Image',
      file: { name: 'test.jpg', url: '' }
    };

    var savedArticle, savedImage;
    var articleRes, imageRes;

    
    before(function(done) {
      injector.invoke(function(cores) {
        articleRes = cores.getResource('Article');
        imageRes = cores.getResource('Image');
        done();
      });
    });

    
    it('should get the schema', function(done) {
      articleRes.schema().then(
        function(schema) {
          expect(schema).to.be.a('object');
          expect(schema.name).to.equal('Article');
          expect(schema.properties).to.be.a('object');
          done();
        },
        done
      );
    });

    
    it('should save the doc', function(done) {
      articleRes.save(articleDoc).then(
        function(doc) {
          expect(doc).to.be.a('object');
          expect(doc._id).to.be.a('string');
          expect(doc._rev).to.be.a('string');

          savedArticle = doc;
          
          done();
        },
        done
      );
    });

    
    it('should save another doc', function(done) {
      articleRes.save(articleDoc).then(
        function(doc) {
          expect(doc._id).to.be.a('string');
          expect(doc._id).to.not.equal(savedArticle._id);
          done();
        },
        done
      );
    });

    
    it('should update the doc', function(done) {
      savedArticle.title = 'New Title';
      
      articleRes.save(savedArticle).then(
        function(doc) {
          expect(doc._id).to.equal(savedArticle._id);
          expect(doc._rev).to.not.equal(savedArticle._rev);
          expect(doc.title).to.equal('New Title');

          savedArticle = doc;
          
          done();
        },
        done
      );
    });

    
    it('should return error when doc not valid', function(done) {
      articleDoc.title = '';
      articleRes.save(articleDoc).then(
        done(),
        function(err) {
          expect(err).to.exist;
          expect(err.message === 'Validation failed').to.be(true);

          articleDoc.title = 'Some Title';
          
          done();
        }
      );
      done();
    });

    
    it('should save multipart doc', function(done) {
      var fd = new FormData();
      fd.append('type_', fileDoc.type_);
      fd.append('doc', JSON.stringify(fileDoc));
      fd.append('file', JSON.stringify({ name: 'foo.jpg', path: '/upload/foo.jpg', isTest: true }));

      imageRes.save(fd).then(
        function(doc) {
          expect(doc).to.be.a('object');
          expect(doc._id).to.be.a('string');
          expect(doc._rev).to.be.a('string');
          expect(doc.file.url).to.equal('/upload/foo.jpg');
          
          savedImage = doc;
          
          done();
        },
        done
      );
    });

    
    it('should update multipart doc', function(done) {
      var fd = new FormData();
      fd.append('type_', savedImage.type_);
      fd.append('doc', JSON.stringify(savedImage));
      fd.append('file', JSON.stringify({ name: 'bar.jpg', path: '/upload/bar.jpg', isTest: true}));

      imageRes.save(fd).then(
        function(doc) {
          expect(doc._id).to.equal(savedImage._id);
          expect(doc._rev).to.not.equal(savedImage._rev);
          expect(doc.file.url).to.equal('/upload/bar.jpg');

          savedImage = doc;

          done();
        },
        done
      );
    });

    
    it('should load the doc', function(done) {
      articleRes.load(savedArticle._id).then(
        function(doc) {
          expect(doc._id).to.equal(savedArticle._id);
          expect(doc._rev).to.equal(savedArticle._rev);
          done();
        },
        done
      );
    });

    
    it('should call the view', function(done) {
      articleRes.view('titles').then(
        function(result) {
          expect(result.total_rows).to.be.above(1);
          expect(result.rows.length).to.be.above(1);
          done();
        },
        done
      );
    });

    
    it('should call the view with params', function(done) {
      articleRes.view('titles', { limit: 1 }).then(
        function(result) {
          expect(result.total_rows).to.be.above(1);
          expect(result.rows.length).to.be.equal(1);
          done();
        },
        done
      );
    });

    
    it('should destroy the doc', function(done) {
      articleRes.destroy(savedArticle).then(done, done);
    });

    
    it('should not load destroyed doc', function(done) {
      articleRes.load(savedArticle._id).then(
        function(doc) {
          expect(doc).to.not.exist;
          done();
        },
        function() {
          done();
        }
      );
    });
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
