(function() {

  var module = angular.module('cores.directives');

  module.directive('crTags', function(
    crResources,
    crCommon,
    crTagCompletion
  ) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-tags.html',

      link: function(scope, elem, attrs, crCtrl) {

        // validation
        if (scope.required) {
          crCtrl.addValidator('required', function(value) {
            return !!value && !!value.length;
          });
        }

        var tagInput = elem.find('input');
        var dropdown = elem.find('.dropdown-menu');

        scope.matches = [];
        scope.activeListIndex = 0;
        scope.currentTag = '';

        scope.$watch('currentTag', function(value) {
          checkMatch(value);
        });

        function checkMatch(value) {
          if (!value) {
            closeDropdown();
            return;
          }
          scope.matches = crTagCompletion.match(value);
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

        function addTag(tag) {
          var exists = scope.model.some(function(t) {
            if (t.slug === tag.slug) {
              return true;
            }
            return false;
          });
          if (exists) return false;
          crTagCompletion.addItem(tag.name, tag.slug);
          scope.model = scope.model.concat([tag]);
          return true;
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
          addTag({ name: match.name, slug: match.slug });
        };

        scope.createTag = function() {
          var name = scope.currentTag;
          var tag = {
            name: name,
            slug: crCommon.slugify(name)
          };
          addTag(tag);
          scope.currentTag = '';
        };

        scope.removeTag = function(index) {
          scope.model = scope.model.filter(function(tag, i) {
            return i !== index;
          });
        };

        scope.getTagName = function(slug) {
          var tag = crTagCompletion.getItem(slug);
          return tag ? tag.name : '';
        };

        tagInput.on('focus', function(e) {
          checkMatch(scope.currentTag);
        });

        tagInput.on('keydown', function(e) {
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