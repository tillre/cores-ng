(function() {

  var module = angular.module('cores.directives');


  module.directive('crTags', function(
    crResources,
    crCommon
  ) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-tags.html',

      link: function(scope, elem, attrs, crCtrl) {

        // validation
        if (scope.required) {
          crCtrl.addValidator('required', function(value) {
            return !!value;
          });
        }

        var allTags = [];
        var allTagsById = {};
        var resource = crResources.get(scope.schema.items.$ref);

        // load all tags
        resource.view('all', { include_docs: true }).then(function(result) {

          allTags = result.rows.map(function(row) {
            var doc = row.doc;

            allTagsById[doc._id] = doc;

            // return tag for lookup
            return {
              doc: doc,
              key: createKey(doc.name)
            };
          });
        });


        var tagInput = elem.find('input');
        var dropdown = elem.find('.dropdown-menu');

        scope.matches = [];
        scope.activeListIndex = 0;
        scope.currentTag = '';

        scope.$watch('currentTag', function(value) {
          if (!allTags) return;
          checkMatch(value);
        });


        function createKey(str) {
          return str.toLowerCase().replace(/ +?/g, '');
        }

        function match(str) {
          var re = new RegExp('^' + createKey(str));
          return allTags.filter(function(t) {
            return t.key.match(re);
          });
        }

        function checkMatch(value) {
          if (!value) {
            closeDropdown();
            return;
          }
          scope.matches = match(value);
          if (scope.matches.length) {
            if (scope.matches.length < scope.activeListIndex - 1) {
              scope.activeListIndex = scope.matches.length - 1;
            }
            openDropdown();
          }
          else {
            closeDropdown();
          }
        }

        function addTag(doc) {
          var exists = scope.model.some(function(t) {
            if (t.id_ === doc._id) {
              return true;
            }
            return false;
          });
          if (exists) return false;
          scope.model.push({ id_: doc._id });
          return true;
        }

        function createTag(name) {
          var doc = {
            name: name,
            slug: crCommon.slugify(name)
          };

          resource.save(doc).then(function(doc) {
            scope.currentTag = '';
            if (addTag(doc)) {
              allTags.push({
                doc: doc,
                key: createKey(doc.name)
              });
              allTagsById[doc._id] = doc;
            }

          }, function(err) {
            console.log('save error', err);
            scope.error = err;
          });
        }

        function removeTag(index) {
          scope.model.splice(index, 1);
        }

        function openDropdown() {
          scope.activeListIndex = 0;
          dropdown.css('display', 'block');
        }

        function closeDropdown() {
          dropdown.css('display', 'none');
        }



        scope.selectMatch = function(match) {
          closeDropdown();
          scope.currentTag = '';
          tagInput.val('');
          tagInput.focus();
          addTag(match.doc);
        };

        scope.createTag = function() {
          createTag(scope.currentTag);
        };

        scope.removeTag = function(index) {
          removeTag(index);
        };

        scope.getTagName = function(id) {
          var tag = allTagsById[id];
          return tag ? tag.name : '';
        };

        tagInput.on('focus', function(e) {
          checkMatch(scope.currentTag);
        });

        tagInput.on('keyup', function(e) {
          var ENTER = 13;
          var TAB = 9;
          var UP = 38;
          var DOWN = 40;

          switch(e.keyCode) {
          case ENTER:
          case TAB:
            e.preventDefault();
            var l = scope.matches.length;
            if (l > 0 && scope.activeListIndex < l) {
              scope.selectMatch(scope.matches[scope.activeListIndex]);
              scope.$apply();
            }
            break;

          case UP:
            e.preventDefault();
            if (scope.activeListIndex > 0) {
              scope.activeListIndex--;
              scope.$apply();
            }
            break;

          case DOWN:
            e.preventDefault();
            if (scope.activeListIndex < scope.matches.length - 1) {
              scope.activeListIndex++;
              scope.$apply();
            }
            break;
          }
        });
      }
    };
  });
})();