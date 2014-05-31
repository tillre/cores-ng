
var couchdb = require('Cores')('http://localhost:5984/test-cores-ng').couchdb;


module.exports = function(grunt) {

  grunt.initConfig({
    karma: {
      run: {
        configFile: './test/karma.conf.js'
      }
    },

    ngtemplates: {
      cores: {
        src: 'templates/*.html',
        dest: 'templates/templates.js',
        options: {
          url: function(url) {
            return 'cr-' + url.replace('templates/', '');
          }
        }
      }
    },

    concat: {
      cores: {
        // order matters!
        src: ['lib/index.js',
              'templates/templates.js',
              'lib/filters/*.js',
              'lib/controllers/*.js',
              'lib/services/*.js',
              'lib/directives/*.js'],
        dest: 'cores.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-angular-templates');

  grunt.registerTask('build', ['ngtemplates', 'concat']);

  grunt.registerTask('serve', ['db:create', 'server:run', 'db:destroy']);
  grunt.registerTask('test', ['db:create', 'server:test', 'karma', 'db:destroy']);

  grunt.registerTask('default', ['build', 'serve']);

  //
  // server tasks
  //

  grunt.registerTask('server:run', 'start server', function() {
    var done = this.async();
    var startServer = require('./test/server.js');

    startServer(function(err) {
      if (err) {
        console.log(err);
        console.log(err.stack);
        return done(err);
      }
      console.log('server up');
    });
    // never call done to run endlessly
  });

  grunt.registerTask('server:test', 'start test server', function() {
    var done = this.async();
    var startServer = require('./test/server.js');
    startServer(function(err) {
      if (err) {
        console.log(err);
        console.log(err.stack);
      }
      done(err);
    });
  });


  //
  // db tasks
  //

  grunt.registerTask('db:create', 'create test DB', function() {
    var done = this.async();

    couchdb.info().then(function() {
      return couchdb.destroyDB().then(function() {
        return couchdb.createDB();
      });
    }, function(err) {
      return couchdb.createDB();

    }).then(function() {
      done();
    }, done);
  });

  grunt.registerTask('db:destroy', 'destroy test DB', function() {
    var done = this.async();
    couchdb.destroyDB().then(function() { done(); }, done);
  });
};