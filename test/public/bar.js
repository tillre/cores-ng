

(function() {

  angular.module('testCoresAngular', ['ng', 'cores'])

    .controller('BarCtrl', function($scope, crResources, crViews, crPagination, crTagCompletion) {

      var changed = false;
      $scope.$on('cr:model:change', function(e, path) {
        changed = true;
        console.log('changed', path);
      });

      // window.onbeforeunload = function (evt) {
      //   if (!changed) {
      //     return;
      //   }
      //   return "Discard changes?";
      // };


      // add some dummy tags for completion
      [ { name: 'Hello', slug: 'hello' },
        { name: 'World', slug: 'world' },
        { name: 'Foo', slug: 'foo' },
        { name: 'Bar', slug: 'bar' }
      ].forEach(function(tag) {
        crTagCompletion.addItem(tag.name, tag.slug);
      });

      crResources.init().then(function() {

        crResources.get('Bar').schema().then(function(schema) {
          console.log('Bar schema:', schema);
        });

        crViews.add({
          none: {
            type: 'none'
          },
          readonly: {
            showLabel: false,
            type: 'cr-readonly'
          },
          ref: {
            previewPaths: ['/name', '/slug'],
            defaults: { '/name': 'some value' },
            list: {
              columns: [ { path: 'slug' } ]
            }
          },
          selectRef: {
            selectOnly: true,
            enableClear: true,
            previewPaths: ['/name'],
            list: {
              columns: [ { path: 'name' } ],
              view: 'ids',
              params: { descending: true }
              //paginator: crPagination.createViewPaginator(crResources.get('Foo'), 'ids')
            }
          },
          image: {
            preview: 'cr-image-preview'
          },
          singleSelRef: {
            type: 'cr-select-ref',
            previewPaths: ['/name', '/slug']
          },
          multiSelRef: {
            type: 'cr-multi-select-ref',
            previewPath: '/name'
          },
          tags: {
            type: 'cr-tags'
          },
          selTag: {
            type: 'cr-select-tag'
          },
          datetime: {
            type: 'cr-datetime'
          },
          slug: {
            type: 'cr-slug',
            source: ['string']
          },
          inline: {
            inline: true
          },
          columnObject: {
            type: 'cr-column-object',
            showLabels: true
          },
          tabObject: {
            type: 'cr-tab-object'
          },
          arrayRef: {
            showLabel: true,
            previewPath: 'name'
          },
          text: {
            type: 'cr-text'
          },
          password: {
            type: 'cr-password'
          }
        });

        $scope.type = 'Bar';

        if (window.location.hash) {
          $scope.modelId = window.location.hash.substr(1);
        }
        $scope.$on('cr:model:saved', function(e, model) {
          window.location.hash = model._id;
        });
      });
    })
  ;

})();
