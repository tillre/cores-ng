

(function() {

  angular.module('testCoresAngular', ['ng', 'cores'])

    .controller('BarCtrl', function($scope, crResources, crViews, crPagination, crTagCompletion) {

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
              paginator: crPagination.createViewPaginator(crResources.get('Foo'), 'ids')
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
      });
    })
  ;

})();
