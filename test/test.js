
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


  describe('crCommon', function() {

    it('should get ids', inject(['crCommon'], function(crCommon) {
      assert(crCommon.getFileId() !== crCommon.getFileId());
      assert(crCommon.getModalId() !== crCommon.getModalId());
    }));
  });


  describe('crValidation', function() {

    var scope = {
      $emit: function(event, error) { assert(error === ':foo'); },
      $watch: function() {}
    };
    
    it('should set error', inject(['crValidation'], function(crValidation) {

      var validation = crValidation(scope);
      validation.setError('foo');

      assert(scope.hasErrors());
      assert(scope.hasError('foo'));
      assert(scope.getFirstError() === 'foo');
    }));

    it('should remove error', inject(['crValidation'], function(crValidation) {

      var validation = crValidation(scope);
      validation.setError('foo');
      validation.removeError('foo');

      assert(!scope.hasErrors());
      assert(!scope.hasError('foo'));
      assert(!scope.getFirstError());
    }));

    it('should add constraint', inject(['$rootScope', 'crValidation'], true, function($rootScope, crValidation, done) {

      var s = $rootScope.$new();
      s.model = true;
      s.$on('error:set', function(e, error) {
        assert(error === ':test');
        done();
      });

      var v = crValidation(s);
      v.addConstraint('test', function(value) {
        return value;
      }, true);

      s.model = false;
    }));
  });
  

  describe('crSchema', function() {

    var types = [
      { name: 'boolean',
        schema: { type: 'boolean' },
        value: true },
      { name: 'boolean default',
        schema: { type: 'boolean', default: false },
        value: false },
      { name: 'number',
        schema: { type: 'number' },
        value: 0 },
      { name: 'number default',
        schema: { type: 'number', default: 1.1 },
        value: 1.1 },
      { name: 'integer',
        schema: { type: 'integer' },
        value: 0 },
      { name: 'string',
        schema: { type: 'string' },
        value: '' },
      { name: 'string default',
        schema: { type: 'string', default: 'hello' },
        value: 'hello' },
      { name: 'enum',
        schema: { 'enum': [1, 2] },
        value: 1 },
      { name: 'enum default',
        schema: { 'enum': [1, 2], default: 2 },
        value: 2 },
      { name: 'ref',
        schema: { $ref: 'Foo' },
        value: {} },
      { name: 'ref default',
        schema: { $ref: 'Foo', default: { id: 'bar'} },
        value: { id: 'bar' } },
      { name: 'object',
        schema: { type: 'object' },
        value: {} },
      { name: 'object default',
        schema: { type: 'object', default: { foo: 'bar' } },
        value: { foo: 'bar'} },
      { name: 'object properties',
        schema: { type: 'object', properties: { foo: { type: 'string' } } },
        value: { foo: '' } },
      { name: 'array',
        schema: { type: 'array' },
        value: [] },
      { name: 'array default',
        schema: { type: 'array', default: [1, 2], value: [1, 2] },
        value: [1, 2] },
      { name: 'anyof',
        schema: { type: 'array', items: { anyOf: [] } },
        value: [] }
    ];

    types.forEach(function(type) {

      it('should create value', inject(['crSchema'], function(crSchema) {
        assert(JSON.stringify(crSchema.createValue(type.schema)) === JSON.stringify(type.value));
      }));
    });

    it('should recoginze private property on schemas', inject(['crSchema'], function(crSchema) {
      assert(crSchema.isPrivateProperty('_id'));
      assert(crSchema.isPrivateProperty('_rev'));
      assert(crSchema.isPrivateProperty('type_'));
      assert(crSchema.isPrivateProperty('foo') === false);
    }));

    it('should recognize array schema', inject(['crSchema'], function(crSchema) {
      assert(crSchema.isArraySchema({ type: 'array' }));
      assert(crSchema.isArraySchema({ items: { type: 'string' } }));
    }));

    it('should recognize object schema', inject(['crSchema'], function(crSchema) {
      assert(crSchema.isObjectSchema({ type: 'object' }));
      assert(crSchema.isObjectSchema({ properties: { foo: { type: 'number' } } }));
    }));
  });
  

  describe('crBuild', function() {

    var types = [
      { schema: { type: 'boolean' }, attr: 'cr-boolean' },
      { schema: { type: 'number' }, attr: 'cr-number' },
      { schema: { type: 'integer' }, attr: 'cr-number' },
      { schema: { type: 'string' }, attr: 'cr-string' },
      { schema: { 'enum': [1, 2] }, attr: 'cr-enum' },
      { schema: { $ref: 'Foo' }, attr: 'cr-ref' },
      { schema: { type: 'object' }, attr: 'cr-object' },
      { schema: { type: 'array' }, attr: 'cr-array' },
      { schema: { type: 'array', items: { anyOf: [] } }, attr: 'cr-anyof-array' }
    ];

    types.forEach(function(data) {

      it('should build element ' + data.attr, inject(['crBuild'], function(crBuild) {
        var tmpl = crBuild(data.schema);
        var elem = $(tmpl);
        assert(typeof elem.attr(data.attr) !== 'undefined');
      }));
    });
  });
  

  describe('crResources', function() {

    it('should init', inject(['crResources'], true, function(crResources, done) {
      crResources.init({ host: host }).then(
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

    var fooRes;
    var fooId = 'foo_' + (new Date().getTime());

    var fooDoc = {
      bar: 'Hello Foo'
    };
    
    it('should create', inject(['crResource'], function(crResource) {
      fooRes = new crResource('Foo', {
        path: '/foos',
        schemaPath: '/foos/_schema',
        viewPaths: { bars: '/foos/_views/bars' }
      }, host);
    }));


    it('should get the schema', inject(true, function(done) {
      fooRes.schema().then(
        function(s) {
          assert(s);
          done();
        },
        done
      );
    }));
    
    
    it('should save without id', inject(true, function(done) {
      fooRes.save(fooDoc).then(
        function(d) {
          assert(typeof d._id === 'string');
          assert(typeof d._rev === 'string');
          done();
        },
        done
      );
    }));

    
    it('should save with id', inject(true, function(done) {
      var doc2 = JSON.parse(JSON.stringify(fooDoc));
      doc2._id = fooId;
      fooRes.save(doc2).then(
        function(d) {
          assert(d._id === doc2._id);
          assert(typeof d._rev === 'string');
          done();
        },
        done
      );
    }));


    it('should load', inject(true, function(done) {
      fooRes.load(fooId).then(
        function(d) {
          assert(d._id === fooId);
          done();
        },
        done
      );
    }));


    it('should load all', inject(true, function(done) {
      fooRes.load().then(
        function(res) {
          assert(res.total_rows > 1);
          done();
        },
        done
      );
    }));


    it('should load all with params', inject(true, function(done) {
      fooRes.load({ limit: 1 }).then(
        function(res) {
          assert(res.total_rows > 1);
          assert(res.rows.length === 1);
          done();
        },
        done
      );
    }));
    
    
    it('should load and update', inject(true, function(done) {
      fooRes.load(fooId).then(
        function(d) {

          assert(typeof d._id === 'string');
          assert(typeof d._rev === 'string');
          d.bar = 'yoyoyo';

          fooRes.save(d).then(
            function(d2) {
              assert(d2._id === d._id);
              assert(d2._rev !== d._rev);
              assert(d2.bar === d.bar);
              done();
            },
            done
          );
        },
        done
      );
    }));


    it('should call the view', inject(true, function(done) {
      fooRes.view('bars').then(
        function(res) {
          assert(res.total_rows > 1);
          done();
        },
        done
      );
    }));


    it('should call the view with params', inject(true, function(done) {
      fooRes.view('bars', { limit: 1 }).then(
        function(res) {
          assert(res.total_rows > 1);
          assert(res.rows.length === 1);
          done();
        },
        done
      );
    }));


    it('should destroy', inject(true, function(done) {
      fooRes.load(fooId).then(
        function(d) {
          return fooRes.destroy(d._id, d._rev);
        }
      ).then(
        function() {
          return fooRes.load(fooId);
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

      var imageDoc = {
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

        crResources.get('Image').save(imageDoc, file).then(
          function(doc) {
            assert(doc);
            done();
          },
          done
        );
      }));

      
      it('should update multipart data', inject(['crResources'], true, function(crResources, done) {
        var res = crResources.get('Image');
        res.load(imageDoc._id).then(
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


      it('should save multiple files', inject(['crResources'], true, function(crResources, done) {
        var doc = {
          file0: '',
          file1: ''
        };
        var files = [file, file];

        crResources.get('Files').save(doc, files).then(
          function(doc) {
            assert(doc.file0 === 'foo.jpg');
            assert(doc.file1 === 'foo.jpg');
            done();
          },
          done
        );
      }));
    });
  });


  describe('crModelCtrl', function() {

    var fooDoc = {
      _id: 'model_' + (new Date().getTime()),
      bar: 'Hello Model'
    };
    
    var createCtrl = function($rootScope, $controller, type, id) {

      var scope = $rootScope.$new();
      scope.type = type;
      scope.data = { valid: true };
      if (id) scope.modelId = id;

      return { controller: $controller('crModelCtrl', { $scope: scope }), scope: scope };
    };

    before(inject(['crResources'], true, function(crResources, done) {
      crResources.get('Foo').save(fooDoc).then(
        function(doc) { done(); },
        done
      );
    }));
    
    
    it('should instantiate',
       inject(['$rootScope', '$controller'], true, function($rootScope, $controller, done) {

         var ctrl = createCtrl($rootScope, $controller, 'Foo').controller;
         assert(ctrl);

         $rootScope.$on('model:ready', function() {
           done();
         });
       }));


    it('should instantiate with id',
       inject(['$rootScope', '$controller'], true, function($rootScope, $controller, done) {

         var c = createCtrl($rootScope, $controller, 'Foo', fooDoc._id);
         assert(c.controller);

         var off = $rootScope.$on('model:ready', function() {
           off();
           assert(c.scope.model.bar === 'Hello Model');
           done();
         });
       }));


    it('should save',
       inject(['$rootScope', '$controller'], true, function($rootScope, $controller, done) {

         var c = createCtrl($rootScope, $controller, 'Foo');

         var off = $rootScope.$on('model:ready', function() {
           off();

           var model = c.scope.model;
           model.bar = 'Hello Mate';

           c.scope.save().then(function() {
             assert(c.scope.model._rev);
             done();
           }, done);
         });
       }));

    it('should update',
       inject(['$rootScope', '$controller'], true, function($rootScope, $controller, done) {

         var c = createCtrl($rootScope, $controller, 'Foo', fooDoc._id);

         var off = $rootScope.$on('model:ready', function() {
           off();

           var model = c.scope.model;
           model.bar = 'Hello Update';

           c.scope.$on('model:saved', function() {
             assert(c.scope.model.bar === 'Hello Update');
             done();
           });
           c.scope.save();
         });
       }));


    it('should save with files',
       inject(['$rootScope', '$controller'], true, function($rootScope, $controller, done) {

         var c = createCtrl($rootScope, $controller, 'Files');
         
         var file = JSON.stringify({
           name: 'foo.jpg',
           path: '/upload/foo.jpg',
           isTest: true
         });

         var off = $rootScope.$on('model:ready', function(e) {
           off();

           c.scope.$emit('file:set', 'f1', file);
           c.scope.$emit('file:set', 'f2', file);

           c.scope.$on('model:saved', function() {
             assert(c.scope.model.file0 === 'foo.jpg');
             assert(c.scope.model.file1 === 'foo.jpg');
             done();
           });
           c.scope.save();
         });
       }));

    it('should destroy',
       inject(['$rootScope', '$controller'], true, function($rootScope, $controller, done) {
         var c = createCtrl($rootScope, $controller, 'Foo', fooDoc._id);
         assert(c.controller);

         var off = $rootScope.$on('model:ready', function() {
           off();

           c.scope.$on('model:destroyed', function() {
             done();
           });
           c.scope.destroy();
         });
         
       }));
  });


  describe('directives', function() {

    var tests = [

      // Standard
      
      {
        type: 'Boolean',
        validate: function(schema, elem, done) {
          assert(elem.find('input[type="checkbox"]').length);
          done();
        }
      },
      {
        type: 'Integer',
        validate: function(schema, elem, done) {
          assert(elem.find('input[type="number"]').length);
          done();
        }
      },
      {
        type: 'Number',
        validate: function(schema, elem, done) {
          assert(elem.find('input[type="number"]').length);
          done();
        }
      },
      {
        type: 'String',
        validate: function(schema, elem, done) {
          assert(schema, elem.find('input[type="text"]').length);
          done();
        }
      },      {
        type: 'Enum',
        validate: function(schema, elem, done) {
          assert(elem.find('select').length);
          done();
        }
      },      {
        type: 'Object',
        validate: function(schema, elem, done) {
          assert(elem.find('.properties').find('input').length ===
                 Object.keys(schema.properties.foo.properties).length);
          done();
        }
      },      {
        type: 'Array',
        validate: function(schema, elem, done) {
          assert(elem.find('ul').length);
          done();
        }
      },      {
        type: 'Anyof',
        validate: function(schema, elem, done) {
          assert(elem.find('ul').length);
          done();
        }
      }

      // Custom

      // {
      //   type: 'Image',
      //   validate: function(schema, elem, done) {
      //     assert(elem.find('input[type="file"]').length);
      //     done();
      //   }
      // },
      // {
      //   type: 'Text',
      //   validate: function(schema, elem, done) {
      //     assert(elem.find('textarea').length);
      //     done();
      //   }
      // },
      // {
      //   type: 'Password',
      //   validate: function(schema, elem, done) {
      //     assert(elem.find('input[type="password"]').length === 2);
      //     done();
      //   }
      // }
      
      // Complex

      // {
      //   type: 'Complex',
      //   validate: function(schema, elem, done) {
      //     // TODO
      //     done();
      //   }
      // }
    ];
    

    tests.forEach(function(test) {

      it('should create directive ' + test.type, inject(['$compile', '$rootScope', 'crResources', 'crSchema'], true, function($compile, $rootScope, crResources, crSchema, done) {

        var self = this;
        var res = crResources.get(test.type);
        var schema;
        
        res.schema().then(
          function(s) {
            // get the schema
            schema = s;
            return crSchema.createValue(s);
          }
        ).then(
          function(model) {
            // save a default model
            return res.save(model);
          }
        ).then(
          function(doc) {

            // create the directive
            var scope = $rootScope.$new();
            scope.modelId = doc._id;
            scope.type = doc.type_;

            var cscope = scope.$new();
            var elem = angular.element('<div cr-model type="{{type}}" model-id="modelId"/>');
            $compile(elem)(cscope);

            $('body').append(elem);
            $('body').append($('<hr>'));

            // TODO Problems with ngswitch in model templates, dunno how to fix....
            
            // wait for ready event
            var isReady = false;
            var off = scope.$on('ready', function(e) {

              e.stopPropagation(); 
              assert(!isReady);
              isReady = true;
              test.validate(schema, elem, done);
            });
          },
          done
        );
      }));
    });
  });
});
