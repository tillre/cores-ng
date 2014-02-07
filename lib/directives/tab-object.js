(function() {

  var module = angular.module('cores.directives');


  module.directive('crTabObject', function(
    crBuild,
    crCommon
  ) {
    return {
      replace: true,
      templateUrl: 'cr-object.html',

      link: function(scope, elem, attrs) {

        scope.options = angular.extend({
          showLabel: true,
          indent: true,
          inline: false
        }, scope.schema.view);

        var props = crBuild.buildProperties(scope, scope.schema, scope.model, scope.path);

        var navWrapper = $('<ul class="nav nav-tabs"></ul>');
        var contentWrapper = $('<div class="tab-content"></div>');
        var navElems = '';
        var contentElems = [];

        props.forEach(function(prop, i) {
          var id = 'tab' + prop.path.replace(/\//g, '-');

          navElems += '<li' + (i === 0 ? ' class="active"' : '') + '>' +
            '<a href="#' + id + '">' + crBuild.getLabel(prop.schema, prop.path) + '</a></li>';

          contentElems.push($('<div' +
                              + ' ng-class="{ \'cr-indent\': options.indent }"'
                              + ' class="tab-pane' + (i === 0 ? ' active' : '') + '"'
                              + ' id="' + id + '"></div>'
                             ).html(prop.elem));
        });
        navWrapper.html(navElems);
        contentWrapper.html(contentElems);

        elem.find('.properties').append([navWrapper, contentWrapper]);

        elem.find('.nav-tabs a').on('click', function(e) {
          e.preventDefault();
          $(this).tab('show');

        }).on('shown.bs.tab', function(e) {
          e.preventDefault();
          scope.$broadcast('cr:tab:shown');
        });
      }
    };
  });

})();