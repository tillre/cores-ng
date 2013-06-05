(function() {

  //
  // module definitions
  //

  angular.module('cores',
                 ['ng',
                  'cores.services',
                  'cores.templates',
                  'cores.directives']);

  angular.module('cores.services',
                 ['ng']);

  angular.module('cores.templates',
                 ['ng']);
  
  angular.module('cores.directives',
                 ['ng',
                  'cores.services',
                  'cores.templates']);

})();