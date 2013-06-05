
var assert = chai.assert;


describe('cores', function() {

  var injector = angular.injector(['cores', 'ng']);

  var host = 'http://localhost:3333';

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


  describe('crResources', function() {

    it('should init', inject(['crResources'], true, function(crResources, done) {
      crResources.init(host).then(
        function(resources) {
          assert(angular.isObject(resources));
          assert(resources.hasOwnProperty('Boolean'));
          assert(resources.hasOwnProperty('String'));
          assert(resources.hasOwnProperty('Object'));
          done();
        },
        done
      );
    }));

    it('should get a single id', inject(['crResources'], true, function(crResources, done) {
      crResources.getIds().then(
        function(ids) {
          assert(ids.length === 1);
          done();
        },
        done
      );
    }));

    it('should get a some ids', inject(['crResources'], true, function(crResources, done) {
      crResources.getIds(5).then(
        function(ids) {
          assert(ids.length === 5);
          done();
        },
        done
      );
    }));

    it('should get the resource', inject(['crResources'], function(crResources) {
      assert(crResources.get('Boolean').type === 'Boolean');
      assert(crResources.get('Number').type === 'Number');
    }));
  });


  describe('crResource', function() {

    var res;
    var customId = 'id_' + (new Date().getTime());
    
    var doc = {
      title: 'Hello Article',
      author: { firstname: 'No', lastname: 'Mono' },
      content: 'Bla bla bla'
    };

    
    it('should create', inject(['crResource'], function(crResource) {
      res = new crResource('Article', {
        path: '/articles',
        schemaPath: '/articles/_schema',
        viewPaths: { titles: '/articles/_views/titles' }
      }, {
        host: host
      });
    }));

    
    it('should save without id', inject(true, function(done) {
      res.save(doc).then(
        function(d) {
          assert(typeof d._id === 'string');
          assert(typeof d._rev === 'string');
          done();
        },
        done
      );
    }));

    
    it('should save with id', inject(true, function(done) {
      var doc2 = JSON.parse(JSON.stringify(doc));
      doc2._id = customId;
      res.save(doc2).then(
        function(d) {
          assert(d._id === doc2._id);
          assert(typeof d._rev === 'string');
          done();
        },
        done
      );
    }));


    it('should load', inject(true, function(done) {
      res.load(customId).then(
        function(d) {
          assert(d._id === customId);
          done();
        },
        done
      );
    }));


    it('should load all', inject(true, function(done) {
      res.load().then(
        function(res) {
          assert(res.total_rows > 1);
          done();
        },
        done
      );
    }));


    it('should load all with params', inject(true, function(done) {
      res.load({ limit: 1 }).then(
        function(res) {
          assert(res.total_rows > 1);
          assert(res.rows.length === 1);
          done();
        },
        done
      );
    }));
    
    
    it('should load and update', inject(true, function(done) {
      res.load(customId).then(
        function(d) {

          assert(typeof d._id === 'string');
          assert(typeof d._rev === 'string');
          d.title = 'yoyoyo';

          res.save(d).then(
            function(d2) {
              assert(d2._id === d._id);
              assert(d2._rev !== d._rev);
              assert(d2.title === d.title);
              done();
            },
            done
          );
        },
        done
      );
    }));


    it('should call the view', inject(true, function(done) {
      res.view('titles').then(
        function(res) {
          assert(res.total_rows > 1);
          done();
        },
        done
      );
    }));


    it('should call the view with params', inject(true, function(done) {
      res.view('titles', { limit: 1 }).then(
        function(res) {
          assert(res.total_rows > 1);
          assert(res.rows.length === 1);
          done();
        },
        done
      );
    }));


    it('should destroy', inject(true, function(done) {
      res.load(customId).then(
        function(d) {
          return res.destroy(d._id, d._rev);
        }
      ).then(
        function() {
          return res.load(customId);
        }
      ).then(
        function() {
          done(new Error('Should not exist'));
        },
        function(err) {
          assert(err);
          done();
        }
      );
    }));

    
    describe('multipart', function() {

      var doc = {
        _id: 'multipart_' + (new Date().getTime()),
        title: 'Some image',
        file: { name: 'test.jpg', url: '' }
      };

      var file = JSON.stringify({
        name: 'foo.jpg',
        path: '/upload/foo.jpg',
        isTest: true
      });

      
      it('should save multipart data', inject(['crResources'], true, function(crResources, done) {
        crResources.get('Image').save(doc, file).then(
          function(doc) {
            assert(doc);
            done();
          },
          done
        );
      }));

      
      it('should update multipart data', inject(['crResources'], true, function(crResources, done) {
        var res = crResources.get('Image');

        res.load(doc._id).then(
          function(doc) {
            doc.title = 'Im Multiman';

            res.save(doc, file).then(
              function(doc) {
                assert(doc);
                done();
              },
              done
            );
          },
          done
        );
      }));

      // ////////////////////////////////////////
      // TODO !!! multiple files 
      // ////////////////////////////////////////
      
      
      // it('should save multiple files', inject(['crResources'], true, function(crResources, done) {
      //   var doc2 = JSON.parse(JSON.stringify(doc));
      //   doc2._id += 2;
      //   var files = [file, file];

      //   res.save(doc2, files).then(
      //     function(res) {
      //       console.log(res);
      //     },
      //     done
      //   );
      // }));
    });
  });


  


  describe('directives', function() {

    return;
    
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


