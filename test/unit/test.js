
var assert = chai.assert;


describe('cores', function() {

  var injector = angular.injector(['cores', 'ng']);

  //
  // gets the dependencies and triggers a digest cycle on the rootscope
  //
  // (deps, async, callback(done))
  // (deps, callback)
  // (async, callback(done))
  //
  
  function inject(deps, async, callback) {

    if (typeof deps === 'function') {
      callback = deps;
      deps = [];
      async = false;
    }

    if (typeof deps === 'boolean') {
      callback = async;
      async = deps;
      deps = [];
    }
    
    if (typeof async === 'function') {
      callback = async;
      async = false;
    }

    var run;
    
    deps.unshift('$rootScope');
    injector.invoke(deps.concat(function($rootScope) {

      var args = Array.prototype.slice.call(arguments, 1);
      
      if (async) {
        run = function(done) {
          args.push(done);
          callback.apply(null, args);
          $rootScope.$apply();
        };
      }
      else {
        run = function() {
          callback.apply(null, args);
          $rootScope.$apply();
        };
      }
      
    }));

    return run;
  };
  

  describe('api', function() {

    it('should have api defined', inject(['cores'], function(cores) {
      assert(angular.isObject(cores));
      assert(angular.isFunction(cores.initialize));
      assert(angular.isFunction(cores.getResource));
      assert(angular.isFunction(cores.createModel));
      assert(angular.isFunction(cores.buildTemplate));
    }));

    
    it('should initialize', inject(['cores'], true, function(cores, done) {
      cores.initialize('http://localhost:3333').then(done, done);
    }));

    it('should get a id', inject(['cores'], true, function(cores, done) {
      cores.getIds().then(
        function(ids) {
          assert(ids.uuids.length === 1);
          done();
        },
        done
      );
    }));

    it('should have the resources', inject(['cores'], function(cores) {
      assert(angular.isObject(cores.getResource('Article')));
      assert(angular.isObject(cores.getResource('Image')));
    }));


    it('should create default model', inject(['cores'], function(cores) {
      assert(typeof cores.createModel({ type: 'boolean' }) === 'boolean');
      assert(angular.isNumber(cores.createModel({ type: 'integer' })));
      assert(angular.isNumber(cores.createModel({ type: 'number' })));
      assert(angular.isString(cores.createModel({ type: 'string' })));
      
      var obj = cores.createModel({
        properties: {
          foo: { type: 'boolean' }, bar: { type: 'number'}
        }
      });
      assert(angular.isObject(obj));
      assert(typeof obj.foo === 'boolean');
      assert(angular.isNumber(obj.bar));

      var arr = cores.createModel({ items: { type: 'string' }});
      assert(angular.isArray(arr));
    }));

    
    it('should build the template', inject(['cores'], function(cores) {
      var schema = { properties: {
        foo: { type: 'boolean' }, bar: { type: 'number' }
      }};
      var model = cores.createModel(schema);
      var template = cores.buildTemplate(schema, model);

      assert(template.match('cr-object').length === 1);
      assert(template.match('model="model"').length === 1);
      assert(template.match('schema="schema"').length === 1);
    }));
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


    before(inject(['cores'], true, function(cores, done) {
      articleRes = cores.getResource('Article');
      imageRes = cores.getResource('Image');
      done();
    }));

    it('should get the schema', inject(true, function(done) {
      articleRes.schema().then(
        function(schema) {
          assert(angular.isObject(schema));
          assert(angular.isObject(schema.properties));
          done();
        },
        done
      );
    }));

    
    it('should save the doc', inject(true, function(done) {
      articleRes.save(articleDoc).then(
        function(doc) {
          assert(angular.isObject(doc));
          assert(angular.isString(doc._id));
          assert(angular.isString(doc._rev));

          savedArticle = doc;
          
          done();
        },
        done
      );
    }));

    
    it('should save another doc', inject(true, function(done) {
      articleRes.save(articleDoc).then(
        function(doc) {
          assert(angular.isObject(doc));
          done();
        },
        done
      );
    }));


    it('should update the doc', inject(true, function(done) {
      savedArticle.title = 'New Title';
      
      articleRes.save(savedArticle).then(
        function(doc) {
          assert(doc._id === savedArticle._id);
          assert(doc._rev !== savedArticle._rev);
          assert(doc.title === 'New Title');

          savedArticle = doc;
          
          done();
        },
        done
      );
    }));

    
    it('should return error when doc not valid', inject(true, function(done) {
      articleDoc.title = '';
      articleRes.save(articleDoc).then(
        done(),
        function(err) {
          assert()
          expect(err).to.exist;
          expect(err.message === 'Validation failed').to.be(true);

          articleDoc.title = 'Some Title';
          
          done();
        }
      );
      done();
    }));

    
    it('should save multipart doc', inject(true, function(done) {
      var fd = new FormData();
      fd.append('type_', fileDoc.type_);
      fd.append('doc', JSON.stringify(fileDoc));
      fd.append('file', JSON.stringify({ name: 'foo.jpg', path: '/upload/foo.jpg', isTest: true }));

      imageRes.save(fd).then(
        function(doc) {
          assert(angular.isObject(doc));
          assert(angular.isString(doc._id));
          assert(angular.isString(doc._rev));
          assert(doc.file.url === '/upload/foo.jpg');
          
          savedImage = doc;
          
          done();
        },
        done
      );
    }));

    
    it('should update multipart doc', inject(true, function(done) {
      var fd = new FormData();
      fd.append('type_', savedImage.type_);
      fd.append('doc', JSON.stringify(savedImage));
      fd.append('file', JSON.stringify({ name: 'bar.jpg', path: '/upload/bar.jpg', isTest: true}));

      imageRes.save(fd).then(
        function(doc) {
          assert(doc._id === savedImage._id);
          assert(doc._rev !== savedImage._rev);
          assert(doc.file.url === '/upload/bar.jpg');

          savedImage = doc;

          done();
        },
        done
      );
    }));


    it('should load all docs', inject(true, function(done) {
      articleRes.load().then(
        function(result) {
          assert(result.total_rows > 1);
          done();
        },
        done
      );
    }));


    it('should load all docs with params', inject(true, function(done) {
      articleRes.load({ limit: 1 }).then(
        function(result) {
          assert(result.total_rows > 1);
          assert(result.rows.length === 1);
          done();
        },
        done
      );
    }));
    
    
    it('should load the doc', inject(true, function(done) {
      articleRes.load(savedArticle._id).then(
        function(doc) {
          assert(doc._id === savedArticle._id);
          assert(doc._rev === savedArticle._rev);
          done();
        },
        done
      );
    }));

    
    it('should call the view', inject(true, function(done) {
      articleRes.view('titles').then(
        function(result) {
          assert(result.total_rows > 1);
          assert(result.rows.length > 1);
          done();
        },
        done
      );
    }));

    
    it('should call the view with params', inject(true, function(done) {
      articleRes.view('titles', { limit: 1 }).then(
        function(result) {
          assert(result.total_rows > 1);
          assert(result.rows.length === 1);
          done();
        },
        done
      );
    }));

    
    it('should destroy the doc', inject(true, function(done) {
      articleRes.destroy(savedArticle).then(done, done);
    }));

    
    it('should not load destroyed doc', inject(true, function(done) {
      articleRes.load(savedArticle._id).then(
        function(doc) {
          assert(false);
          done();
        },
        function() {
          done();
        }
      );
    }));
  });


  describe('directives', function() {

    function buildFromSchema(type, model, callback) {

      if (typeof model === 'function') {
        callback = model;
        model = null;
      }
      
      injector.invoke(function($rootScope, $compile, cores) {
        var scope = $rootScope.$new();
        if (model) {
          scope.model = model;
        }
        var elem = angular.element('<div cr-model type="' + type + '" model="model"/>');
        
        $compile(elem)(scope);
        scope.$apply();

        $('body').append(elem);
        $('body').append($('<hr>'));

        var offready = scope.$on('ready', function() {
          offready();
          callback(scope, elem);
        });
      });
    }

    
    it('should build boolean input', function(done) {
      buildFromSchema('Boolean', function(scope, elem) {
        assert(elem.find('input[type="checkbox"]').length === 1);
        done();
      });
    });

    
    it('should build integer input', function(done) {
      buildFromSchema('Integer', function(scope, elem) {
        assert(elem.find('input[type="number"]').length === 1);
        done();
      });
    });

    
    it('should build number input', function(done) {
      buildFromSchema('Number', function(scope, elem) {
        assert(elem.find('input[type="number"]').length === 1);
        done();
      });
    });

    
    it('should build string input', function(done) {
      buildFromSchema('String', function(scope, elem) {
        assert(elem.find('input[type="text"]').length === 1);
        done();
      });
    });

    
    it('should build enum form', function(done) {
      buildFromSchema('Enum', function(scope, elem) {
        assert(elem.find('select').length === 1);
        done();
      });
    });

    
    it('should build object form', function(done) {
      buildFromSchema(
        'Object',
        function(scope, elem) {
          assert(elem.find('input[type="text"]').length === 1);
          assert(elem.find('input[type="number"]').length === 1);
          done();
        });
    });

    it('should build array form', function(done) {
      buildFromSchema(
        'Array',
        { foo: [ {bar:'a'}, {bar:'b'}, {bar:'c'} ] },

        function(scope, elem) {
          assert(elem.find('ul').length === 1);
          done();
        }
      );
    });

    
    it('should build anyOf array', function(done) {
      buildFromSchema(
        'Anyof',
        [ { type_: 'one', foo: 'hello' }, { type_: 'two', bar: 42 }],

        function(scope, elem) {
          assert(elem.find('ul'));
          done();
        }
      );
    });
    
  });
});


//     // it('should build image form', function(done) {
//     //   cores.getResource('Image').schema().then(
//     //     function(schema) {
//     //       buildFromSchema(schema, function(scope, elem) {
//     //         console.log(elem[0]);
//     //         done();
//     //       });
//     //     },
//     //     done
//     //   );
//     //   // buildFromSchema(
//     //   //   { properties: {
//     //   //     file: {
//     //   //       view: 'image',
//     //   //       properties: {
//     //   //         name: { type: 'string' },
//     //   //         url: { type: 'string' }
//     //   //       }
//     //   //     }
//     //   //   }},
//     //   //   function(scope, elem) {
//     //   //     console.log(elem[0]);
//     //   //     done();
//     //   //   }
//     //   // );
//     // });


