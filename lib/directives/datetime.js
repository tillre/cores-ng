(function() {

  var module = angular.module('cores.directives');


  module.directive('crDatetime', function(crFieldLink, crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-datetime.html',

      link: crFieldLink(function(scope, elem, attrs) {

        var validation = crValidation(scope);
        if (scope.options.isRequired) {
          validation.addConstraint('required', 'Required', function(value) {
            return !!value && value !== '';
          }, true);
        }

        // the date
        var date = scope.model ? new Date(scope.model) : new Date();
        if (!scope.model) {
          scope.model = date.toISOString();
        }

        // datepicker
        var dtDate = elem.find('.date').datetimepicker({
          maskInput: true,
          pickDate: true,
          pickTime: false
        });
        dtDate.data('DateTimePicker').setDate(date);
        dtDate.on('change.dp', function(e) {
          e.stopPropagation();

          date.setFullYear(e.date.year());
          date.setMonth(e.date.month());
          date.setDate(e.date.date());

          scope.model = date.toISOString();
          scope.$apply();
        });

        // timepicker
        var dtTime = elem.find('.time').datetimepicker({
          maskInput: true,
          pickDate: false,
          pickTime: true,
          pickSeconds: false
        });
        dtTime.data('DateTimePicker').setDate(date);
        dtTime.on('change.dp', function(e) {
          e.stopPropagation();

          date.setHours(e.date.hours());
          date.setMinutes(e.date.minutes());

          scope.model = date.toISOString();
          scope.$apply();
        });
      })
    };
  });
})();