// Karma configuration

module.exports = function(config) {

  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // list of plugins to load
    plugins: [
      'karma-mocha',
      'karma-chrome-launcher'
    ],

    frameworks: [
      'mocha'
    ],

    // list of files / patterns to load in the browser
    files: [
      // MOCHA,
      // MOCHA_ADAPTER,

      '../bower_components/jquery/jquery.js',
      '../bower_components/angular/angular.js',
      '../bower_components/angular/angular-mocks.js',
      '../bower_components/bootstrap/js/dropdown.js',
      '../bower_components/bootstrap/js/modal.js',

      '../node_modules/chai/chai.js',

      // order matters
      '../lib/index.js',
      '../templates/templates.js',
      '../lib/services/**/*.js',
      '../lib/filters/**/*.js',
      '../lib/controllers/**/*.js',
      '../lib/directives/**/*.js',

      // '../cores.js',

      './test.js'
    ],


    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // cli runner port
    runnerPort: 9100,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false

  });
};