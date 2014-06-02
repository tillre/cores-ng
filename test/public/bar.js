

(function() {

  angular.module('testCoresAngular', ['ng', 'cores'])

    .controller('BarCtrl', function($scope, crResources, crViews, crPagination) {

      crResources.init().then(function() {

        crViews.add({
          none: {
            type: 'none'
          },
          readonly: {
            type: 'readonly'
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
            type: 'cr-single-select-ref',
            previewPaths: ['/name', '/slug']
          },
          multiSelRef: {
            type: 'cr-multi-select-ref',
            previewPath: '/name'
          },
          tags: {
            type: 'cr-tags'
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
