(function() {

  var module = angular.module('cores.directives');


  module.directive('crRef', function(
    $compile,
    crResources,
    crCommon
  ) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-ref.html',

      link: function(scope, elem, attrs, crCtrl) {

        scope.options = angular.extend({
          showLabel: true,
          indent: true,
          preview: 'cr-ref-preview',
          list: {}
        }, scope.schema.view);

        scope.modelId = scope.model.id_;
        scope.reset = false;
        scope.selectModalId = crCommon.createModalId();
        scope.showModel = false;
        scope.modelOptions = {
          buttons: [{ title: 'Close', event: 'cr:ref:close' }]
        };

        scope.newModel = function() {
          scope.modelId = null;
          scope.showModel = true;
        };

        scope.editModel = function() {
          scope.modelId = scope.model.id_;
          scope.showModel = true;
        };

        scope.selectModel = function() {
          scope.$broadcast('cr:showModal:list', scope.selectModalId, true);
        };

        scope.hasModel = function() {
          return !!scope.model.id_;
        };


        scope.$on('cr:model:saved', function(e, model) {
          e.stopPropagation();
          scope.showModel = false;
          scope.model.id_ = model._id;
          crCtrl.validate();
          update();
        });


        scope.$on('cr:list:select', function(e, id) {
          e.stopPropagation();
          scope.showModel = false;
          scope.modelId = scope.model.id_ = id;
          crCtrl.validate();
          update();
        });


        scope.$on('cr:ref:close', function(e) {
          e.stopPropagation();
          scope.showModel = false;
        });


        // validation
        if (scope.required) {
          crCtrl.addValidator('required', function(value) {
            return value && value.id_;
          });
        }

        function update() {
          if (scope.model.id_) {
            var resource = crResources.get(scope.schema.$ref);
            resource.load(scope.model.id_).then(function(doc) {
              scope.previewModel = doc;
            });
          }
        }
        update();

        // create preview directive
        var tmpl = '<div ' + scope.options.preview
              + ' model="previewModel"'
              + ' schema="schema"'
              + ' options="options">'
              + '</div>';

        var content = $compile(tmpl)(scope);
        elem.find('.cr-preview').html(content);
      }
    };
  });


  //
  // preview
  //

  module.directive('crRefPreview', function() {
    return {
      scope: {
        model: '=',
        schema: '=',
        options: '='
      },

      replace: true,
      templateUrl: 'cr-ref-preview.html',

      link: function(scope, elem, attrs) {
        // get the preview text from model properties pointed to by the preview paths
        if (scope.options.previewPath) {
          scope.options.previewPaths = [scope.options.previewPath];
        }
      }
    };
  });
})();