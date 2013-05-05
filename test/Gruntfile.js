var path = require('path');
var nano = require('nano')('http://localhost:5984');


var dbName = 'test-cores-angular';


module.exports = function(grunt) {

  // run `grunt test` to start tests
  
  grunt.initConfig({
    karma: {
      run: {
        configFile: './karma.conf.js'
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');


  grunt.registerTask('server', ['db:create', 'server:run', 'db:destroy']);
  grunt.registerTask('test', ['db:create', 'server:test', 'karma', 'db:destroy']);
  
  
  grunt.registerTask('server:run', 'start server', function() {
    var done = this.async();
    var server = require('./server.js');
    var db = nano.use(dbName);
    server(db, function() {});
    // never call done to run endlessly
  });

  grunt.registerTask('server:test', 'start test server', function() {
    var done = this.async();
    var server = require('./server.js');
    var db = nano.use(dbName);          
    server(db, done);
  });

  
  grunt.registerTask('db:create', 'create test DB', function() {
    var done = this.async();
    
    // create db for testing
    nano.db.get(dbName, function(err, body) {
      if (!err) {
        // db exists, recreate
        nano.db.destroy(dbName, function(err) {
          if (err) done(err);
          nano.db.create(dbName, done);
        });
      }
      else if (err.reason === 'no_db_file'){
        // create the db
        nano.db.create(dbName, done);
      }
      else done(err);
    });
  });

  
  grunt.registerTask('db:destroy', 'destroy test DB', function() {
    var done = this.async();
    nano.db.destroy(dbName, done);
  });
};