var expect = chai.expect;


describe('comodl angular', function() {

  var comodl;
  var doc = {
    type: 'Article',
    title: 'Some Article',
    author: {
      firstname: 'Balou',
      lastname: 'The Bear'
    },
    tags: ['one', 'two'],
    body: 'The actual body...'
  };
  
  
  before(function() {
    angular.module('comodlTest', ['http']);
  });


  describe('service', function() {
  
    it('should get the service from injector', function() {
      var $injector = angular.injector(['comodl', 'ng']);
      comodl = $injector.get('comodl');
      expect(comodl).to.be.a('object');
    });


    it('should save a document', function(done) {
      comodl.save(doc, function(err, d) {
        expect(err).to.not.exist;
        expect(d._id).to.be.a('string');
        expect(d._rev).to.be.a('string');
        doc = d;
        done();
      });
    });

    
    it('should save an updated document', function(done) {
      doc.title = 'New Content';
      comodl.save(doc, function(err, d) {
        expect(err).to.not.exist;
        expect(d._id).to.equal(doc._id);
        expect(d._rev).to.not.equal(doc._rev);
        doc = d;
        done();
      });
    });

    
    it('should get the document', function(done) {
      comodl.load('Article', doc._id, function(err, d) {
        expect(err).to.not.exist;
        expect(d._id).to.equal(doc._id);
        expect(d._rev).to.equal(doc._rev);
        done();
      });
    });


    it('should call the all view', function(done) {
      comodl.view('Article', 'all', function(err, docs) {
        expect(err).to.not.exist;
        expect(docs).to.be.a('array');
        expect(docs.length).to.equal(1);
        done();
      });
    });


    it('should call the titles view', function(done) {
      comodl.view('Article', 'titles', function(err, titles) {
        expect(err).to.not.exist;
        expect(titles).to.be.a('array');
        expect(titles.length).to.equal(1);
        expect(titles[0]).to.equal('New Content');
        done();
      });
    });
    
    
    it('should destroy a document', function(done) {
      comodl.destroy(doc, function(err) {
        expect(err).to.not.exist;
        done();
      });
    });


    it('should not get a non existant document', function(done) {
      comodl.load('Article', doc._id, function(err, d) {
        expect(err).to.exist;
        expect(err.code).to.equal(404);
        done();
      });
    });
  });
});