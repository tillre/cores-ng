
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
      assert(crCommon.getRefId() !== crCommon.getRefId());
      assert(crCommon.getModalId() !== crCommon.getModalId());
    }));

    it('should watch until condition is met',
       inject(['$rootScope', 'crCommon'], true, function($rootScope, crCommon, done) {

         var scope = $rootScope.$new();
         crCommon.watch(scope, function(scope) {
           return scope.value;
         }).then(
           function(scope) { done(); }
         );
         scope.value = true;
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
      assert(crSchema.isPrivateProperty('parentId_'));
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
      { schema: { type: 'integer' }, attr: 'cr-integer' },
      { schema: { type: 'string' }, attr: 'cr-string' },
      { schema: { 'enum': [1, 2] }, attr: 'cr-enum' },
      { schema: { $ref: 'Foo' }, attr: 'cr-model-create-ref' },
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

    var articleRes;
    var articleId = 'resource_' + (new Date().getTime());
    
    var articleDoc = {
      title: 'Hello Article',
      author: { firstname: 'No', lastname: 'Mono' },
      content: 'Bla bla bla'
    };

    
    it('should create', inject(['crResource'], function(crResource) {
      articleRes = new crResource('Article', {
        path: '/articles',
        schemaPath: '/articles/_schema',
        viewPaths: { titles: '/articles/_views/titles' }
      }, {
        host: host
      });
    }));

    
    it('should save without id', inject(true, function(done) {
      articleRes.save(articleDoc).then(
        function(d) {
          assert(typeof d._id === 'string');
          assert(typeof d._rev === 'string');
          done();
        },
        done
      );
    }));

    
    it('should save with id', inject(true, function(done) {
      var doc2 = JSON.parse(JSON.stringify(articleDoc));
      doc2._id = articleId;
      articleRes.save(doc2).then(
        function(d) {
          assert(d._id === doc2._id);
          assert(typeof d._rev === 'string');
          done();
        },
        done
      );
    }));


    it('should load', inject(true, function(done) {
      articleRes.load(articleId).then(
        function(d) {
          assert(d._id === articleId);
          done();
        },
        done
      );
    }));


    it('should load all', inject(true, function(done) {
      articleRes.load().then(
        function(res) {
          assert(res.total_rows > 1);
          done();
        },
        done
      );
    }));


    it('should load all with params', inject(true, function(done) {
      articleRes.load({ limit: 1 }).then(
        function(res) {
          assert(res.total_rows > 1);
          assert(res.rows.length === 1);
          done();
        },
        done
      );
    }));
    
    
    it('should load and update', inject(true, function(done) {
      articleRes.load(articleId).then(
        function(d) {

          assert(typeof d._id === 'string');
          assert(typeof d._rev === 'string');
          d.title = 'yoyoyo';

          articleRes.save(d).then(
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
      articleRes.view('titles').then(
        function(res) {
          assert(res.total_rows > 1);
          done();
        },
        done
      );
    }));


    it('should call the view with params', inject(true, function(done) {
      articleRes.view('titles', { limit: 1 }).then(
        function(res) {
          assert(res.total_rows > 1);
          assert(res.rows.length === 1);
          done();
        },
        done
      );
    }));


    it('should destroy', inject(true, function(done) {
      articleRes.load(articleId).then(
        function(d) {
          return articleRes.destroy(d._id, d._rev);
        }
      ).then(
        function() {
          return articleRes.load(articleId);
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

    var catDoc = {
      _id: 'model_' + (new Date().getTime()),
      title: 'Hello Model',
      slug: 'hello'
    };
    
    var createCtrl = function($rootScope, $controller, type, id) {

      var scope = $rootScope.$new();
      scope.type = type;
      if (id) scope.id = id;

      return $controller('crModelCtrl', { $scope: scope });
    };

    before(inject(['crResources'], true, function(crResources, done) {
      crResources.get('Category').save(catDoc).then(
        function(doc) { done(); },
        done
      );
    }));
    
    
    it('should instantiate',
       inject(['$rootScope', '$controller'], true, function($rootScope, $controller, done) {

         var ctrl = createCtrl($rootScope, $controller, 'Category');
         assert(ctrl);

         $rootScope.$on('model:ready', function() {
           done();
         });
       }));


    it('should instantiate with id',
       inject(['$rootScope', '$controller'], true, function($rootScope, $controller, done) {

         var ctrl = createCtrl($rootScope, $controller, 'Category', catDoc._id);
         assert(ctrl);

         var off = $rootScope.$on('model:ready', function() {
           off();
           assert(ctrl.scope().model.title === 'Hello Model');
           done();
         });
       }));


    it('should save',
       inject(['$rootScope', '$controller'], true, function($rootScope, $controller, done) {

         var ctrl = createCtrl($rootScope, $controller, 'Category');

         var off = $rootScope.$on('model:ready', function() {
           off();

           var model = ctrl.scope().model;
           model.title = 'Hello Mate';
           model.author = { firstname: 'Hot', lastname: 'Sauce' };
           model.content = 'Cherrio';

           ctrl.save().then(
             function() {
               done();
             },
             done
           );
         });
       }));

    it('should update',
       inject(['$rootScope', '$controller'], true, function($rootScope, $controller, done) {

         var ctrl = createCtrl($rootScope, $controller, 'Category', catDoc._id);

         var off = $rootScope.$on('model:ready', function() {
           off();

           var model = ctrl.scope().model;
           model.title = 'Hello Update';

           ctrl.save().then(
             function() {
               assert(ctrl.scope().model.title === 'Hello Update');
               done();
             },
             done
           );
         });
       }));

    
    it('should save and update with referenced model',
       inject(['$rootScope', '$controller'], true, function($rootScope, $controller, done) {

         var ctrl1 = createCtrl($rootScope, $controller, 'Category');
         var ctrl2 = createCtrl($rootScope, $controller, 'Category');

         var rev1, rev2;
         
         var count = 2;
         var off = $rootScope.$on('model:ready', function(e) {
           if (--count > 0) {
             return;
           }
           off();

           ctrl1.id('model_ref_1_' + new Date().getTime() + Math.floor(Math.random() * 999));
           ctrl2.id('model_ref_2_' + new Date().getTime() + Math.floor(Math.random() * 999));

           ctrl1.scope().model.title = 'Cat1';
           ctrl2.scope().model.title = 'Cat2';

           ctrl1.onRefSet({ stopPropagation: function() {} }, 'r1', ctrl2);

           ctrl1.save().then(
             function() {
               assert(ctrl2.scope().model.parentId_ === ctrl1.id());
               // update
               ctrl1.scope().model.title = 'Cat1U';
               ctrl2.scope().model.title = 'Cat2U';
               rev1 = ctrl1.scope().model._rev;
               rev2 = ctrl2.scope().model._rev;

               return ctrl1.save();
             }
           ).then(
             function() {
               assert(ctrl1.scope().model._rev !== rev1);
               assert(ctrl2.scope().model._rev !== rev2);
               done();
             },
             done
           );
         });
       }));


    it('should save with files',
       inject(['$rootScope', '$controller'], true, function($rootScope, $controller, done) {

         var ctrl = createCtrl($rootScope, $controller, 'Image');

         var file = JSON.stringify({
           name: 'foo.jpg',
           path: '/upload/foo.jpg',
           isTest: true
         });

         var off = $rootScope.$on('model:ready', function(e) {
           off();

           ctrl.onFileSet({ stopPropagation: function() {} }, 'f1', file);

           ctrl.save().then(
             function() {
               assert(ctrl.scope().model.file.url === JSON.parse(file).path);
               done();
             },
             done
           );
         });
       }));
  });


  describe('directives', function() {


    var types = ['Boolean', 'Integer', 'Number', 'String',
                 'Enum', 'Object', 'Array', 'Anyof'];
    
    types.forEach(function(type) {

      it('should create directive ' + type, inject(['$compile', '$rootScope', 'crResources', 'crSchema'], true, function($compile, $rootScope, crResources, crSchema, done) {

        var self = this;
        var res = crResources.get(type);
        
        res.schema().then(
          // get the schema
          function(schema) {
            return crSchema.createValue(schema);
          }
        ).then(
          // save a default model
          function(model) {
            return res.save(model);
          }
        ).then(
          // create the directive
          function(doc) {

            var scope = $rootScope.$new();
            scope.id = doc._id;
            scope.type = doc.type_;

            var elem = angular.element('<div cr-model type="type" id="id"/>');
            $compile(elem)(scope);

            $('body').append(elem);
            $('body').append($('<hr>'));

            // wait for ready event
            var offready = scope.$on('ready', function(e) {
              e.stopPropagation(); 
              offready();
              done();
            });
          },
          done
        );
      }));
    });
  });
});
