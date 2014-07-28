
var assert = chai.assert;


describe('cores', function() {

  var injector = angular.injector(['cores', 'ng']);

  var apiUrl = 'http://localhost:3333';

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
      assert(crCommon.createFileId() !== crCommon.createFileId());
      assert(crCommon.createModalId() !== crCommon.createModalId());
    }));

    it('should create slug', inject(['crCommon'], function(crCommon) {
      assert(crCommon.slugify(' Hällö Würld ') === 'haelloe-wuerld');
    }));

    it('should capitalize string', inject(['crCommon'], function(crCommon) {
      assert(crCommon.capitalize('hello') === 'Hello');
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


  describe('crResources', function() {

    it('should init', inject(['crResources'], true, function(crResources, done) {
      crResources.init({ url: apiUrl }).then(
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
      name: 'Hello Foo', slug: 'hello-foo'
    };

    it('should create', inject(['crResource'], function(crResource) {
      fooRes = new crResource('Foo', {
        path: '/foos',
        schemaPath: '/foos/_schema',
        viewPaths: { names: '/foos/_views/names' }
      }, apiUrl);
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
      fooRes.view('names').then(
        function(res) {
          assert(res.total_rows > 1);
          done();
        },
        done
      );
    }));


    it('should call the view with params', inject(true, function(done) {
      fooRes.view('names', { limit: 1 }).then(
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
        isTest: true
      };

      var file = JSON.stringify({
        name: 'foo.jpg',
        path: '/upload/foo.jpg'
      });


      it('should save multipart data', inject(['crResources'], true, function(crResources, done) {

        crResources.get('Image').save(imageDoc, file).then(
          function(doc) {
            assert(doc);
            assert(doc.file0.name === 'foo.jpg');
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
        imageDoc._id += '_multi_file';
        var files = [
          file, file
        ];

        crResources.get('Image').save(imageDoc, files).then(
          function(doc) {
            assert(doc.file0.name === 'foo.jpg');
            assert(doc.file1.name === 'foo.jpg');
            done();
          },
          done
        );
      }));
    });
  });



  describe('crBuild', function() {

    var types = [
      // basic directives
      { schema: { type: 'boolean' }, testAttr: 'cr-boolean' },
      { schema: { type: 'number' },  testAttr: 'cr-number' },
      { schema: { type: 'integer' }, testAttr: 'cr-integer' },
      { schema: { type: 'string' },  testAttr: 'cr-string' },
      { schema: { 'enum': [1, 2] },  testAttr: 'cr-enum' },
      { schema: { $ref: 'Foo' },     testAttr: 'cr-ref' },
      { schema: { type: 'object' },  testAttr: 'cr-object' },
      { schema: { type: 'array' },   testAttr: 'cr-array' },
      { schema: { type: 'array', items: { anyOf: [] } }, testAttr: 'cr-array' },

      { schema: { type: 'string', view: { type: 'cr-readonly' } }, testAttr: 'disabled' },

      // extra string directives
      { schema: { type: 'string', view: { type: 'cr-text' } }, testAttr: 'cr-text' },
      { schema: { type: 'string', view: { type: 'cr-date' } }, testAttr: 'cr-date' },
      { schema: { type: 'string', view: { type: 'cr-slug' } }, testAttr: 'cr-slug' },
      { schema: { type: 'string', view: { type: 'cr-password' } }, testAttr: 'cr-password' },

      // extra ref directive
      { schema: { $ref: 'Image',
                  view: { type: 'cr-image' } },
        testAttr: 'cr-image' },
      { schema: { $ref: 'Foo',
                  view: { type: 'cr-single-sel-ref' } },
        testAttr: 'cr-single-sel-ref' },
      { schema: { type: 'array', items: { $ref: 'Foo' },
                  view: { type: 'cr-multi-sel-ref' } },
        testAttr: 'cr-multi-sel-ref'},

      // extra obj directives
      { schema: { type: 'object',
                  properties: { foo: { type: 'string' }, bar: { type: 'number' }},
                  view: { type: 'cr-inline-object' }},
        testAttr: 'cr-inline-object' },
      { schema: { type: 'object',
                  properties: { foo: { type: 'string' }, bar: { type: 'number' }},
                  view: { type: 'cr-tab-object' }},
        testAttr: 'cr-tab-object' }
    ];


    types.forEach(function(data) {
      it('should build element ' + data.testAttr, inject(
        ['$rootScope', '$timeout', 'crBuild'], true,
        function($rootScope, $timeout, crBuild, done) {

          var scope = $rootScope.$new();
          scope.schema = data.schema;
          var elem = crBuild.buildControl(scope);

          // wait for the directive
          $timeout(function() {
            try {
              assert(elem.find('[' + data.testAttr + ']').length === 1);
            }
            catch(e) {
              return done(e);
            }
            return done();
          });
        }
      ));
    });
  });

});
