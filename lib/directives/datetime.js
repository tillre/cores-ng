(function() {

  var module = angular.module('cores.directives');


  module.directive('crDatetime', function() {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-datetime.html',

      link: function(scope, elem, attrs, crCtrl) {

        // validation
        if (scope.required) {
          crCtrl.addValidator('required', function(value) {
            return !!value;
          });
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
        dtDate.on('dp.change', function(e) {
          e.stopPropagation();
          if (!e.date) return;

          date.setFullYear(e.date.year());
          date.setMonth(e.date.month());
          date.setDate(e.date.date());

          scope.model = date.toISOString();
          scope.$apply();
          crCtrl.validate();
        });

        // timepicker
        var dtTime = elem.find('.time').datetimepicker({
          maskInput: true,
          pickDate: false,
          pickTime: true,
          pickSeconds: false
        });
        dtTime.data('DateTimePicker').setDate(date);
        dtTime.on('dp.change', function(e) {
          e.stopPropagation();
          if  (!e.date) return;

          date.setHours(e.date.hours());
          date.setMinutes(e.date.minutes());

          scope.model = date.toISOString();
          scope.$apply();
          crCtrl.validate();
        });
      }
    };
  });
})();