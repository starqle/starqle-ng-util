(function () {
   'use strict';

angular.module('on.root.scope', []).config([
  "$provide", function($provide) {
    return $provide.decorator("$rootScope", [
      "$delegate", function($delegate) {
        Object.defineProperty($delegate.constructor.prototype, "$onRootScope", {
          value: function(name, listener) {
            var unsubscribe;
            unsubscribe = $delegate.$on(name, listener);
            return this.$on("$destroy", unsubscribe);
          },
          enumerable: false
        });
        return $delegate;
      }
    ]);
  }
]);


/**
 * @ngdoc module
 * @name shApiModule
 *
 * @description
 * shApiModule
 */
var shApiModule;

shApiModule = angular.module('sh.api.module', []);


/**
 * @ngdoc module
 * @name shTableModule
 *
 * @description
 * shTableModule
 */
var shDatepickerModule;

shDatepickerModule = angular.module('sh.datepicker.module', []);


/**
 * @ngdoc module
 * @name shDialogModule
 *
 * @description
 * shDialogModule
 */
var shDialogModule;

shDialogModule = angular.module('sh.dialog.module', []);


/**
 * @ngdoc module
 * @name shFormModule
 *
 * @description
 * shFormModule
 */
var shFormModule;

shFormModule = angular.module('sh.form.module', []);


/**
 * @ngdoc module
 * @name shHelperModule
 *
 * @description
 * shHelperModule
 */
var shHelperModule;

shHelperModule = angular.module('sh.helper.module', []);


/**
 * @ngdoc module
 * @name shPersistenceModule
 *
 * @description
 * shPersistenceModule
 */
var shPersistenceModule;

shPersistenceModule = angular.module('sh.persistence.module', []);


/**
 * @ngdoc module
 * @name shSpinningModule
 *
 * @description
 * shSpinningModule
 */
var shSpinningModule;

shSpinningModule = angular.module('sh.spinning.module', []);


/**
 * @ngdoc module
 * @name shTableModule
 *
 * @description
 * shTableModule
 */
var shTableModule;

shTableModule = angular.module('sh.table.module', []);


/**
 * @ngdoc module
 * @name shValidationModule
 *
 * @description
 * shValidationModule
 */
var shValidationModule;

shValidationModule = angular.module('sh.validation.module', []);


/**
 * @ngdoc directive
 * @name shTablePagination
 *
 * @description
 * directive
 */
shTableModule.directive("shTablePagination", function() {
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      shTablePagination: '=',
      shTablePaginationAction: '&'
    },
    template: '<div ng-if="shTablePagination.totalCount > 10" class="pagination form-inline pull-left">\n  <select ng-model=\'perPage\' ng-change="shTablePaginationAction({pageNumber: 1, perPage: perPage})" ng-options="perPage for perPage in getPerPages()" class="form-control text-right"></select>&nbsp;\n  &nbsp;\n  &nbsp;\n</div>\n\n<ul class="pagination pull-left">\n  <li ng-repeat="page in shTablePagination.pages" ng-switch="page.type">\n    <a ng-switch-when="FIRST" ng-disabled="page.disabled" ng-click="shTablePaginationAction({pageNumber: page.number})">«</a>\n    <a ng-switch-when="PREV" ng-disabled="page.disabled" ng-click="shTablePaginationAction({pageNumber: page.number})">&lt;</a>\n    <a ng-switch-when="PAGE" ng-disabled="page.disabled" ng-click="shTablePaginationAction({pageNumber: page.number})">\n      <span ng-bind="page.number"></span>\n    </a>\n    <a ng-switch-when="MORE" ng-disabled="page.disabled">…</a>\n    <a ng-switch-when="NEXT" ng-disabled="page.disabled" ng-click="shTablePaginationAction({pageNumber: page.number})">&gt;</a>\n    <a ng-switch-when="LAST" ng-disabled="page.disabled" ng-click="shTablePaginationAction({pageNumber: page.number})">»</a>\n  </li>\n</ul>\n\n<div class="pagination pull-left">\n  <div class="btn disabled">\n    <span class="page-count">\n      &nbsp;{{shTablePagination.currentPageCount}}&nbsp;\n    </span>\n    <span>\n      <em translate="LABEL_OF"></em>\n    </span>\n    <span class="page-total">\n      &nbsp;{{shTablePagination.totalCount}}&nbsp;\n    </span>\n  </div>\n</div>\n\n<div class="pagination pull-left">\n  <div ng-click="shTablePaginationAction()" class="btn">\n    <i class="fa fa-refresh"></i>\n  </div>\n</div>',
    controller: [
      '$scope', function($scope) {
        $scope.perPage = 10;
        $scope.getPerPages = function() {
          return [10, 20, 50, 100];
        };
      }
    ]
  };
});

angular.module('sh.bootstrap', []).directive('shBootstrapTooltip', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        angular.element(element).on('click', function() {
          angular.element(element).tooltip('hide');
        }).on('mouseenter', function() {
          angular.element(element).tooltip('show');
        }).on('mouseleave', function() {
          angular.element(element).tooltip('hide');
        });
      }
    };
  }
]).directive('shBootstrapPopover', [
  '$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var addTimeout, cancelTimeout, localAttrs;
        localAttrs = {
          popoverId: null,
          timeoutFn: null,
          addTimeout: function(element) {
            localAttrs.timeoutFn = $timeout(function() {
              return angular.element(element).popover('hide');
            }, 100);
          },
          cancelTimeout: function() {
            return $timeout.cancel(localAttrs.timeoutFn);
          }
        };
        cancelTimeout = function() {
          return localAttrs.cancelTimeout();
        };
        addTimeout = function() {
          return localAttrs.addTimeout(element);
        };
        angular.element(element).on('mouseenter', function() {
          localAttrs.cancelTimeout();
          if (angular.isUndefined(angular.element(element).attr('aria-describedby'))) {
            angular.element(element).popover('show');
          }
        }).on('mouseleave', function() {
          return localAttrs.addTimeout(element);
        }).on('shown.bs.popover', function() {
          localAttrs.popoverId = angular.element(element).attr('aria-describedby');
          angular.element('#' + localAttrs.popoverId).on('mouseenter', cancelTimeout);
          return angular.element('#' + localAttrs.popoverId).on('mouseleave', addTimeout);
        }).on('hide.bs.popover', function() {
          angular.element('#' + localAttrs.popoverId).off('mouseenter', cancelTimeout);
          return angular.element('#' + localAttrs.popoverId).off('mouseleave', addTimeout);
        });
      }
    };
  }
]);

angular.module('sh.collapsible', []).directive("shCollapsible", function() {
  return {
    restrict: 'AEC',
    scope: {
      shCollapsibleCollapsed: '@?',
      shCollapsibleCollapseFn: '&',
      shCollapsibleExpandFn: '&'
    },
    controller: [
      '$scope', '$element', '$timeout', function($scope, $element, $timeout) {
        var self;
        self = this;
        this.shCollapse = false;
        this.bodyElements = [];
        this.triggerResizeTimeout = function() {
          return $timeout((function() {
            angular.element(window).triggerHandler('resize');
          }), 10);
        };
        this.toggleCollapse = function() {
          var bodyElement, i, j, len, len1, ref, ref1;
          this.shCollapse = !this.shCollapse;
          if (this.isCollapse()) {
            ref = this.bodyElements;
            for (i = 0, len = ref.length; i < len; i++) {
              bodyElement = ref[i];
              bodyElement.slideUp('fast', self.triggerResizeTimeout);
              $element.addClass('is-collapse');
            }
          } else {
            ref1 = this.bodyElements;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              bodyElement = ref1[j];
              bodyElement.slideDown('fast', self.triggerResizeTimeout);
              $element.removeClass('is-collapse');
            }
          }
        };
        this.addCollapsibleBodyElement = function(element) {
          this.bodyElements.push(element);
        };
        this.isCollapse = function() {
          return this.shCollapse;
        };
      }
    ],
    controllerAs: 'shCollapsibleController',
    link: function(scope, element, attrs, shCollapsibleController) {
      scope.shCollapsibleExpandFn({
        expandFn: function() {
          if (shCollapsibleController.isCollapse()) {
            return shCollapsibleController.toggleCollapse();
          }
        }
      });
      scope.shCollapsibleCollapseFn({
        collapseFn: function() {
          if (!shCollapsibleController.isCollapse()) {
            return shCollapsibleController.toggleCollapse();
          }
        }
      });
      if (scope.shCollapsibleCollapsed === 'true') {
        shCollapsibleController.toggleCollapse();
      }
    }
  };
}).directive("shCollapsibleBody", function() {
  return {
    restrict: 'AEC',
    scope: {},
    require: '^shCollapsible',
    link: function(scope, element, attrs, shCollapsibleController) {
      shCollapsibleController.addCollapsibleBodyElement(element);
    }
  };
}).directive("shCollapsibleControl", function() {
  return {
    restrict: 'AEC',
    scope: {},
    require: '^shCollapsible',
    link: function(scope, element, attrs, shCollapsibleController) {
      element.bind('click', function() {
        shCollapsibleController.toggleCollapse();
      });
    }
  };
});

shDatepickerModule.directive("shDatepicker", [
  function() {
    return {
      restrict: 'A',
      scope: {
        shDisplayFormat: '@?',
        shFromDate: '=?',
        shIcons: '=?',
        shThruDate: '=?',
        widgetVerticalPosition: '@?'
      },
      require: '?ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        var displayFormat, dpChange, dpChangeTriggered, formatter, isValid, jqValue, parser, ref, setupDatepicker, updateDate, updateIcon, updateMaxDate, updateMinDate, valueFormat;
        valueFormat = 'YYYY-MM-DD';
        displayFormat = (ref = scope.shDisplayFormat) != null ? ref : 'DD-MM-YYYY';
        dpChangeTriggered = false;
        jqValue = -1;
        formatter = function(value) {
          if (value != null) {
            return moment(value).format(displayFormat);
          } else {
            return null;
          }
        };
        ngModelCtrl.$formatters.push(formatter);
        parser = function(value) {
          var valueFormatted;
          if (moment(value, displayFormat).isValid()) {
            valueFormatted = moment(value, displayFormat).format(valueFormat);
            if (isValid(valueFormatted)) {
              updateDate(valueFormatted);
              return valueFormatted;
            } else {
              updateDate(null);
              ngModelCtrl.$setViewValue(null);
              value = null;
              return null;
            }
          } else {
            value = null;
            return null;
          }
        };
        ngModelCtrl.$parsers.push(parser);
        ngModelCtrl.$render = function() {
          if (!angular.isDefined(ngModelCtrl.$modelValue)) {
            ngModelCtrl.$modelValue = null;
          }
        };
        isValid = function(value) {
          var maxValue, minValue, ref1, ref2, ref3, ref4;
          if ((((ref1 = element.data('DateTimePicker')) != null ? ref1.maxDate() : void 0) != null) && ((ref2 = element.data('DateTimePicker')) != null ? ref2.maxDate() : void 0)) {
            maxValue = element.data('DateTimePicker').maxDate().format(valueFormat);
            if (moment(value).isAfter(maxValue)) {
              return false;
            }
          }
          if ((((ref3 = element.data('DateTimePicker')) != null ? ref3.minDate() : void 0) != null) && ((ref4 = element.data('DateTimePicker')) != null ? ref4.minDate() : void 0)) {
            minValue = element.data('DateTimePicker').minDate().format(valueFormat);
            if (moment(value).isBefore(minValue)) {
              return false;
            }
          }
          return true;
        };
        setupDatepicker = function(value) {
          var ref1;
          element.unbind('dp.change', dpChange);
          if ((ref1 = element.data('DateTimePicker')) != null) {
            ref1.destroy();
          }
          element.datetimepicker({
            format: displayFormat,
            showClear: true,
            showClose: true,
            showTodayButton: false,
            useCurrent: false,
            useStrict: true,
            widgetPositioning: {
              vertical: scope.widgetVerticalPosition || 'auto'
            }
          });
          updateDate(value);
          updateIcon(scope.shIcons);
          updateMinDate(scope.shFromDate);
          updateMaxDate(scope.shThruDate);
          element.bind('dp.change', dpChange);
        };
        updateDate = function(value) {
          if (value != null) {
            element.data('DateTimePicker').date(moment(value));
          } else {
            element.data('DateTimePicker').clear();
          }
        };
        updateMinDate = function(value) {
          var maxValue, ref1, ref2, ref3, ref4;
          if (value != null) {
            if ((((ref1 = element.data('DateTimePicker')) != null ? ref1.maxDate() : void 0) != null) && ((ref2 = element.data('DateTimePicker')) != null ? ref2.maxDate() : void 0)) {
              maxValue = element.data('DateTimePicker').maxDate().format(valueFormat);
              if (moment(value).isAfter(maxValue)) {
                value = maxValue;
              }
            }
            if ((ref3 = element.data('DateTimePicker')) != null) {
              ref3.minDate(moment(value).startOf('day'));
            }
          } else {
            if ((ref4 = element.data('DateTimePicker')) != null) {
              ref4.minDate(false);
            }
          }
        };
        updateMaxDate = function(value) {
          var minValue, ref1, ref2, ref3, ref4;
          if (value != null) {
            if ((((ref1 = element.data('DateTimePicker')) != null ? ref1.minDate() : void 0) != null) && ((ref2 = element.data('DateTimePicker')) != null ? ref2.minDate() : void 0)) {
              minValue = element.data('DateTimePicker').minDate().format(valueFormat);
              if (moment(value).isBefore(minValue)) {
                value = minValue;
              }
            }
            if ((ref3 = element.data('DateTimePicker')) != null) {
              ref3.maxDate(moment(value).endOf('day'));
            }
          } else {
            if ((ref4 = element.data('DateTimePicker')) != null) {
              ref4.maxDate(false);
            }
          }
        };
        updateIcon = function(obj) {
          if (obj != null) {
            element.data('DateTimePicker').icons(obj);
          }
        };
        dpChange = function(data) {
          dpChangeTriggered = true;
          if (data.date) {
            ngModelCtrl.$setViewValue(data.date.format(displayFormat));
          } else {
            ngModelCtrl.$setViewValue(null);
          }
        };
        scope.$watch('shFromDate', function(newVal, oldVal) {
          updateMinDate(newVal);
        });
        scope.$watch('shThruDate', function(newVal, oldVal) {
          updateMaxDate(newVal);
        });
        scope.$watch(function() {
          return moment.defaultZone.name;
        }, function(newVal, oldVal) {
          if ((newVal != null) && newVal !== oldVal) {
            setupDatepicker(ngModelCtrl.$modelValue);
          }
        });
        scope.$watch(function() {
          return ngModelCtrl.$modelValue;
        }, function(newVal, oldVal) {
          if (!dpChangeTriggered) {
            if (newVal !== jqValue && angular.isDefined(newVal)) {
              jqValue = newVal;
              setupDatepicker(jqValue);
            }
          }
        });
      }
    };
  }
]);

shDatepickerModule.directive("shDatetimepicker", [
  'dateFilter', function(dateFilter) {
    return {
      restrict: 'A',
      scope: {
        ngModel: '=',
        shDisplayFormat: '@?',
        shFromTime: '=?',
        shIcons: '=?',
        shThruTime: '=?',
        widgetVerticalPosition: '@?'
      },
      require: '?ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        var displayFormat, dpChange, dpChangeTriggered, formatter, isValid, jqValue, parser, ref, setupDatepicker, updateDate, updateIcon, updateMaxDate, updateMinDate, valueFormat;
        valueFormat = 'x';
        displayFormat = (ref = scope.shDisplayFormat) != null ? ref : 'DD-MM-YYYY, HH:mm (z)';
        dpChangeTriggered = false;
        jqValue = -1;
        formatter = function(value) {
          if (value != null) {
            if (!(isNaN(value) && moment(value, moment.ISO_8601).isValid())) {
              value *= 1;
            }
            return moment(value).tz(moment.defaultZone.name).format(displayFormat);
          } else {
            return null;
          }
        };
        ngModelCtrl.$formatters.push(formatter);
        parser = function(value) {
          var valueFormatted;
          if (moment.tz(value, displayFormat, moment.defaultZone.name).isValid()) {
            valueFormatted = moment.tz(value, displayFormat, moment.defaultZone.name).format(valueFormat);
            if (isValid(valueFormatted)) {
              updateDate(valueFormatted);
              return valueFormatted;
            } else {
              updateDate(null);
              ngModelCtrl.$setViewValue(null);
              value = null;
              return null;
            }
          } else {
            value = null;
            return null;
          }
        };
        ngModelCtrl.$parsers.push(parser);
        ngModelCtrl.$render = function() {
          if (!angular.isDefined(ngModelCtrl.$modelValue)) {
            ngModelCtrl.$modelValue = null;
          }
        };
        isValid = function(value) {
          var maxValue, minValue, ref1, ref2, ref3, ref4;
          if ((((ref1 = element.data('DateTimePicker')) != null ? ref1.maxDate() : void 0) != null) && ((ref2 = element.data('DateTimePicker')) != null ? ref2.maxDate() : void 0)) {
            maxValue = element.data('DateTimePicker').maxDate().valueOf();
            if (maxValue < value) {
              return false;
            }
          }
          if ((((ref3 = element.data('DateTimePicker')) != null ? ref3.minDate() : void 0) != null) && ((ref4 = element.data('DateTimePicker')) != null ? ref4.minDate() : void 0)) {
            minValue = element.data('DateTimePicker').minDate().valueOf();
            if (minValue > value) {
              return false;
            }
          }
          return true;
        };
        setupDatepicker = function(value) {
          var ref1;
          element.unbind('dp.change', dpChange);
          if ((ref1 = element.data('DateTimePicker')) != null) {
            ref1.destroy();
          }
          element.datetimepicker({
            format: displayFormat,
            showClear: true,
            showClose: true,
            showTodayButton: false,
            timeZone: moment.defaultZone.name,
            useCurrent: false,
            useStrict: true,
            widgetPositioning: {
              vertical: scope.widgetVerticalPosition || 'auto'
            }
          });
          updateDate(value);
          updateIcon(scope.shIcons);
          updateMinDate(scope.shFromTime);
          updateMaxDate(scope.shThruTime);
          element.bind('dp.change', dpChange);
        };
        updateDate = function(value) {
          if (value != null) {
            if (!(isNaN(value) && moment(value, moment.ISO_8601).isValid())) {
              value *= 1;
            }
            element.data('DateTimePicker').date(moment(value).tz(moment.defaultZone.name));
          } else {
            element.data('DateTimePicker').clear();
          }
        };
        updateMinDate = function(value) {
          var maxValue, ref1, ref2, ref3, ref4;
          if (value != null) {
            if (!(isNaN(value) && moment(value, moment.ISO_8601).isValid())) {
              value *= 1;
            }
            if ((((ref1 = element.data('DateTimePicker')) != null ? ref1.maxDate() : void 0) != null) && ((ref2 = element.data('DateTimePicker')) != null ? ref2.maxDate() : void 0)) {
              maxValue = element.data('DateTimePicker').maxDate().valueOf();
              if (maxValue < value) {
                value = maxValue;
              }
            }
            if ((ref3 = element.data('DateTimePicker')) != null) {
              ref3.minDate(moment(value).tz(moment.defaultZone.name));
            }
          } else {
            if ((ref4 = element.data('DateTimePicker')) != null) {
              ref4.minDate(false);
            }
          }
        };
        updateMaxDate = function(value) {
          var minValue, ref1, ref2, ref3, ref4;
          if (value != null) {
            if (!(isNaN(value) && moment(value, moment.ISO_8601).isValid())) {
              value *= 1;
            }
            if ((((ref1 = element.data('DateTimePicker')) != null ? ref1.minDate() : void 0) != null) && ((ref2 = element.data('DateTimePicker')) != null ? ref2.minDate() : void 0)) {
              minValue = element.data('DateTimePicker').minDate().valueOf();
              if (minValue > value) {
                value = minValue;
              }
            }
            if ((ref3 = element.data('DateTimePicker')) != null) {
              ref3.maxDate(moment(value).tz(moment.defaultZone.name));
            }
          } else {
            if ((ref4 = element.data('DateTimePicker')) != null) {
              ref4.maxDate(false);
            }
          }
        };
        updateIcon = function(obj) {
          if (obj != null) {
            element.data('DateTimePicker').icons(obj);
          }
        };
        dpChange = function(data) {
          dpChangeTriggered = true;
          if (data.date) {
            ngModelCtrl.$setViewValue(data.date.tz(moment.defaultZone.name).format(displayFormat));
          } else {
            ngModelCtrl.$setViewValue(null);
          }
        };
        scope.$watch('shFromTime', function(newVal, oldVal) {
          updateMinDate(newVal);
        });
        scope.$watch('shThruTime', function(newVal, oldVal) {
          updateMaxDate(newVal);
        });
        scope.$watch(function() {
          return moment.defaultZone.name;
        }, function(newVal, oldVal) {
          if ((newVal != null) && newVal !== oldVal) {
            setupDatepicker(ngModelCtrl.$modelValue);
          }
        });
        scope.$watch(function() {
          return ngModelCtrl.$modelValue;
        }, function(newVal, oldVal) {
          if (!dpChangeTriggered) {
            if (newVal !== jqValue && angular.isDefined(newVal)) {
              jqValue = newVal;
              if (isNaN(jqValue) && moment(jqValue, moment.ISO_8601).isValid()) {
                jqValue = moment(jqValue).format('x');
                scope.ngModel = jqValue;
              }
              setupDatepicker(jqValue);
            }
          }
        });
      }
    };
  }
]);

shDatepickerModule.directive("shDatetime", [
  function() {
    return {
      restrict: 'A',
      scope: {
        shDatetime: '=',
        shDatetimeFormat: '@?',
        shDateFormat: '@?'
      },
      template: '<span title="{{getFormattedShDatetime()}}">{{getFormattedShDatetime()}}</span>',
      link: function(scope, element, attrs) {
        scope.getFormattedShDatetime = function() {
          var ref, ref1, shDateFormat, shDatetimeFormat, shDatetimeTmp;
          if (scope.shDatetime != null) {
            if (moment(scope.shDatetime, 'YYYY-MM-DD', true).isValid()) {
              shDateFormat = (ref = scope.shDateFormat) != null ? ref : 'DD-MM-YYYY';
              return moment(scope.shDatetime).format(shDateFormat);
            } else {
              shDatetimeFormat = (ref1 = scope.shDatetimeFormat) != null ? ref1 : 'DD MMM YYYY, HH:mm (z)';
              shDatetimeTmp = scope.shDatetime;
              if (!(isNaN(shDatetimeTmp) && moment(shDatetimeTmp, moment.ISO_8601).isValid())) {
                shDatetimeTmp = shDatetimeTmp * 1;
              }
              return moment(shDatetimeTmp).tz(moment.defaultZone.name).format(shDatetimeFormat);
            }
          } else {
            return '-';
          }
        };
      }
    };
  }
]);

shDatepickerModule.directive("shTimepicker", [
  function() {
    return {
      restrict: 'A',
      scope: {
        shTimepicker: '='
      },
      template: '<select name="duration-hour" ng-model="duration.hour" ng-options="n as n for n in ([] | shRange:0:24)" class="form-control">\n  <option value="0">0</option>\n</select>&colon;\n<select name="duration-minute" ng-model="duration.minute" ng-options="n as n for n in ([] | shRange:0:60:5)" class="form-control">\n  <option value="0">0</option>\n</select>',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        var formatter;
        scope.duration = {
          hour: Math.floor(scope.shTimepicker / (60 * 60)),
          minute: scope.shTimepicker % (60 * 60)
        };
        formatter = function(value) {
          if (value != null) {
            scope.duration.hour = Math.floor(value / (60 * 60));
            scope.duration.minute = Math.floor(value / 60) % 60;
          } else {
            scope.duration.hour = 0;
            scope.duration.minute = 5;
          }
          return value;
        };
        ngModelCtrl.$formatters.push(formatter);
        scope.$watchCollection('duration', function(newVal, oldVal) {
          if (newVal != null) {
            ngModelCtrl.$setViewValue((scope.duration.hour * 60 * 60) + (scope.duration.minute * 60));
          }
        });
      }
    };
  }
]);

shDialogModule.directive("shDialog", [
  '$compile', '$templateCache', '$timeout', '$q', function($compile, $templateCache, $timeout, $q) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        shDialogOk: '&?',
        shDialogBeforeShow: '&?',
        shDialogOnHide: '&?',
        shDialogCancel: '&?',
        shDialogHeader: '@?',
        shDialogBody: '@?',
        shDialogFooter: '@?',
        shDialogForm: '@?',
        shDialogClass: '@?',
        shDialogEntity: '=?',
        shDialogLoading: '=?',
        shDialogDisabled: '&?',
        shDialogLabelOk: '@?',
        shDialogLabelClose: '@?',
        shDialogLabelCancel: '@?',
        shDialogParent: '=?',
        title: '@?'
      },
      link: function(scope, element, attrs) {
        var onHandleClick, ref, ref1, ref2, shDialogLabelCancel, shDialogLabelClose, shDialogLabelOk;
        shDialogLabelOk = (ref = scope.shDialogLabelOk) != null ? ref : 'Submit';
        shDialogLabelClose = (ref1 = scope.shDialogLabelClose) != null ? ref1 : 'Close';
        shDialogLabelCancel = (ref2 = scope.shDialogLabelCancel) != null ? ref2 : 'Cancel';
        angular.element(element).addClass('sh-dialog').children().eq(0).on('click', function() {
          if (angular.element(this).find('> *:first-child').attr('disabled') !== 'disabled') {
            onHandleClick();
          }
        });
        scope.showModal = function(elmt) {
          $timeout(function() {
            elmt.modal('show');
          }, 20);
        };
        scope.hideModal = function() {
          angular.element('.modal').modal('hide');
        };
        onHandleClick = function() {
          var buttonOkElement, compiledShDialogBody, compiledShDialogFooter, compiledShDialogHeader, modalIdSuffix, parent, ref3, ref4, ref5, shDialogModal;
          modalIdSuffix = scope.$id;
          shDialogModal = null;
          if (scope.shDialogForm != null) {
            shDialogModal = angular.element('<div id="modal-sh-dialog-' + modalIdSuffix + '" tabindex="-1" role="dialog" aria-labelledby="modalShDialogLabel" aria-hidden="true" class="modal">' + '<div class="modal-dialog ' + ((ref3 = scope.shDialogClass) != null ? ref3 : 'modal-sm') + '">' + '<form class="modal-content" novalidate="" name="' + scope.shDialogForm + '">' + "      <div class=\"modal-header\">\n        <button type=\"button\" data-dismiss=\"modal\" aria-hidden=\"true\" class=\"close\">&times;</button>\n        <h4 class=\"modal-title\"></h4>\n      </div>\n      <div class=\"modal-body\"></div>\n      <div class=\"modal-footer\"></div>\n    </form>\n  </div>\n</div>");
          } else {
            shDialogModal = angular.element('<div id="modal-sh-dialog-' + modalIdSuffix + '" tabindex="-1" role="dialog" aria-labelledby="modalShDialogLabel" aria-hidden="true" class="modal">' + '<div class="modal-dialog ' + ((ref4 = scope.shDialogClass) != null ? ref4 : 'modal-sm') + '">' + "    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" data-dismiss=\"modal\" aria-hidden=\"true\" class=\"close\">&times;</button>\n        <h4 class=\"modal-title\"></h4>\n      </div>\n      <div class=\"modal-body\"></div>\n      <div class=\"modal-footer\"></div>\n    </div>\n  </div>\n</div>");
          }
          if (scope.shDialogHeader != null) {
            compiledShDialogHeader = angular.element($templateCache.get(scope.shDialogHeader));
            shDialogModal.find('.modal-title').append(compiledShDialogHeader);
          } else {
            shDialogModal.find('.modal-title').html(scope.title);
          }
          if (scope.shDialogBody != null) {
            compiledShDialogBody = angular.element($templateCache.get(scope.shDialogBody));
            shDialogModal.find('.modal-body').append(compiledShDialogBody);
          }
          if (scope.shDialogFooter != null) {
            compiledShDialogFooter = angular.element($templateCache.get(scope.shDialogFooter));
            shDialogModal.find('.modal-footer').append(compiledShDialogFooter);
          } else if (attrs.shDialogOk != null) {
            buttonOkElement = "<button\n  class=\"btn btn-primary margin-left\"\n\n  ng-disabled=\"" + 'aliasShDialogDisabled()' + "\"\n\nng-click=\"" + 'aliasShDialogOk($event)' + "\"\n\nsh-submit=\"" + '{{aliasShDialogForm}}' + ("  \"\n\n  ng-attr-title=\"" + shDialogLabelOk + "\"\n  type=\"submit\"\n>\n" + shDialogLabelOk + "\n</button>");
            shDialogModal.find('.modal-footer').append(buttonOkElement);
            shDialogModal.find('.modal-footer').append("<button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-default margin-left\">\n  " + shDialogLabelCancel + "\n</button>");
          } else {
            shDialogModal.find('.modal-footer').append("<button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-default margin-left\">\n  " + shDialogLabelClose + "\n</button>");
          }
          parent = (ref5 = scope.shDialogParent) != null ? ref5 : scope.$parent;
          $compile(shDialogModal)(parent);
          angular.element('body').append(shDialogModal);
          if (scope.shDialogEntity != null) {
            parent.shDialogEntity = angular.copy(scope.shDialogEntity, {});
          }
          shDialogModal.on('show.bs.modal', function() {
            var deferred;
            parent.shDialogLoading = true;
            deferred = $q.defer();
            $q.when((scope.shDialogBeforeShow || angular.noop)()).then(function(success) {
              if ((success != null ? success.data : void 0) != null) {
                parent.shDialogEntity = angular.copy(success.data, {});
              }

              /* */
              return deferred.resolve(success);
            }, function(error) {

              /* */
              scope.hideModal();
              return deferred.reject(error);
            })["finally"](function() {

              /* */
              parent.shDialogLoading = false;
            });
            return deferred.promise;
          }).on('hidden.bs.modal', function() {
            scope.shDialogOnHide && scope.shDialogOnHide();
            shDialogModal.remove();
            parent.shDialogEntity = {};
          });
          scope.showModal(shDialogModal);
          parent.aliasShDialogDisabled = function() {
            var ref6, ref7, ref8;
            if (parent.shDialogLoading) {
              return true;
            }
            if (attrs.shDialogDisabled != null) {
              return scope.shDialogDisabled();
            }
            if (scope.shDialogForm == null) {
              return false;
            }
            return ((ref6 = parent[scope.shDialogForm]) != null ? ref6.$pristine : void 0) || ((ref7 = parent[scope.shDialogForm]) != null ? ref7.$invalid : void 0) || ((ref8 = parent[scope.shDialogForm]) != null ? ref8.$submitted : void 0);
          };
          parent.aliasShDialogOk = function($event) {
            var deferred;
            deferred = $q.defer();
            parent.shDialogLoading = true;
            $q.when((scope.shDialogOk || angular.noop)({
              $event: $event
            })).then(function(success) {
              scope.hideModal();
              return deferred.resolve();
            }, function(error) {
              var ref6;
              if (scope.shDialogForm != null) {
                if ((ref6 = parent[scope.shDialogForm]) != null) {
                  ref6.$submitted = false;
                }
              }
              return deferred.reject();
            })["finally"](function() {
              parent.shDialogLoading = false;
            });
            return deferred.promise;
          };
          parent.aliasShDialogForm = scope.shDialogForm;
        };
        scope.$watch('$parent.shDialogLoading', function(newVal, oldVal) {
          if (newVal != null) {
            if (scope.shDialogLoading != null) {
              scope.shDialogLoading = newVal;
            }
          }
        });
      }
    };
  }
]);

shDialogModule.directive('shDialogDismissButton', function() {
  return {
    restrict: 'EA',
    template: function(element, attrs) {
      return "<button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-default margin-left\" translate=\"ACTION_CANCEL\">\n</button>";
    }
  };
});

angular.module('sh.focus', []).directive("shFocus", [
  '$timeout', function($timeout) {
    return {
      scope: {
        shFocus: '='
      },
      link: function(scope, element, attrs) {
        scope.$watch('shFocus', function(value) {
          if (value === true) {
            $timeout(function() {
              return element.eq(0).select();
            });
            return;
          } else {
            $timeout(function() {
              return element.eq(0).blur();
            });
            return;
          }
        });
      }
    };
  }
]);

angular.module('sh.number.format', []).directive("shNumberFormat", [
  '$filter', function($filter) {
    return {
      restrict: 'A',
      scope: {
        shAllowZero: '@?',
        shMin: '=?',
        shMax: '=?',
        shLowerThan: '@?',
        shGreaterThan: '@?',
        shLowerThanEqual: '@?',
        shGreaterThanEqual: '@?',
        shNumberInvalidMessage: '@?',
        shNumberHint: '@?',
        ngModel: '=',
        decimalPlaces: '@?'
      },
      require: '?ngModel',
      link: function(scope, element, attributes, ngModel) {
        var classId, returnNumberOrNull, setupRestriction, shAllowZero, updatePopover;
        classId = 'sh-number-' + Math.random().toString().slice(2);
        shAllowZero = scope.shAllowZero === 'false' ? false : true;
        returnNumberOrNull = function(val) {
          if ((val != null) && val !== '') {
            return val * 1;
          } else {
            return null;
          }
        };
        setupRestriction = function() {
          var ref, ref1, ref2, ref3;
          scope.lowerThan = returnNumberOrNull(scope.shLowerThan);
          scope.greaterThan = returnNumberOrNull(scope.shGreaterThan);
          scope.lowerThanEqual = returnNumberOrNull(scope.shLowerThanEqual);
          scope.greaterThanEqual = returnNumberOrNull(scope.shGreaterThanEqual);
          scope.lowerThanEqual = (ref = (ref1 = scope.lowerThanEqual) != null ? ref1 : scope.shMax) != null ? ref : Infinity;
          scope.greaterThanEqual = (ref2 = (ref3 = scope.greaterThanEqual) != null ? ref3 : scope.shMin) != null ? ref2 : -Infinity;
        };
        setupRestriction();
        updatePopover = function() {
          var popoverContent, ref, ref1, ref2;
          popoverContent = element.attr('data-content');
          if (ngModel.$invalid) {
            if (ngModel.$error.out_of_range) {
              popoverContent = (ref = scope.shNumberInvalidMessage) != null ? ref : 'Invalid Number';
            }
            if (ngModel.$error.required) {
              popoverContent = (ref1 = scope.shNumberInvalidMessage) != null ? ref1 : 'Please insert a number';
            }
          } else {
            if (ngModel.$modelValue == null) {
              popoverContent = (ref2 = scope.shNumberHint) != null ? ref2 : 'Insert valid number';
            }
          }
          angular.element('.' + classId).find('.popover-content').html(popoverContent);
          return scope.applyValidity();
        };
        ngModel.$formatters.push(function(value) {
          return $filter('number')(parseFloat(value));
        });
        ngModel.$parsers.push(function(value) {
          var number;
          number = String(value).replace(/\,/g, '');
          number = parseFloat(number);
          if (scope.decimalPlaces != null) {
            number = parseFloat(number.toFixed(scope.decimalPlaces));
          }
          if (isNaN(number)) {
            return null;
          }
          if (!shAllowZero) {
            if (number === 0) {
              return null;
            }
          }
          if ((scope.shMin != null) && number < parseFloat(scope.shMin)) {
            return parseFloat(scope.shMin);
          } else if ((scope.shMax != null) && number > parseFloat(scope.shMax)) {
            return parseFloat(scope.shMax);
          }
          return number;
        });
        ngModel.$viewChangeListeners.push(function() {
          return ngModel.$invalid;
        });
        scope.applyValidity = function() {
          var valid, validRequired;
          valid = true;
          if (scope.lowerThanEqual != null) {
            valid = valid && +scope.ngModel <= scope.lowerThanEqual;
          }
          if (scope.greaterThanEqual != null) {
            valid = valid && +scope.ngModel >= scope.greaterThanEqual;
          }
          if (scope.lowerThan != null) {
            valid = valid && +scope.ngModel < scope.lowerThan;
          }
          if (scope.greaterThan != null) {
            valid = valid && +scope.ngModel > scope.greaterThan;
          }
          if (!shAllowZero) {
            valid = valid && +scope.ngModel !== 0;
          }
          ngModel.$setValidity('out_of_range', valid);
          if (attributes.required != null) {
            validRequired = true;
            if (scope.ngModel == null) {
              validRequired = false;
            }
            ngModel.$setValidity('required', validRequired);
          }
        };
        element.on('focusout', function() {
          ngModel.$viewValue = ngModel.$modelValue != null ? String($filter('number')(ngModel.$modelValue)) : '';
          return ngModel.$render();
        });
        element.on('focusin', function() {
          ngModel.$viewValue = ngModel.$modelValue;
          ngModel.$render();
          return element.select();
        });
        element.on('keyup', function() {
          return updatePopover();
        });
        element.on('keydown', function(e) {
          var ref, ref1;
          if (((ref = e.keyCode) === 16 || ref === 17 || ref === 18 || ref === 46 || ref === 8 || ref === 9 || ref === 27 || ref === 13 || ref === 110 || ref === 173 || ref === 190 || ref === 189) || (e.keyCode >= 112 && e.keyCode <= 123) || (((ref1 = e.keyCode) === 65 || ref1 === 67 || ref1 === 86) && (e.ctrlKey === true || e.metaKey === true)) || (e.keyCode >= 35 && e.keyCode <= 40)) {

            /*let it happen, don't do anything */
          } else if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
            return e.preventDefault();
          }
        });
        scope.$watch('ngModel', function(newValue, oldValue) {
          return scope.applyValidity();
        });
        scope.$watchCollection(function() {
          return [scope.shLowerThan, scope.shGreaterThan, scope.shLowerThanEqual, scope.shGreaterThanEqual];
        }, function(newVal, oldVal) {
          if (newVal != null) {
            setupRestriction();
          }
        });
        element.popover({
          trigger: 'focus',
          container: 'body',
          placement: 'auto top',
          template: '<div class="popover ' + classId + '" role="tooltip">' + '  <div class="arrow"></div>' + '  <h3 class="popover-title"></h3>' + '  <div class="popover-content"></div>' + '</div>'
        });
        return element.on('shown.bs.popover', function() {
          return updatePopover();
        });
      }
    };
  }
]);

angular.module('sh.segment', []).directive("wideTableContainer", function() {
  var scrollSlave;
  scrollSlave = function(body, head) {
    if (!head || !head[0]) {
      return;
    }
    head[0].scrollLeft = body[0].scrollLeft;
  };
  return {
    restrict: 'C',
    replace: false,
    link: function(scope, element, attrs) {
      var body, foot, head;
      body = element.find('.table-scroll-body');
      head = element.find('.table-scroll-head');
      foot = element.find('.table-scroll-foot');
      body.on('scroll', function() {
        scrollSlave(body, head);
        scrollSlave(body, foot);
      });
    }
  };
}).directive("shSegmentHead", function() {
  return {
    restrict: 'C',
    scope: {},
    link: function(scope, elem, attrs) {
      scope.height = 0;
      scope.$watch(function() {
        scope.height = elem.outerHeight();
      });
      scope.$watch('height', function(newVal, oldVal) {
        elem.next().css('top', newVal + 'px');
      });
    }
  };
}).directive("shSegmentFoot", function() {
  return {
    restrict: 'C',
    scope: {},
    link: function(scope, elem, attrs) {
      scope.height = 0;
      scope.$watch(function() {
        scope.height = elem.outerHeight();
      });
      scope.$watch('height', function(newVal, oldVal) {
        elem.prev().css('bottom', newVal + 'px');
      });
    }
  };
}).directive("tableScrollBody", [
  '$timeout', function($timeout) {
    return {
      restrict: 'C',
      scope: {
        tableScrollBodyReduction: '@?'
      },
      link: function(scope, element, attrs) {
        var assignBaseCss, assignShadowCss, refreshFreezedPane;
        assignBaseCss = function(elmt, left) {
          var outerHeight, paddingBottom, paddingLeft, paddingRight, paddingTop, parent, parentRow, reduction, ref;
          parent = angular.element(elmt).parent();
          parentRow = parent.parents('tr');
          paddingTop = parent.css('padding-top');
          paddingLeft = parent.css('padding-left');
          paddingRight = parent.css('padding-right');
          paddingBottom = parent.css('padding-bottom');
          outerHeight = parentRow.outerHeight();
          reduction = (ref = scope.tableScrollBodyReduction) != null ? ref : '1';
          reduction = reduction * 1;
          return angular.element(elmt).css({
            top: 0,
            left: left,
            marginTop: '-' + paddingTop,
            marginLeft: '-' + paddingLeft,
            marginRight: '-' + paddingRight,
            marginBottom: '-' + paddingBottom,
            paddingTop: paddingTop,
            paddingLeft: paddingLeft,
            paddingRight: paddingRight,
            paddingBottom: paddingBottom,
            minHeight: outerHeight - reduction
          });
        };
        assignShadowCss = function(elmt, scrollSize, shadowDirection) {
          var paddingRight, parent;
          parent = angular.element(elmt).parent();
          paddingRight = parent.css('padding-right');
          if (shadowDirection > 0) {
            if (!parent.next().hasClass('td-fixed')) {
              if (scrollSize > 0) {
                return angular.element(elmt).css({
                  boxShadow: '1px 0 0 rgba(0, 0, 0, 0.05), -1px 0 0 rgba(0, 0, 0, 0.1), ' + (shadowDirection * 5) + 'px 0px 0px 0px rgba(0, 0, 0, 0.03)',
                  borderColor: 'rgba(0, 0, 0, 0.1)'
                });
              } else {
                return angular.element(elmt).css({
                  boxShadow: '1px 0 0 rgba(0, 0, 0, 0.05), -1px 0 0 rgba(0, 0, 0, 0.05)',
                  borderColor: 'rgba(0, 0, 0, 0.05)'
                });
              }
            }
          } else {
            if (!parent.prev().hasClass('td-fixed')) {
              if (scrollSize > 0) {
                return angular.element(elmt).css({
                  boxShadow: '-1px 0 0 rgba(0, 0, 0, 0.1), ' + (shadowDirection * 5) + 'px 0px 0px 0px rgba(0, 0, 0, 0.03)',
                  borderColor: 'rgba(0, 0, 0, 0.1)'
                });
              } else {
                return angular.element(elmt).css({
                  boxShadow: 'none',
                  borderColor: 'rgba(0, 0, 0, 0.05)'
                });
              }
            }
          }
        };
        refreshFreezedPane = function() {
          var elementParent, left, scrollLeft, scrollTop, tableWidth, width;
          elementParent = element.parent();
          scrollTop = jQuery(element).scrollTop();
          scrollLeft = jQuery(element).scrollLeft();
          width = element[0].clientWidth;
          tableWidth = element.find('table').width();
          left = (width - tableWidth) + scrollLeft;
          elementParent.find('.td-fixed > .td-fixed-body.td-fixed-body-left').each(function() {
            assignBaseCss(this, scrollLeft);
            return assignShadowCss(this, scrollLeft, 1);
          });
          elementParent.find('.td-fixed > .td-fixed-body.td-fixed-body-right').each(function() {
            assignBaseCss(this, left);
            return assignShadowCss(this, -left, -1);
          });
          return elementParent.find('.loading-container').css({
            left: scrollLeft,
            right: -scrollLeft,
            top: scrollTop,
            bottom: -scrollTop
          });
        };
        angular.element(element).on('scroll', function() {
          refreshFreezedPane();
        });
        scope.$watch(function() {
          refreshFreezedPane();
        });
      }
    };
  }
]);

shSpinningModule.directive("shSpinning", [
  'ShSpinningService', function(ShSpinningService) {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs) {
        var length, lines, opts, radius, width;
        lines = 13;
        length = 30;
        width = 10;
        radius = 38;
        if (attrs.shSpinningSize != null) {
          switch (attrs.shSpinningSize) {
            case 'xs':
              lines = 9;
              length = 4;
              width = 2;
              radius = 5;
              break;
            case 'sm':
              lines = 9;
              length = 10;
              width = 4;
              radius = 12;
              break;
            case 'md':
              lines = 11;
              length = 20;
              width = 7;
              radius = 25;
              break;
            case 'lg':
              lines = 13;
              length = 30;
              width = 10;
              radius = 38;
          }
        }
        scope.shSpinningLines = +attrs.shSpinningLines || lines;
        scope.shSpinningLength = +attrs.shSpinningLength || length;
        scope.shSpinningWidth = +attrs.shSpinningWidth || width;
        scope.shSpinningRadius = +attrs.shSpinningRadius || radius;
        scope.shSpinningCorners = +attrs.shSpinningCorners || 1;
        scope.shSpinningRotate = +attrs.shSpinningRotate || 0;
        scope.shSpinningDirection = +attrs.shSpinningDirection || 1;
        scope.shSpinningColor = attrs.shSpinningColor || '#000';
        scope.shSpinningSpeed = +attrs.shSpinningSpeed || 2.2;
        scope.shSpinningTrail = +attrs.shSpinningTrail || 100;
        scope.shSpinningShadow = attrs.shSpinningShadow || false;
        scope.shSpinningHwaccel = attrs.shSpinningHwaccel || false;
        scope.shSpinningClassName = attrs.shSpinningClassName || 'spinner';
        scope.shSpinningZIndex = +attrs.shSpinningZIndex || 2e9;
        scope.shSpinningTop = attrs.shSpinningTop || '45%';
        scope.shSpinningLeft = attrs.shSpinningLeft || '50%';
        opts = {
          lines: scope.shSpinningLines,
          length: scope.shSpinningLength,
          width: scope.shSpinningWidth,
          radius: scope.shSpinningRadius,
          corners: scope.shSpinningCorners,
          rotate: scope.shSpinningRotate,
          direction: scope.shSpinningDirection,
          color: scope.shSpinningColor,
          speed: scope.shSpinningSpeed,
          trail: scope.shSpinningTrail,
          shadow: scope.shSpinningShadow,
          hwaccel: scope.shSpinningHwaccel,
          className: scope.shSpinningClassName,
          zIndex: scope.shSpinningZIndex,
          top: scope.shSpinningTop,
          left: scope.shSpinningLeft
        };
        scope.spinner = new Spinner(opts);
        scope.$watch((function() {
          return ShSpinningService.isSpinning(attrs.shSpinning);
        }, function(newVal, oldVal) {
          var ref, ref1;
          if (ShSpinningService.isSpinning(attrs.shSpinning)) {
            angular.element(element).addClass('sh-spinning-spin');
            if ((ref = scope.spinner) != null) {
              ref.spin(element[0]);
            }
          } else {
            angular.element(element).removeClass('sh-spinning-spin');
            if ((ref1 = scope.spinner) != null) {
              ref1.stop();
            }
          }
        }));
      }
    };
  }
]);

angular.module('sh.submit', []).directive('shSubmit', [
  '$compile', '$filter', function($compile, $filter) {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs) {
        var getDescendantProp, shSubmitInvalid, shSubmitOverlay, shSubmitOverlayInner;
        shSubmitOverlay = angular.element('<segment\n  class="sh-submit-overlay"\n  ng-mouseover="overlayHover()"\n>\n</segment>');
        shSubmitOverlay.css({
          position: 'relative',
          float: element.css('float')
        });
        shSubmitOverlayInner = angular.element('<div\n  class="sh-submit-overlay-inner"\n  ng-mouseover="overlayInnerHover()"\n>\n</div>');
        shSubmitOverlayInner.css({
          position: 'absolute'
        });
        shSubmitOverlayInner.appendTo(shSubmitOverlay);
        $compile(shSubmitOverlay)(scope);
        shSubmitInvalid = attrs.shSubmitInvalid || $filter('translate')('INFO_FIELD_CORRECTION');
        if (element.next('.sh-submit-overlay').length === 0 && element.parents('.sh-submit-overlay').length === 0) {
          shSubmitOverlay.insertAfter(element);
          element.prependTo(shSubmitOverlay);
          shSubmitOverlayInner.tooltip({
            title: shSubmitInvalid
          });
        }
        getDescendantProp = function(obj, desc) {
          var arr, result;
          arr = desc.split('.');
          result = null;
          while (arr.length) {
            result = (result || obj)[arr.shift()];
          }
          return result;
        };
        scope.overlayInnerHover = function() {
          var form, ref;
          if ((ref = getDescendantProp(scope, attrs.shSubmit)) != null ? ref.$invalid : void 0) {
            form = element.parents('form').eq(0);
            if (form.length > 0) {
              form.addClass('sh-highlight-required');
            } else {
              angular.element("form[name='" + attrs.shSubmit + "']").addClass('sh-highlight-required');
            }
          }
        };
        scope.overlayHover = function() {
          var ref;
          if ((ref = getDescendantProp(scope, attrs.shSubmit)) != null ? ref.$invalid : void 0) {
            shSubmitOverlayInner.css({
              left: element.position().left,
              top: element.position().top,
              width: element.outerWidth(),
              height: element.outerHeight(),
              marginLeft: element.css('margin-left'),
              marginRight: element.css('margin-right')
            });
          }
        };
        scope.$watch(function() {
          var ref;
          return (ref = getDescendantProp(scope, attrs.shSubmit)) != null ? ref.$invalid : void 0;
        }, function(newVal, oldVal) {
          if (newVal != null) {
            if (newVal) {
              return shSubmitOverlayInner.show();
            } else {
              return shSubmitOverlayInner.hide();
            }
          }
        });
      }
    };
  }
]);

shValidationModule.directive("validFile", [
  '$timeout', function($timeout) {
    return {
      scope: {
        validFileName: '='
      },
      require: 'ngModel',
      link: function(scope, el, attrs, ngModel) {
        scope.$watch('validFileName', function(newFile) {
          if (newFile != null) {
            $timeout((function() {
              ngModel.$pristine = false;
              ngModel.$setViewValue(scope.validFileName);
              ngModel.$pristine = true;
            }), 200);
            return $timeout((function() {
              ngModel.$pristine = false;
              ngModel.$setViewValue(scope.validFileName);
              ngModel.$pristine = true;
            }), 2000);
          }
        });
        el.bind('change', function() {
          scope.$apply(function() {
            ngModel.$setViewValue(el.val());
            ngModel.$render();
          });
        });
      }
    };
  }
]);

shValidationModule.directive('validIdNotNull', function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attr, ngModel) {
      ngModel.$formatters.unshift(function(value) {
        if ((value != null ? value.id : void 0) == null) {
          return null;
        }
        return value;
      });
    }
  };
});

angular.module('sh.view.helper', []).directive('yesNo', function() {
  return {
    restrict: 'A',
    scope: {
      yesNo: '='
    },
    template: function(element, attrs) {
      return '<span ng-if="yesNo == true" class="text-success"><i class="fa fa-left fa-check"></i>{{"LABEL_YES" | translate}}</span>\n<span ng-if="yesNo == false" class="text-danger"><i class="fa fa-left fa-times"></i>{{"LABEL_NO" | translate}}</span>\n<span ng-if="yesNo == null || yesNo == undefined" class="text-muted"><i class="fa fa-left fa-dash"></i></span>';
    },
    link: function(scope) {
      var ref, ref1;
      if ((ref = scope.yesNo) === true || ref === "true" || ref === 1 || ref === "TRUE") {
        scope.yesNo = true;
      }
      if ((ref1 = scope.yesNo) === false || ref1 === "false" || ref1 === 0 || ref1 === "FALSE") {
        scope.yesNo = false;
      }
    }
  };
}).directive('codeName', function() {
  return {
    restrict: 'EA',
    scope: {
      codeNameCode: '=?',
      codeNameName: '=?'
    },
    template: function(element, attrs) {
      return '<span title="{{codeNameCode}} ({{codeNameName}})">\n  {{codeNameCode}} <small class="text-muted">({{codeNameName}})</small>\n</span>';
    }
  };
});

angular.module('auth.token.handler', []).factory("AuthTokenHandler", [
  function() {
    var authToken, authTokenHandler, tokenWrapper, username;
    authTokenHandler = {};
    username = "none";
    authToken = "none";
    authTokenHandler.getUsername = function() {
      return username;
    };
    authTokenHandler.getAuthToken = function() {
      return authToken;
    };
    authTokenHandler.setUsername = function(newUsername) {
      username = newUsername;
    };
    authTokenHandler.setAuthToken = function(newAuthToken) {
      authToken = newAuthToken;
    };
    authTokenHandler.wrapActions = function(resource, actions) {
      var i, wrappedResource;
      wrappedResource = resource;
      i = 0;
      while (i < actions.length) {
        tokenWrapper(wrappedResource, actions[i]);
        i++;
      }
      return wrappedResource;
    };
    tokenWrapper = function(resource, action) {
      resource['_' + action] = resource[action];
      if (action === 'save' || action === 'update') {
        resource[action] = function(params, data, success, error) {
          return resource['_' + action](angular.extend({}, params || {}, {
            username: authTokenHandler.getUsername(),
            authn_token: authTokenHandler.getAuthToken()
          }), data, success, error);
        };
      } else {
        resource[action] = function(params, success, error) {
          return resource["_" + action](angular.extend({}, params || {}, {
            username: authTokenHandler.getUsername(),
            authn_token: authTokenHandler.getAuthToken()
          }), success, error);
        };
      }
    };
    return authTokenHandler;
  }
]);


/**
 * @ngdoc object
 * @name ShTableParams
 *
 * @description
 * ShTableParams factory
 *
 */
shTableModule.factory('ShTableParams', [
  '$q', function($q) {

    /**
     * @ngdoc method
     * @name ShTableParams
     *
     * @param {}
     *
     * @returns ShTableParams
     *
     * @description
     * ShTableParams self object
     *
     */
    var ShTableParams;
    ShTableParams = function(params) {
      var ref, ref1, ref2;
      this.$params = {
        pageNumber: (ref = params.pageNumber) != null ? ref : 1,
        perPage: (ref1 = params.perPage) != null ? ref1 : 10,
        sortInfo: params.sortInfo,
        sorting: params.sorting,
        autoload: (ref2 = params.autoload) != null ? ref2 : true
      };
      this.$totalCount = 0;
      this.$loading = false;
      this.$data = [];
      this.$extras = null;
      this.$pagination = [];

      /**
       * @ngdoc method
       * @name reload
       *
       * @param {}
       *
       * @returns {promise}
       *
       * @description
       * ShTableParams factory
       *
       */
      this.reload = function() {
        var deferred, self;
        deferred = $q.defer();
        self = this;
        self.$loading = true;
        params.getData().then(function(success) {
          self.$data = success.items;
          self.$totalCount = success.totalCount;
          if (success.extras != null) {
            self.$extras = success.extras;
          }
          self.$pagination = self.generatePagination(self.$params.pageNumber, self.$params.perPage, self.$totalCount);
          self.$loading = false;
          return deferred.resolve(success);
        }, function(error) {
          self.$loading = false;
          return deferred.reject(error);
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name isSortBy
       *
       * @param {}
       *
       * @returns {promise}
       *
       * @description
       * ShTableParams factory
       *
       */
      this.isSortBy = function(field, direction) {
        return angular.isDefined(this.$params.sorting[field]) && this.$params.sorting[field] === direction;
      };

      /**
       * @ngdoc method
       * @name sortData
       *
       * @param {}
       *
       * @returns {promise}
       *
       * @description
       * ShTableParams factory
       *
       */
      this.sortData = function(field, direction) {
        this.$params.sorting = {};
        this.$params.sorting[field] = direction;
      };

      /**
       * @ngdoc method
       * @name generatePagination
       *
       * @param {}
       *
       * @description
       * ShTableParams factory
       *
       */
      this.generatePagination = function(pageNumber, perPage, totalCount) {
        var currentPage, currentPageCount, deltaCurrent, fromNumber, i, maxPagesDisplayed, number, pageCount, pages, ref3, ref4, thruNumber;
        pages = [];
        currentPage = pageNumber;
        perPage = perPage;
        totalCount = totalCount;
        pageCount = Math.ceil(totalCount / perPage);
        currentPageCount = pageCount === 0 || pageCount === currentPage ? totalCount - perPage * (currentPage - 1) : perPage;
        maxPagesDisplayed = pageCount > 5 ? 5 : pageCount;
        deltaCurrent = currentPage - Math.ceil(maxPagesDisplayed / 2);
        if (deltaCurrent < 0) {
          deltaCurrent = 0;
        } else if ((deltaCurrent + maxPagesDisplayed) > pageCount) {
          deltaCurrent = pageCount - maxPagesDisplayed;
        }
        if (pageCount > 1) {
          fromNumber = deltaCurrent + 1;
          thruNumber = deltaCurrent + maxPagesDisplayed;
          for (number = i = ref3 = fromNumber, ref4 = thruNumber; ref3 <= ref4 ? i <= ref4 : i >= ref4; number = ref3 <= ref4 ? ++i : --i) {
            pages.push({
              type: 'PAGE',
              disabled: number === currentPage,
              number: number
            });
          }
          if (fromNumber > 1) {
            pages.unshift({
              type: 'MORE',
              disabled: true
            });
          }
          if (thruNumber < pageCount) {
            pages.push({
              type: 'MORE',
              disabled: true
            });
          }
          pages.unshift({
            type: 'PREV',
            disabled: currentPage === 1,
            number: currentPage - 1
          });
          pages.push({
            type: 'NEXT',
            disabled: currentPage === pageCount,
            number: currentPage + 1
          });
          pages.unshift({
            type: 'FIRST',
            disabled: currentPage === 1,
            number: 1
          });
          pages.push({
            type: 'LAST',
            disabled: currentPage === pageCount,
            number: pageCount
          });
        }
        return {
          pages: pages,
          currentPage: currentPage,
          perPage: perPage,
          totalCount: totalCount,
          pageCount: pageCount,
          currentPageCount: currentPageCount
        };
      };
      return this;
    };
    return ShTableParams;
  }
]);


/**
 * @ngdoc object
 * @name ShPersistenceHookNotification
 *
 * @description
 * ShPersistenceHookNotification factory
 *
 */
shPersistenceModule.factory('ShPersistenceHookNotification', [
  'ShNotification', function(ShNotification) {
    var ShPersistenceHookNotification;
    ShPersistenceHookNotification = function(params) {
      var self;
      self = this;
      self.shPersistence = params.shPersistence;
      self.shPersistence.newEntityErrorHooks.push(function(error) {
        ShNotification.toastByResponse(error);
      });
      self.shPersistence.createEntityErrorHooks.push(function(error) {
        ShNotification.toastByResponse(error);
      });
      self.shPersistence.editEntityErrorHooks.push(function(error) {
        ShNotification.toastByResponse(error);
      });
      self.shPersistence.updateEntityErrorHooks.push(function(error) {
        ShNotification.toastByResponse(error);
      });
      return this;
    };
    return ShPersistenceHookNotification;
  }
]);


/**
 * @ngdoc object
 * @name ShPersistenceHook
 *
 * @description
 * ShPersistenceHook factory
 *
 */
shPersistenceModule.factory('ShPersistenceHook', [
  '$q', 'ShApi', 'ShApiHook', 'ShPersistenceHookNotification', function($q, ShApi, ShApiHook, ShPersistenceHookNotification) {
    var ShPersistenceHook;
    ShPersistenceHook = function(params) {
      var base, base1, base2, base3, base4, self, shApi, shApiHook, shPersistenceHookNotification;
      self = this;
      self.shPersistence = params.shPersistence;
      if ((base = self.shPersistence).id == null) {
        base.id = null;
      }
      if ((base1 = self.shPersistence).resource == null) {
        base1.resource = null;
      }
      if ((base2 = self.shPersistence).entity == null) {
        base2.entity = {};
      }
      if ((base3 = self.shPersistence).lookup == null) {
        base3.lookup = {};
      }
      if ((base4 = self.shPersistence).optParams == null) {
        base4.optParams = {};
      }
      self.shPersistence.beforeNewEntityHooks = [];
      self.shPersistence.newEntitySuccessHooks = [];
      self.shPersistence.newEntityErrorHooks = [];
      self.shPersistence.afterNewEntityHooks = [];
      self.shPersistence.beforeCreateEntityHooks = [];
      self.shPersistence.createEntitySuccessHooks = [];
      self.shPersistence.createEntityErrorHooks = [];
      self.shPersistence.afterCreateEntityHooks = [];
      self.shPersistence.beforeEditEntityHooks = [];
      self.shPersistence.editEntitySuccessHooks = [];
      self.shPersistence.editEntityErrorHooks = [];
      self.shPersistence.afterEditEntityHooks = [];
      self.shPersistence.beforeUpdateEntityHooks = [];
      self.shPersistence.updateEntitySuccessHooks = [];
      self.shPersistence.updateEntityErrorHooks = [];
      self.shPersistence.afterUpdateEntityHooks = [];
      self.shPersistence.beforeDeleteEntityHooks = [];
      self.shPersistence.deleteEntitySuccessHooks = [];
      self.shPersistence.deleteEntityErrorHooks = [];
      self.shPersistence.afterDeleteEntityHooks = [];
      self.shPersistence.beforeInitEntityHooks = [];
      self.shPersistence.initEntitySuccessHooks = [];
      self.shPersistence.initEntityErrorHooks = [];
      self.shPersistence.afterInitEntityHooks = [];
      shApi = new ShApi({
        resource: self.shPersistence.resource
      });
      shApiHook = new ShApiHook({
        shApiInstance: self.shPersistence
      });
      shPersistenceHookNotification = new ShPersistenceHookNotification({
        shPersistence: self.shPersistence
      });

      /**
       * @ngdoc method
       * @name newEntity
       *
       * @description
       * New an entity
       *
       * @returns {promise}
       */
      self.shPersistence.newEntity = function() {
        var deferred, hook, i, len, ref;
        ref = self.shPersistence.beforeNewEntityHooks;
        for (i = 0, len = ref.length; i < len; i++) {
          hook = ref[i];
          hook();
        }
        deferred = $q.defer();
        shApi["new"](self.shPersistence.optParams).then(function(success) {
          var j, len1, ref1;
          self.shPersistence.entity = success.data;
          if (success.lookup != null) {
            self.shPersistence.lookup = success.lookup;
          }
          ref1 = self.shPersistence.newEntitySuccessHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(success);
          }
          return deferred.resolve(success);
        }, function(error) {
          var j, len1, ref1;
          ref1 = self.shPersistence.newEntityErrorHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(error);
          }
          return deferred.reject(error);
        })["finally"](function() {
          var j, len1, ref1, results;
          ref1 = self.shPersistence.afterNewEntityHooks;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            results.push(hook());
          }
          return results;
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name createEntity
       *
       * @description
       * Create/persist an entity to database
       *
       * @param {Object} entity Entity object which should not contain an id
       *
       * @returns {promise}
       */
      self.shPersistence.createEntity = function(entity) {
        var data, deferred, hook, i, len, ref;
        ref = self.shPersistence.beforeCreateEntityHooks;
        for (i = 0, len = ref.length; i < len; i++) {
          hook = ref[i];
          hook();
        }
        deferred = $q.defer();
        data = {
          data: entity
        };
        if (Object.prototype.toString.call(entity).slice(8, -1) === 'FormData') {
          data = entity;
        }
        shApi.create(self.shPersistence.optParams, data).then(function(success) {
          var j, len1, ref1;
          self.shPersistence.entity = success.data;
          if (success.lookup != null) {
            self.shPersistence.lookup = success.lookup;
          }
          ref1 = self.shPersistence.createEntitySuccessHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(success);
          }
          return deferred.resolve(success);
        }, function(error) {
          var j, len1, ref1;
          ref1 = self.shPersistence.createEntityErrorHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(error);
          }
          return deferred.reject(error);
        })["finally"](function() {
          var j, len1, ref1, results;
          ref1 = self.shPersistence.afterCreateEntityHooks;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            results.push(hook());
          }
          return results;
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name editEntity
       *
       * @description
       * Edit an entity
       *
       * @param {String} id Entity id in string or UUID
       *
       * @returns {promise}
       */
      self.shPersistence.editEntity = function(id) {
        var deferred, hook, i, len, ref;
        ref = self.shPersistence.beforeEditEntityHooks;
        for (i = 0, len = ref.length; i < len; i++) {
          hook = ref[i];
          hook();
        }
        deferred = $q.defer();
        if (!id) {
          id = self.shPersistence.id;
        }
        shApi.edit(id, self.shPersistence.optParams).then(function(success) {
          var j, len1, ref1;
          self.shPersistence.entity = success.data;
          if (success.lookup != null) {
            self.shPersistence.lookup = success.lookup;
          }
          ref1 = self.shPersistence.editEntitySuccessHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(success);
          }
          return deferred.resolve(success);
        }, function(error) {
          var j, len1, ref1;
          ref1 = self.shPersistence.editEntityErrorHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(error);
          }
          return deferred.reject(error);
        })["finally"](function() {
          var j, len1, ref1, results;
          ref1 = self.shPersistence.afterEditEntityHooks;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            results.push(hook());
          }
          return results;
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name updateEntity
       *
       * @description
       * Update an entity
       *
       * @param {String} id Entity id in string or UUID
       * @param {Object} entity Entity object which should contain an id
       *
       * @returns {promise}
       */
      self.shPersistence.updateEntity = function(id, entity) {
        var data, deferred, hook, i, len, ref;
        ref = self.shPersistence.beforeUpdateEntityHooks;
        for (i = 0, len = ref.length; i < len; i++) {
          hook = ref[i];
          hook();
        }
        deferred = $q.defer();
        if (angular.isObject(id)) {
          entity = id;
          id = self.shPersistence.id;
        }
        data = {
          data: entity
        };
        if (Object.prototype.toString.call(entity).slice(8, -1) === 'FormData') {
          data = entity;
        }
        shApi.update(id, self.shPersistence.optParams, data).then(function(success) {
          var j, len1, ref1;
          self.shPersistence.entity = success.data;
          if (success.lookup != null) {
            self.shPersistence.lookup = success.lookup;
          }
          ref1 = self.shPersistence.updateEntitySuccessHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(success);
          }
          return deferred.resolve(success);
        }, function(error) {
          var j, len1, ref1;
          ref1 = self.shPersistence.updateEntityErrorHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(error);
          }
          return deferred.reject(error);
        })["finally"](function() {
          var j, len1, ref1, results;
          ref1 = self.shPersistence.afterUpdateEntityHooks;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            results.push(hook());
          }
          return results;
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name deleteEntity
       *
       * @description
       * Delete an entity
       *
       * @param {String} id Entity id in string or UUID
       *
       * @returns {promise}
       */
      self.shPersistence.deleteEntity = function(id) {
        var deferred, hook, i, len, ref;
        ref = self.shPersistence.beforeDeleteEntityHooks;
        for (i = 0, len = ref.length; i < len; i++) {
          hook = ref[i];
          hook();
        }
        deferred = $q.defer();
        if (!id) {
          id = self.shPersistence.id;
        }
        shApi["delete"](id, self.shPersistence.optParams).then(function(success) {
          var j, len1, ref1;
          ref1 = self.shPersistence.deleteEntitySuccessHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(success);
          }
          return deferred.resolve(success);
        }, function(error) {
          var j, len1, ref1;
          ref1 = self.shPersistence.deleteEntityErrorHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(error);
          }
          return deferred.reject(error);
        })["finally"](function() {
          var j, len1, ref1, results;
          ref1 = self.shPersistence.afterDeleteEntityHooks;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            results.push(hook());
          }
          return results;
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name initEntity
       *
       * @description
       * Update an entity
       *
       * @param {String} id Entity id in string or UUID
       * @param {Object} entity Entity object which should contain an id
       *
       * @returns {promise}
       */
      self.shPersistence.initEntity = function() {
        var deferred, hook, i, len, ref;
        ref = self.shPersistence.beforeInitEntityHooks;
        for (i = 0, len = ref.length; i < len; i++) {
          hook = ref[i];
          hook();
        }
        deferred = $q.defer();
        $q.when(self.shPersistence.id != null ? self.shPersistence.editEntity(self.shPersistence.id) : self.shPersistence.newEntity()).then(function(success) {
          var j, len1, ref1;
          ref1 = self.shPersistence.initEntitySuccessHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(success);
          }
          return deferred.resolve(success);
        }, function(error) {
          var j, len1, ref1;
          ref1 = self.shPersistence.initEntityErrorHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(error);
          }
          return deferred.reject(error);
        })["finally"](function() {
          var j, len1, ref1, results;
          ref1 = self.shPersistence.afterInitEntityHooks;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            results.push(hook());
          }
          return results;
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name getLookup
       *
       * @description
       * Return an array of objects
       *
       * @param {String} key The expected local lookups key
       *
       * @returns {Object|Array} Reference to `obj`.
       */
      self.shPersistence.getLookup = function(key) {
        var ref;
        return (ref = self.shPersistence.lookup) != null ? ref[key] : void 0;
      };
      return this;
    };
    return ShPersistenceHook;
  }
]);


/**
 * @ngdoc object
 * @name ShPersistence
 *
 * @description
 * ShPersistence factory
 *
 */
shPersistenceModule.factory('ShPersistence', [
  '$q', 'ShPersistenceHook', function($q, ShPersistenceHook) {
    var ShPersistence;
    ShPersistence = function(params) {
      var ref, ref1, ref2, ref3, self, shPersistenceHook;
      self = this;
      self.entity = {};
      self.id = (ref = params.id) != null ? ref : null;
      self.localLookup = {};
      self.optParams = (ref1 = params.optParams) != null ? ref1 : {};
      self.resource = (ref2 = params.resource) != null ? ref2 : null;
      self.sorting = (ref3 = params.sorting) != null ? ref3 : {
        id: "desc"
      };
      shPersistenceHook = new ShPersistenceHook({
        shPersistence: self
      });
      return this;
    };
    return ShPersistence;
  }
]);


/**
 * @ngdoc object
 * @name ShTableFilterStorage
 *
 * @description
 * ShTableFilterStorage factory
 *
 */
shTableModule.factory('ShTableFilterStorage', [
  '$location', 'localStorageService', function($location, localStorageService) {
    var ShTableFilterStorage;
    ShTableFilterStorage = function(params) {
      var getCurrentFilterParams, getCurrentLocalStorage, self, setFilterCollection, setFilterLabel, setFilterParams, setLocalStorage, storageKey;
      self = this;
      self.shTable = params.shTable;
      storageKey = [self.shTable.name, $location.path()].join('');
      self.shTable.beforeRefreshGridHooks.push(function() {
        var collectionKey, currentFilterParams, currentLocalStorage, i, j, key, keysCollections, lastUnderscore, len, len1, new_key, obj, ref, ref1, resultFilterCollection, resultFilterLabel, resultFilterParams;
        currentFilterParams = (ref = getCurrentFilterParams()) != null ? ref : {};
        currentLocalStorage = getCurrentLocalStorage() === 'undefined' ? self.shTable.filterParams : getCurrentLocalStorage();
        resultFilterParams = self.shTable.filterParams.fromShFilter != null ? currentFilterParams : currentLocalStorage;
        resultFilterLabel = {};
        resultFilterCollection = {};
        if (resultFilterParams != null) {
          keysCollections = Object.keys(resultFilterParams);
          for (i = 0, len = keysCollections.length; i < len; i++) {
            key = keysCollections[i];
            lastUnderscore = key.lastIndexOf("_");
            new_key = key.substring(0, lastUnderscore);
            collectionKey = key.substring(lastUnderscore);
            if (new_key) {
              if (collectionKey === "_in") {
                resultFilterCollection[new_key] = [];
                ref1 = resultFilterParams[key];
                for (j = 0, len1 = ref1.length; j < len1; j++) {
                  obj = ref1[j];
                  resultFilterCollection[new_key].push({
                    value: obj
                  });
                }
                resultFilterLabel[new_key] = resultFilterParams[key].join(", ");
              } else {
                resultFilterLabel[new_key] = resultFilterParams[key];
              }
            } else {
              resultFilterLabel[key] = resultFilterParams[key];
            }
          }
          setFilterParams(resultFilterParams);
          setLocalStorage(resultFilterParams);
          setFilterLabel(resultFilterLabel);
          setFilterCollection(resultFilterCollection);
        }
      });
      getCurrentFilterParams = function() {
        return self.shTable.filterParams;
      };
      getCurrentLocalStorage = function() {
        return localStorageService.get(storageKey);
      };
      setFilterParams = function(currentLocalStorage) {
        self.shTable.filterParams = currentLocalStorage;
      };
      setLocalStorage = function(currentLocalStorage) {
        return localStorageService.set(storageKey, currentLocalStorage);
      };
      setFilterLabel = function(resultFilterLabel) {
        self.shTable.filterLabel = resultFilterLabel;
      };
      setFilterCollection = function(resultFilterCollection) {
        self.shTable.filterCollection = resultFilterCollection;
      };
      return this;
    };
    return ShTableFilterStorage;
  }
]);


/**
 * @ngdoc object
 * @name ShTableFilter
 *
 * @description
 * ShTableFilter factory
 *
 */
shTableModule.factory('ShTableFilter', [
  '$filter', 'HelperService', function($filter, HelperService) {
    var ShTableFilter;
    ShTableFilter = function(params) {
      var base, dateParams, numberParams, self;
      self = this;
      self.shTable = params.shTable;
      if ((base = self.shTable).filterParams == null) {
        base.filterParams = {};
      }
      self.shTable.filterRegion = {
        visible: true
      };
      dateParams = {};
      self.shTable.filterLabel = {};
      self.shTable.filterCollection = {};
      self.shTable.prepareFilterDate = function(shFilter) {
        dateParams = {};
        delete self.shTable.filterParams[shFilter + "_eqdate"];
        delete self.shTable.filterParams[shFilter + "_lteqdate"];
        return delete self.shTable.filterParams[shFilter + "_gteqdate"];
      };
      self.shTable.executeFilterDate = function() {
        jQuery.extend(self.shTable.filterParams, dateParams);
        self.shTable.tableParams.$params.pageNumber = 1;
        return self.shTable.refreshGrid();
      };
      self.shTable.filterDateLabel = function(keyword, shFilter, n) {
        switch (keyword) {
          case 'ANY':
            return $filter('translate')('LABEL_ALL');
          case 'TODAY':
            return $filter('translate')('LABEL_TODAY');
          case 'PAST_N_DAYS':
            return $filter('translate')('LABEL_FROM') + ' ' + (n === 1 ? $filter('translate')('LABEL_YESTERDAY') : moment().subtract(n, 'days').fromNow());
          case 'PAST_N_WEEKS':
            return $filter('translate')('LABEL_FROM') + ' ' + moment().subtract(n, 'weeks').fromNow();
          case 'PAST_N_MONTHS':
            return $filter('translate')('LABEL_FROM') + ' ' + moment().subtract(n, 'months').fromNow();
          case 'PAST_N_YEARS':
            return $filter('translate')('LABEL_FROM') + ' ' + moment().subtract(n, 'years').fromNow();
          case 'NEXT_N_DAYS':
            if (n === 1) {
              return $filter('translate')('LABEL_THRU') + ' ' + $filter('translate')('LABEL_TOMORROW');
            } else {
              return moment().add(n, 'days').fromNow() + ' ' + $filter('translate')('LABEL_AHEAD');
            }
            break;
          case 'NEXT_N_WEEKS':
            return moment().add(n, 'weeks').fromNow() + ' ' + $filter('translate')('LABEL_AHEAD');
          case 'NEXT_N_MONTHS':
            return moment().add(n, 'months').fromNow() + ' ' + $filter('translate')('LABEL_AHEAD');
          case 'NEXT_N_YEARS':
            return moment().add(n, 'years').fromNow() + ' ' + $filter('translate')('LABEL_AHEAD');
        }
      };
      self.shTable.filterDate = function(keyword, shFilter, n) {
        var fromDate, thruDate;
        if (keyword === 'RANGE' || keyword === 'CERTAIN') {
          switch (keyword) {
            case 'RANGE':
              fromDate = self.shTable.filterParams[shFilter + "_gteqdate"];
              thruDate = self.shTable.filterParams[shFilter + "_lteqdate"];
              self.shTable.prepareFilterDate(shFilter);
              self.shTable.filterDateRange(shFilter, fromDate, thruDate);
              self.shTable.filterLabel[shFilter] = moment(fromDate).format('DD-MM-YYYY') + ' - ' + moment(thruDate).format('DD-MM-YYYY');
              break;
            case 'CERTAIN':
              fromDate = self.shTable.filterParams[shFilter + "_gteqdate"];
              thruDate = fromDate;
              self.shTable.prepareFilterDate(shFilter);
              self.shTable.filterDateRange(shFilter, fromDate, thruDate);
              self.shTable.filterLabel[shFilter] = moment(fromDate).format('DD-MM-YYYY');
          }
        } else {
          self.shTable.prepareFilterDate(shFilter);
          switch (keyword) {
            case 'ANY':
              self.shTable.filterDateAny(shFilter);
              break;
            case 'TODAY':
              self.shTable.filterDateToday(shFilter);
              break;
            case 'PAST_N_DAYS':
              self.shTable.filterDatePastNDays(shFilter, n);
              break;
            case 'PAST_N_WEEKS':
              self.shTable.filterDatePastNWeeks(shFilter, n);
              break;
            case 'PAST_N_MONTHS':
              self.shTable.filterDatePastNMonths(shFilter, n);
              break;
            case 'PAST_N_YEARS':
              self.shTable.filterDatePastNYears(shFilter, n);
              break;
            case 'NEXT_N_DAYS':
              self.shTable.filterDateNextNDays(shFilter, n);
              break;
            case 'NEXT_N_WEEKS':
              self.shTable.filterDateNextNWeeks(shFilter, n);
              break;
            case 'NEXT_N_MONTHS':
              self.shTable.filterDateNextNMonths(shFilter, n);
              break;
            case 'NEXT_N_YEARS':
              self.shTable.filterDateNextNYears(shFilter, n);
          }
          self.shTable.filterLabel[shFilter] = self.shTable.filterDateLabel(keyword, shFilter, n);
        }
        return self.shTable.executeFilterDate();
      };
      self.shTable.filterDateAny = function(shFilter) {

        /* */
      };
      self.shTable.filterDateToday = function(shFilter) {
        dateParams[shFilter + "_eqdate"] = moment().format('YYYY-MM-DD');
      };
      self.shTable.filterDatePastNDays = function(shFilter, n) {
        dateParams[shFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
        dateParams[shFilter + "_gteqdate"] = moment().subtract(n, 'days').format('YYYY-MM-DD');
      };
      self.shTable.filterDatePastNWeeks = function(shFilter, n) {
        dateParams[shFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
        dateParams[shFilter + "_gteqdate"] = moment().subtract(n, 'weeks').format('YYYY-MM-DD');
      };
      self.shTable.filterDatePastNMonths = function(shFilter, n) {
        dateParams[shFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
        dateParams[shFilter + "_gteqdate"] = moment().subtract(n, 'months').format('YYYY-MM-DD');
      };
      self.shTable.filterDatePastNYears = function(shFilter, n) {
        dateParams[shFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
        dateParams[shFilter + "_gteqdate"] = moment().subtract(n, 'years').format('YYYY-MM-DD');
      };
      self.shTable.filterDateNextNDays = function(shFilter, n) {
        dateParams[shFilter + "_lteqdate"] = moment().add(n, 'days').format('YYYY-MM-DD');
        dateParams[shFilter + "_gteqdate"] = moment().format('YYYY-MM-DD');
      };
      self.shTable.filterDateNextNWeeks = function(shFilter, n) {
        dateParams[shFilter + "_lteqdate"] = moment().add(n, 'weeks').format('YYYY-MM-DD');
        dateParams[shFilter + "_gteqdate"] = moment().format('YYYY-MM-DD');
      };
      self.shTable.filterDateNextNMonths = function(shFilter, n) {
        dateParams[shFilter + "_lteqdate"] = moment().add(n, 'months').format('YYYY-MM-DD');
        dateParams[shFilter + "_gteqdate"] = moment().format('YYYY-MM-DD');
      };
      self.shTable.filterDateNextNYears = function(shFilter, n) {
        dateParams[shFilter + "_lteqdate"] = moment().add(n, 'years').format('YYYY-MM-DD');
        dateParams[shFilter + "_gteqdate"] = moment().format('YYYY-MM-DD');
      };
      self.shTable.filterDateRange = function(shFilter, fromDate, thruDate) {
        dateParams[shFilter + "_gteqdate"] = fromDate;
        dateParams[shFilter + "_lteqdate"] = thruDate;
      };
      numberParams = {};
      self.shTable.prepareFilterNumber = function(shFilter) {
        numberParams = {};
        delete self.shTable.filterParams[shFilter + "_eq"];
        delete self.shTable.filterParams[shFilter + "_lteq"];
        return delete self.shTable.filterParams[shFilter + "_gteq"];
      };
      self.shTable.executeFilterNumber = function() {
        jQuery.extend(self.shTable.filterParams, numberParams);
        self.shTable.tableParams.$params.pageNumber = 1;
        return self.shTable.refreshGrid();
      };
      self.shTable.filterNumberLabel = function(keyword, shFilter, leftNumber, rightNumber) {
        var eqNumber;
        if (leftNumber == null) {
          leftNumber = numberParams[shFilter + "_gteq"];
        }
        if (rightNumber == null) {
          rightNumber = numberParams[shFilter + "_lteq"];
        }
        eqNumber = numberParams[shFilter + "_eq"] != null ? numberParams[shFilter + "_eq"] : leftNumber;
        switch (keyword) {
          case 'ANY':
            return $filter('translate')('LABEL_ALL');
          case 'BETWEEN':
            return $filter('number')(leftNumber) + ' - ' + $filter('number')(rightNumber);
          case 'LOWER_THAN':
            return '≤ ' + $filter('number')(rightNumber);
          case 'GREATER_THAN':
            return '≥ ' + $filter('number')(leftNumber);
          case 'RANGE':
            if ((leftNumber != null) && (rightNumber != null)) {
              if (leftNumber === rightNumber) {
                return $filter('number')(leftNumber);
              } else {
                return $filter('number')(leftNumber) + ' - ' + $filter('number')(rightNumber);
              }
            } else if (leftNumber != null) {
              return '≥ ' + $filter('number')(leftNumber);
            } else if (rightNumber != null) {
              return '≤ ' + $filter('number')(rightNumber);
            } else {
              return $filter('translate')('LABEL_ALL');
            }
            break;
          case 'CERTAIN':
            return $filter('number')(eqNumber);
        }
      };
      self.shTable.filterNumber = function(keyword, shFilter, leftNumber, rightNumber) {
        var eqNumber;
        switch (keyword) {
          case 'ANY':
            self.shTable.prepareFilterNumber(shFilter);
            self.shTable.filterNumberAny(shFilter);
            break;
          case 'BETWEEN':
            self.shTable.prepareFilterNumber(shFilter);
            self.shTable.filterNumberRange(shFilter, leftNumber, rightNumber);
            break;
          case 'LOWER_THAN':
            rightNumber = self.shTable.filterParams[shFilter + "_lteq"];
            self.shTable.prepareFilterNumber(shFilter);
            self.shTable.filterNumberRange(shFilter, null, rightNumber);
            break;
          case 'GREATER_THAN':
            leftNumber = self.shTable.filterParams[shFilter + "_gteq"];
            self.shTable.prepareFilterNumber(shFilter);
            self.shTable.filterNumberRange(shFilter, leftNumber, null);
            break;
          case 'RANGE':
            leftNumber = self.shTable.filterParams[shFilter + "_gteq"];
            rightNumber = self.shTable.filterParams[shFilter + "_lteq"];
            self.shTable.prepareFilterNumber(shFilter);
            self.shTable.filterNumberRange(shFilter, leftNumber, rightNumber);
            break;
          case 'CERTAIN':
            eqNumber = self.shTable.filterParams[shFilter + "_eq"];
            self.shTable.prepareFilterNumber(shFilter);
            self.shTable.filterNumberSpecific(shFilter, eqNumber);
        }
        self.shTable.filterLabel[shFilter] = self.shTable.filterNumberLabel(keyword, shFilter);
        return self.shTable.executeFilterNumber();
      };
      self.shTable.filterNumberAny = function(shFilter) {};
      self.shTable.filterNumberSpecific = function(shFilter, number) {
        numberParams[shFilter + "_eq"] = number;
      };
      self.shTable.filterNumberRange = function(shFilter, leftNumber, rightNumber) {
        if (leftNumber != null) {
          numberParams[shFilter + "_gteq"] = leftNumber;
        }
        if (rightNumber != null) {
          numberParams[shFilter + "_lteq"] = rightNumber;
        }
        if ((leftNumber != null) && (rightNumber != null) && leftNumber > rightNumber) {
          numberParams[shFilter + "_gteq"] = rightNumber;
          numberParams[shFilter + "_lteq"] = leftNumber;
        }
      };
      self.shTable.filterTextCont = function(shFilter) {
        self.shTable.tableParams.$params.pageNumber = 1;
        self.shTable.filterParams['fromShFilter'] = true;
        return self.shTable.refreshGrid();
      };
      self.shTable.getLabelTextCont = function(shFilter) {
        return self.shTable.filterParams[shFilter + "_cont"] || null;
      };
      self.shTable.filterYearBetween = function(shFilter, year) {
        self.shTable.filterParams[shFilter + '_month'] = null;
        self.shTable.filterParams[shFilter + '_year'] = year;
        self.shTable.filterParams[shFilter + '_lteqdate'] = year + '-12-31';
        self.shTable.filterParams[shFilter + '_gteqdate'] = year + '-01-01';
        self.shTable.filterParams['fromShFilter'] = true;
        return self.shTable.refreshGrid();
      };
      self.shTable.filterMonthBetween = function(shFilter, month) {
        var mDate, year;
        if (self.shTable.filterParams[shFilter + '_year']) {
          year = self.shTable.filterParams[shFilter + '_year'];
          month = ('00' + month).slice(-2);
          self.shTable.filterParams[shFilter + '_month'] = month;
          mDate = moment(year + '-' + month + '-01');
          self.shTable.filterParams[shFilter + '_lteqdate'] = mDate.endOf('month').format('YYYY-MM-DD');
          self.shTable.filterParams[shFilter + '_gteqdate'] = mDate.startOf('month').format('YYYY-MM-DD');
        }
        self.shTable.filterParams['fromShFilter'] = true;
        return self.shTable.refreshGrid();
      };
      self.shTable.filterInCollection = function(shFilter, key) {
        if (key == null) {
          key = null;
        }
        if (key != null) {
          self.shTable.filterLabel[shFilter] = self.shTable.filterCollection[shFilter].map(function(o) {
            return $filter('translate')(o[key + '']);
          }).join(', ');
          self.shTable.filterParams[shFilter + '_in'] = self.shTable.filterCollection[shFilter].map(function(o) {
            return o[key + ''];
          });
        } else {
          self.shTable.filterLabel[shFilter] = self.shTable.filterCollection[shFilter].map(function(o) {
            return $filter('translate')(o);
          }).join(', ');
          self.shTable.filterParams[shFilter + '_in'] = self.shTable.filterCollection[shFilter];
        }
        self.shTable.filterParams['fromShFilter'] = true;
        return self.shTable.refreshGrid();
      };
      self.shTable.collectionNavbarFilterSelect = function(shFilter, item, key) {
        if (key == null) {
          key = null;
        }
        if (self.shTable.filterCollection[shFilter] == null) {
          self.shTable.filterCollection[shFilter] = [];
        }
        HelperService.rowSelect(item, self.shTable.filterCollection[shFilter], key);
        return self.shTable.filterInCollection(shFilter, key);
      };
      self.shTable.collectionNavbarFilterDeselect = function(shFilter, item, key) {
        if (key == null) {
          key = null;
        }
        if (self.shTable.filterCollection[shFilter] == null) {
          self.shTable.filterCollection[shFilter] = [];
        }
        HelperService.rowDeselect(item, self.shTable.filterCollection[shFilter], key);
        return self.shTable.filterInCollection(shFilter, key);
      };
      self.shTable.collectionNavbarFilterIsSelected = function(shFilter, item, key) {
        if (key == null) {
          key = null;
        }
        if (self.shTable.filterCollection[shFilter] == null) {
          self.shTable.filterCollection[shFilter] = [];
        }
        return HelperService.isRowSelected(item, self.shTable.filterCollection[shFilter], key);
      };
      self.shTable.collectionNavbarClearSelection = function(shFilter, key) {
        if (key == null) {
          key = null;
        }
        if (self.shTable.filterCollection[shFilter] == null) {
          self.shTable.filterCollection[shFilter] = [];
        }
        HelperService.clearRowSelection(self.shTable.filterCollection[shFilter]);
        return self.shTable.filterInCollection(shFilter, key);
      };
      self.shTable.collectionNavbarFilterIsSelectionEmpty = function(shFilter, key) {
        if (key == null) {
          key = null;
        }
        if (self.shTable.filterCollection[shFilter] == null) {
          self.shTable.filterCollection[shFilter] = [];
        }
        return HelperService.isRowSelectionEmpty(self.shTable.filterCollection[shFilter]);
      };
      self.shTable.toggleFilterRegion = function() {
        self.shTable.filterRegion.visible = !self.shTable.filterRegion.visible;
      };
      self.shTable.resetFilter = function() {
        var k, ref, v;
        self.shTable.filterParams = {};
        self.shTable.filterLabel = {};
        ref = self.shTable.filterCollection;
        for (k in ref) {
          v = ref[k];
          HelperService.clearRowSelection(self.shTable.filterCollection[k]);
        }
        self.shTable.filterParams['fromShFilter'] = true;
        return self.shTable.refreshGrid();
      };
      self.shTable.isNoFilter = function() {
        return jQuery.isEmptyObject(self.shTable.filterParams);
      };
      return this;
    };
    return ShTableFilter;
  }
]);


/**
 * @ngdoc object
 * @name ShTableHelper
 *
 * @description
 * ShTableHelper factory
 *
 */
shTableModule.factory('ShTableHelper', [
  '$q', function($q) {
    var ShTableHelper;
    ShTableHelper = function(params) {
      var self;
      self = this;
      self.shTable = params.shTable;

      /**
       * @ngdoc method
       * @name sortableClass
       *
       * @description
       * Get CSS class based on sortable state
       *
       * @param {String} fieldName Field/column name
       *
       * @returns {String} class for CSS usage
       */
      self.shTable.sortableClass = function(fieldName) {
        if (self.shTable.tableParams.isSortBy(fieldName, 'asc')) {
          return 'sortable sort-asc';
        } else if (self.shTable.tableParams.isSortBy(fieldName, 'desc')) {
          return 'sortable sort-desc';
        } else {
          return 'sortable';
        }
      };

      /**
       * @ngdoc method
       * @name sortableClick
       *
       * @description
       * Called from ng-click as <th> attributes within ng-table
       * Call ng-table tableParams sorting
       *
       * @param {String} fieldName Field/column name
       *
       * @returns {String} class for CSS usage
       */
      self.shTable.sortableClick = function(fieldName) {
        var newDirection;
        newDirection = self.shTable.tableParams.isSortBy(fieldName, 'asc') ? 'desc' : 'asc';
        self.shTable.tableParams.sortData(fieldName, newDirection);
        self.shTable.refreshGrid();
      };

      /**
       * @ngdoc method
       * @name rowRestEventClass
       *
       * @description
       * Get CSS class based on state
       * Priority is important. `'recently-deleted'` must come first, then `'recently-updated'` and `'recently-created'`
       *
       * @param {Object} entity Entity object or string `UUID`
       *
       * @returns {String} class for CSS usage
       */
      self.shTable.rowRestEventClass = function(obj) {
        if (self.shTable.isRecentlyDeleted(obj)) {
          return 'recently-deleted';
        }
        if (self.shTable.isRecentlyUpdated(obj)) {
          return 'recently-updated';
        }
        if (self.shTable.isRecentlyCreated(obj)) {
          return 'recently-created';
        }
        return '';
      };

      /**
       * @ngdoc method
       * @name isRecentlyCreated
       *
       * @description
       * Return true if given object/entity/entity-id is recently created (found in createdIds)
       *
       * @param {Object} entity Entity object or string `UUID`
       *
       * @returns {Boolean}
       */
      self.shTable.isRecentlyCreated = function(obj) {
        return self.shTable.createdIds.indexOf((obj != null ? obj.id : void 0) || obj) >= 0;
      };

      /**
       * @ngdoc method
       * @name isRecentlyUpdated
       *
       * @description
       * Return true if given object/entity/entity-id is recently updated (found in updatedIds)
       *
       * @param {Object} entity Entity object or string `UUID`
       *
       * @returns {Boolean}
       */
      self.shTable.isRecentlyUpdated = function(obj) {
        return self.shTable.updatedIds.indexOf((obj != null ? obj.id : void 0) || obj) >= 0;
      };

      /**
       * @ngdoc method
       * @name isRecentlyDeleted
       *
       * @description
       * Return true if given object/entity/entity-id is recently deleted (found in deletedIds)
       *
       * @param {Object} entity Entity object or string `UUID`
       *
       * @returns {Boolean}
       */
      self.shTable.isRecentlyDeleted = function(obj) {
        return self.shTable.deletedIds.indexOf((obj != null ? obj.id : void 0) || obj) >= 0;
      };
      return this;
    };
    return ShTableHelper;
  }
]);


/**
 * @ngdoc object
 * @name ShTableHookNotification
 *
 * @description
 * ShTableHookNotification factory
 *
 */
shTableModule.factory('ShTableHookNotification', [
  'ShNotification', function(ShNotification) {
    var ShTableHookNotification;
    ShTableHookNotification = function(params) {
      var self;
      self = this;
      self.shTable = params.shTable;
      self.shTable.getEntitiesErrorHooks.push(function(error) {
        ShNotification.toastByResponse(error);
      });
      self.shTable.newEntityErrorHooks.push(function(error) {
        ShNotification.toastByResponse(error);
      });
      self.shTable.createEntityErrorHooks.push(function(error) {
        ShNotification.toastByResponse(error);
      });
      self.shTable.editEntityErrorHooks.push(function(error) {
        ShNotification.toastByResponse(error);
      });
      self.shTable.updateEntityErrorHooks.push(function(error) {
        ShNotification.toastByResponse(error);
      });
      self.shTable.deleteEntityErrorHooks.push(function(error) {
        ShNotification.toastByResponse(error);
      });
      return this;
    };
    return ShTableHookNotification;
  }
]);


/**
 * @ngdoc object
 * @name ShTableHook
 *
 * @description
 * ShTableHook factory
 *
 */
shTableModule.factory('ShTableHook', [
  '$q', 'localStorageService', 'ShApi', 'ShApiHook', 'ShTableHookNotification', function($q, localStorageService, ShApi, ShApiHook, ShTableHookNotification) {
    var ShTableHook;
    ShTableHook = function(params) {
      var base, base1, base2, base3, self, shApi, shApiHook, shTableHookNotification;
      self = this;
      self.shTable = params.shTable;
      if ((base = self.shTable).resource == null) {
        base.resource = null;
      }
      if ((base1 = self.shTable).entity == null) {
        base1.entity = {};
      }
      if ((base2 = self.shTable).lookup == null) {
        base2.lookup = {};
      }
      if ((base3 = self.shTable).optParams == null) {
        base3.optParams = {};
      }
      self.shTable.createdIds = [];
      self.shTable.updatedIds = [];
      self.shTable.deletedIds = [];
      self.shTable.beforeGetEntitiesHooks = [];
      self.shTable.getEntitiesSuccessHooks = [];
      self.shTable.getEntitiesErrorHooks = [];
      self.shTable.afterGetEntitiesHooks = [];
      self.shTable.beforeNewEntityHooks = [];
      self.shTable.newEntitySuccessHooks = [];
      self.shTable.newEntityErrorHooks = [];
      self.shTable.afterNewEntityHooks = [];
      self.shTable.beforeCreateEntityHooks = [];
      self.shTable.createEntitySuccessHooks = [];
      self.shTable.createEntityErrorHooks = [];
      self.shTable.afterCreateEntityHooks = [];
      self.shTable.beforeEditEntityHooks = [];
      self.shTable.editEntitySuccessHooks = [];
      self.shTable.editEntityErrorHooks = [];
      self.shTable.afterEditEntityHooks = [];
      self.shTable.beforeUpdateEntityHooks = [];
      self.shTable.updateEntitySuccessHooks = [];
      self.shTable.updateEntityErrorHooks = [];
      self.shTable.afterUpdateEntityHooks = [];
      self.shTable.beforeDeleteEntityHooks = [];
      self.shTable.deleteEntitySuccessHooks = [];
      self.shTable.deleteEntityErrorHooks = [];
      self.shTable.afterDeleteEntityHooks = [];
      shApi = new ShApi({
        resource: self.shTable.resource
      });
      shApiHook = new ShApiHook({
        shApiInstance: self.shTable
      });
      shTableHookNotification = new ShTableHookNotification({
        shTable: self.shTable
      });

      /**
       * @ngdoc method
       * @name getEntities
       *
       * @description
       * Get list of entities based on `optParams`
       *
       * @returns {promise}
       */
      self.shTable.getEntities = function() {
        var deferred, hook, i, len, ref;
        ref = self.shTable.beforeGetEntitiesHooks;
        for (i = 0, len = ref.length; i < len; i++) {
          hook = ref[i];
          hook();
        }
        deferred = $q.defer();
        shApi.index(self.shTable.optParams).then(function(success) {
          var j, len1, ref1;
          ref1 = self.shTable.getEntitiesSuccessHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(success);
          }
          return deferred.resolve(success);
        }, function(error) {
          var j, len1, ref1;
          ref1 = self.shTable.getEntitiesErrorHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(error);
          }
          return deferred.reject(error);
        })["finally"](function() {
          var j, len1, ref1, results;
          ref1 = self.shTable.afterGetEntitiesHooks;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            results.push(hook());
          }
          return results;
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name newEntity
       *
       * @description
       * New an entity
       *
       * @returns {promise}
       */
      self.shTable.newEntity = function() {
        var deferred, hook, i, len, ref;
        ref = self.shTable.beforeNewEntityHooks;
        for (i = 0, len = ref.length; i < len; i++) {
          hook = ref[i];
          hook();
        }
        deferred = $q.defer();
        shApi["new"](self.shTable.optParams).then(function(success) {
          var j, len1, ref1;
          self.shTable.entity = success.data;
          if (success.lookup != null) {
            self.shTable.lookup = success.lookup;
          }
          ref1 = self.shTable.newEntitySuccessHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(success);
          }
          return deferred.resolve(success);
        }, function(error) {
          var j, len1, ref1;
          ref1 = self.shTable.newEntityErrorHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(error);
          }
          return deferred.reject(error);
        })["finally"](function() {
          var j, len1, ref1, results;
          ref1 = self.shTable.afterNewEntityHooks;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            results.push(hook());
          }
          return results;
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name createEntity
       *
       * @description
       * Create/persist an entity to database
       *
       * @param {Object} entity Entity object which should not contain an id
       *
       * @returns {promise}
       */
      self.shTable.createEntity = function(entity) {
        var data, deferred, hook, i, len, ref;
        ref = self.shTable.beforeCreateEntityHooks;
        for (i = 0, len = ref.length; i < len; i++) {
          hook = ref[i];
          hook();
        }
        deferred = $q.defer();
        data = {
          data: entity
        };
        if (Object.prototype.toString.call(entity).slice(8, -1) === 'FormData') {
          data = entity;
        }
        shApi.create(self.shTable.optParams, data).then(function(success) {
          var j, len1, ref1;
          self.shTable.createdIds.push(success.data.id);
          self.shTable.entity = success.data;
          if (success.lookup != null) {
            self.shTable.lookup = success.lookup;
          }
          self.shTable.refreshGrid();
          ref1 = self.shTable.createEntitySuccessHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(success);
          }
          return deferred.resolve(success);
        }, function(error) {
          var j, len1, ref1;
          ref1 = self.shTable.createEntityErrorHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(error);
          }
          return deferred.reject(error);
        })["finally"](function() {
          var j, len1, ref1, results;
          ref1 = self.shTable.afterCreateEntityHooks;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            results.push(hook());
          }
          return results;
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name editEntity
       *
       * @description
       * Edit an entity
       *
       * @param {String} id Entity id in string or UUID
       *
       * @returns {promise}
       */
      self.shTable.editEntity = function(id) {
        var deferred, hook, i, len, ref;
        ref = self.shTable.beforeEditEntityHooks;
        for (i = 0, len = ref.length; i < len; i++) {
          hook = ref[i];
          hook();
        }
        deferred = $q.defer();
        shApi.edit(id, self.shTable.optParams).then(function(success) {
          var j, len1, ref1;
          self.shTable.entity = success.data;
          if (success.lookup != null) {
            self.shTable.lookup = success.lookup;
          }
          ref1 = self.shTable.editEntitySuccessHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(success);
          }
          return deferred.resolve(success);
        }, function(error) {
          var j, len1, ref1;
          ref1 = self.shTable.editEntityErrorHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(error);
          }
          return deferred.reject(error);
        })["finally"](function() {
          var j, len1, ref1, results;
          ref1 = self.shTable.afterEditEntityHooks;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            results.push(hook());
          }
          return results;
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name updateEntity
       *
       * @description
       * Update an entity
       *
       * @param {String} id Entity id in string or UUID
       * @param {Object} entity Entity object which should contain an id
       *
       * @returns {promise}
       */
      self.shTable.updateEntity = function(id, entity) {
        var data, deferred, hook, i, len, ref;
        ref = self.shTable.beforeUpdateEntityHooks;
        for (i = 0, len = ref.length; i < len; i++) {
          hook = ref[i];
          hook();
        }
        deferred = $q.defer();
        data = {
          data: entity
        };
        if (Object.prototype.toString.call(entity).slice(8, -1) === 'FormData') {
          data = entity;
        }
        shApi.update(id, self.shTable.optParams, data).then(function(success) {
          var j, len1, ref1;
          self.shTable.updatedIds.push(success.data.id);
          self.shTable.entity = success.data;
          if (success.lookup != null) {
            self.shTable.lookup = success.lookup;
          }
          self.shTable.refreshGrid();
          ref1 = self.shTable.updateEntitySuccessHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(success);
          }
          return deferred.resolve(success);
        }, function(error) {
          var j, len1, ref1;
          ref1 = self.shTable.updateEntityErrorHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(error);
          }
          return deferred.reject(error);
        })["finally"](function() {
          var j, len1, ref1, results;
          ref1 = self.shTable.afterUpdateEntityHooks;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            results.push(hook());
          }
          return results;
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name deleteEntity
       *
       * @description
       * Delete an entity
       *
       * @param {String} id Entity id in string or UUID
       *
       * @returns {promise}
       */
      self.shTable.deleteEntity = function(id) {
        var deferred, hook, i, len, ref;
        ref = self.shTable.beforeDeleteEntityHooks;
        for (i = 0, len = ref.length; i < len; i++) {
          hook = ref[i];
          hook();
        }
        deferred = $q.defer();
        shApi["delete"](id, self.shTable.optParams).then(function(success) {
          var j, len1, ref1;
          self.shTable.deletedIds.push(id);
          self.shTable.refreshGrid();
          ref1 = self.shTable.deleteEntitySuccessHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(success);
          }
          return deferred.resolve(success);
        }, function(error) {
          var j, len1, ref1;
          ref1 = self.shTable.deleteEntityErrorHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(error);
          }
          return deferred.reject(error);
        })["finally"](function() {
          var j, len1, ref1, results;
          ref1 = self.shTable.afterDeleteEntityHooks;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            results.push(hook());
          }
          return results;
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name getLookup
       *
       * @description
       * Return an array of objects
       *
       * @param {String} key The expected local lookups key
       *
       * @returns {Object|Array} Reference to `obj`.
       */
      self.shTable.getLookup = function(key) {
        var ref;
        return (ref = self.shTable.lookup) != null ? ref[key] : void 0;
      };
      return this;
    };
    return ShTableHook;
  }
]);


/**
 * @ngdoc object
 * @name ShTableParamsHook
 *
 * @description
 * ShTableParamsHook factory
 *
 */
shTableModule.factory('ShTableParamsHook', [
  '$q', function($q) {
    var ShTableParamsHook;
    ShTableParamsHook = function(params) {
      var self;
      self = this;
      self.shTable = params.shTable;
      self.shTable.beforeRefreshGridHooks = [];
      self.shTable.refreshGridSuccessHooks = [];
      self.shTable.refreshGridErrorHooks = [];
      self.shTable.afterRefreshGridHooks = [];

      /**
       * @ngdoc method
       * @name goToPage
       *
       * @description
       * Assign page number to `this.tableParams.$params.pageNumber`, then calling `this.refreshGrid()` in appropriate format
       *
       * @returns {*}
       */
      self.shTable.goToPage = function(pageNumber, perPage) {
        if (pageNumber != null) {
          self.shTable.tableParams.$params.perPage = perPage || self.shTable.tableParams.$params.perPage;
          self.shTable.tableParams.$params.pageNumber = pageNumber;
        }
        self.shTable.refreshGrid();
      };

      /**
       * @ngdoc method
       * @name refreshGrid
       *
       * @description
       * Calling `tableParams.reload()`
       *
       * @returns {*}
       */
      self.shTable.refreshGrid = function() {
        var deferred, hook, i, len, ref;
        ref = self.shTable.beforeRefreshGridHooks;
        for (i = 0, len = ref.length; i < len; i++) {
          hook = ref[i];
          hook();
        }
        deferred = $q.defer();
        self.shTable.tableParams.reload().then(function(success) {
          var j, len1, ref1;
          ref1 = self.shTable.refreshGridSuccessHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(success);
          }
          return deferred.resolve(success);
        }, function(error) {
          var j, len1, ref1;
          ref1 = self.shTable.refreshGridErrorHooks;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            hook(error);
          }
          return deferred.reject(error);
        })["finally"](function() {
          var j, len1, ref1, results;
          ref1 = self.shTable.afterRefreshGridHooks;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            hook = ref1[j];
            results.push(hook());
          }
          return results;
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name getPagedDataAsync
       *
       * @description
       * Calling `this.getEntities()` after processing `this.optParams`
       *
       * @returns {promise}
       */
      self.shTable.getPagedDataAsync = function() {
        var deferred;
        deferred = $q.defer();
        self.shTable.getEntities().then(function(success) {
          return deferred.resolve({
            items: success.data.items,
            totalCount: success.data.total_server_items
          });
        });
        return deferred.promise;
      };
      return this;
    };
    return ShTableParamsHook;
  }
]);


/**
 * @ngdoc object
 * @name ShTableProcessor
 *
 * @description
 * ShTableProcessor factory
 *
 */
shTableModule.factory('ShTableProcessor', [
  function() {
    var ShTableProcessor;
    ShTableProcessor = function() {
      var self;
      self = this;

      /**
       * @ngdoc method
       * @name generateGridParams
       *
       * @description
       * Generate appropriate GET parameters from `tableParams.$params`.
       * Providing `column_defs`, `page`, `per_page`, `sort_info`, and `filter_params`
       *
       * @returns {Object} Grid params object
       */
      self.generateGridParams = function(opts) {
        var directions, fields, gridParams, params, property;
        params = opts.params;
        fields = [];
        directions = [];
        for (property in params.sorting) {
          fields.push(property);
          directions.push(params.sorting[property]);
        }
        gridParams = {
          page: params.pageNumber,
          per_page: params.perPage,
          sort_info: JSON.stringify({
            fields: fields,
            directions: directions
          }),
          filter_params: {},
          column_defs: JSON.stringify(self.getProcessedColumnDefs(opts.columnDefs))
        };
        if (opts.filterParams) {
          angular.extend(gridParams.filter_params, opts.filterParams);
        }
        return gridParams;
      };

      /**
       * @ngdoc method
       * @name getProcessedColumnDefs
       *
       * @description
       * Returns processedColumnDefs
       *
       * @param Array columnDefs
       *
       * @returns Array class for CSS usage
       */
      self.getProcessedColumnDefs = function(columnDefs) {
        var columnDef, i, len, processedColumnDefs;
        processedColumnDefs = [];
        for (i = 0, len = columnDefs.length; i < len; i++) {
          columnDef = columnDefs[i];
          if (columnDef.field !== '') {
            processedColumnDefs.push({
              field: columnDef.field
            });
          }
        }
        return processedColumnDefs;
      };
      return this;
    };
    return ShTableProcessor;
  }
]);


/**
 * @ngdoc object
 * @name ShTableParams
 *
 * @description
 * ShTableParams factory
 *
 */
shTableModule.factory('ShTable', [
  '$q', 'ShTableFilter', 'ShTableHelper', 'ShTableHook', 'ShTableParamsHook', 'ShTableProcessor', 'ShTableFilterStorage', 'ShTableParams', function($q, ShTableFilter, ShTableHelper, ShTableHook, ShTableParamsHook, ShTableProcessor, ShTableFilterStorage, ShTableParams) {

    /**
     * @ngdoc method
     * @name ShTableParams
     *
     * @param {}
     *
     * @returns ShTableParams
     *
     * @description
     * ShTableParams self object
     *
     */
    var ShTable;
    ShTable = function(params) {
      var ref, ref1, ref2, ref3, ref4, ref5, ref6, self, shTableFilter, shTableFilterStorage, shTableHelper, shTableHook, shTableParamsHook, shTableProcessor;
      self = this;
      self.entity = {};
      self.columnDefs = (ref = params.columnDefs) != null ? ref : [];
      self.filterParams = (ref1 = params.filterParams) != null ? ref1 : {};
      self.localLookup = {};
      self.name = (ref2 = params.name) != null ? ref2 : '';
      self.optParams = (ref3 = params.optParams) != null ? ref3 : {};
      self.perPage = (ref4 = params.perPage) != null ? ref4 : 10;
      self.resource = (ref5 = params.resource) != null ? ref5 : null;
      self.sorting = (ref6 = params.sorting) != null ? ref6 : {};
      shTableFilter = new ShTableFilter({
        shTable: self
      });
      shTableHelper = new ShTableHelper({
        shTable: self
      });
      shTableHook = new ShTableHook({
        shTable: self
      });
      shTableParamsHook = new ShTableParamsHook({
        shTable: self
      });
      shTableProcessor = new ShTableProcessor();
      shTableFilterStorage = new ShTableFilterStorage({
        shTable: self
      });
      self.tableParams = new ShTableParams({
        pageNumber: 1,
        perPage: self.perPage,
        sortInfo: 'this is sort info',
        sorting: self.sorting,
        getData: function() {
          var gridParams;
          gridParams = shTableProcessor.generateGridParams({
            params: self.tableParams.$params,
            columnDefs: self.columnDefs,
            filterParams: self.filterParams
          });
          angular.extend(self.optParams, gridParams);
          return self.getPagedDataAsync();
        }
      });
      return this;
    };
    return ShTable;
  }
]);


/**
 * @ngdoc object
 * @name ShForm
 *
 * @description
 * ShForm factory
 *
 */
shFormModule.factory('ShForm', [
  function() {
    var ShForm;
    ShForm = function() {
      var self;
      self = this;
      self.entityForm = null;

      /**
       * @ngdoc method
       * @name validationClass
       *
       * @description
       * Gives elements a class that mark its fieldname state
       *
       * @returns {String} String as class that mark element state
       */
      self.validationClass = function(fieldName) {
        var ref, result;
        result = '';
        if (((ref = self.entityForm) != null ? ref[fieldName] : void 0) != null) {
          if (self.entityForm[fieldName].$invalid) {
            if (self.entityForm[fieldName].$dirty) {
              result += 'has-error ';
            } else {
              result += 'has-pristine-error ';
            }
          } else if (self.entityForm[fieldName].$dirty && self.entityForm[fieldName].$valid) {
            result += 'has-success ';
          }
        }
        return result;
      };

      /**
       * @ngdoc method
       * @name reset
       *
       * @description
       * Resset all the form state. `$dirty: false`, `$pristine: true`, `$submitted: false`, `$invalid: true`
       *
       * @returns {*}
       */
      self.reset = function() {
        var ref, ref1;
        if ((ref = self.entityForm) != null) {
          ref.$setPristine();
        }
        return (ref1 = self.entityForm) != null ? ref1.$setUntouched() : void 0;
      };

      /**
       * @ngdoc method
       * @name resetSubmitted
       *
       * @description
       * Set `$submitted` to `false`, but not change the `$dirty` state.
       * Should be used for failing submission.
       *
       * @returns {*}
       */
      self.resetSubmitted = function() {
        var ref;
        return (ref = self.entityForm) != null ? ref.$submitted = false : void 0;
      };

      /**
       * @ngdoc method
       * @name isDisabled
       *
       * @description
       * Return this entity form state
       *
       * @returns {Boolean} entityForm state
       */
      self.isDisabled = function() {
        var ref, ref1, ref2;
        if (self.entityForm == null) {
          return true;
        }
        return ((ref = self.entityForm) != null ? ref.$pristine : void 0) || ((ref1 = self.entityForm) != null ? ref1.$invalid : void 0) || ((ref2 = self.entityForm) != null ? ref2.$submitted : void 0);
      };

      /**
       * @ngdoc method
       * @name isCompleted
       *
       * @description
       * Predicate to check whether the form in completed
       *
       * @returns {Boolean} true if `$pristine`, `$valid`, & not in `$submitted` state
       */
      self.isCompleted = function() {
        var ref, ref1;
        return ((ref = self.entityForm) != null ? ref.$pristine : void 0) && ((ref1 = self.entityForm) != null ? ref1.$valid : void 0) && !self.entityForm.$submitted;
      };

      /**
       * @ngdoc method
       * @name isDirtyAndValid
       *
       * @description
       * Predicate to check whether the form in `$dirty` and `$valid` state
       *
       * @returns {Boolean} true if `$dirty` and `$valid`
       */
      self.isDirtyAndValid = function() {
        var ref, ref1;
        return ((ref = self.entityForm) != null ? ref.$dirty : void 0) && ((ref1 = self.entityForm) != null ? ref1.$valid : void 0);
      };

      /**
       * @ngdoc method
       * @name isDirtyAndInvalid
       *
       * @description
       * Predicate to check whether the form in `$dirty` and `$invalid` state
       *
       * @returns {Boolean} true if `$dirty` and `$invalid`
       */
      self.isDirtyAndInvalid = function() {
        var ref, ref1;
        return ((ref = self.entityForm) != null ? ref.$dirty : void 0) && ((ref1 = self.entityForm) != null ? ref1.$invalid : void 0);
      };

      /**
       * @ngdoc method
       * @name isResetButtonDisabled
       *
       * @description
       * Predicate to check whether the reset button should disabled or not
       *
       * @returns {Boolean} true if `$pristine` or `$submitted`
       */
      self.isResetButtonDisabled = function() {
        var ref, ref1;
        return ((ref = self.entityForm) != null ? ref.$pristine : void 0) || ((ref1 = self.entityForm) != null ? ref1.$submitted : void 0);
      };
      return this;
    };
    return ShForm;
  }
]);


/**
 * @ngdoc object
 * @name ShApiHook
 *
 * @description
 * ShApiHook factory
 *
 */
shApiModule.factory('ShApiHook', [
  '$q', 'ShApi', function($q, ShApi) {
    var ShApiHook;
    ShApiHook = function(params) {
      var base, base1, base2, self, shApi;
      self = this;
      self.shApiInstance = params.shApiInstance;
      if ((base = self.shApiInstance).resource == null) {
        base.resource = null;
      }
      if ((base1 = self.shApiInstance).entity == null) {
        base1.entity = {};
      }
      if ((base2 = self.shApiInstance).optParams == null) {
        base2.optParams = {};
      }
      self.shApiInstance.updatedIds = [];
      self.shApiInstance.deletedIds = [];
      self.shApiInstance.beforeApiCallEntityHooks = {};
      self.shApiInstance.apiCallEntitySuccessHooks = {};
      self.shApiInstance.apiCallEntityErrorHooks = {};
      self.shApiInstance.afterApiCallEntityHooks = {};
      shApi = new ShApi({
        resource: self.shApiInstance.resource
      });

      /**
       * @ngdoc method
       * @name apiCall
       *
       * @description
       * Call api by name
       *
       * @param {Object} opts Parameter objects method, name, id, entity
       *
       * @returns {promise}
       */
      self.shApiInstance.apiCallEntity = function(opts) {
        var apiParameters, base3, base4, base5, base6, data, deferred, hook, i, len, name, name1, name2, name3, ref, ref1;
        deferred = $q.defer();
        if (!((opts.method != null) && ((ref = opts.method) === 'GET' || ref === 'POST' || ref === 'PUT' || ref === 'DELETE'))) {
          console.error('STARQLE_NG_UTIL: Unknown Method');
          deferred.reject({});
        } else if (opts.name == null) {
          console.error('STARQLE_NG_UTIL: Options name is required');
          deferred.reject({});
        } else {
          apiParameters = {
            name: opts.name,
            method: opts.method,
            params: self.shApiInstance.optParams
          };
          if (opts.id) {
            apiParameters.id = opts.id;
          }
          switch (opts.method) {
            case 'GET':
            case 'DELETE':
              if (opts.entity != null) {
                console.error('STARQLE_NG_UTIL: Options entity should not be provided');
                deferred.reject({});
              }
              break;
            case 'POST':
            case 'PUT':
              if (opts.entity == null) {
                console.error('STARQLE_NG_UTIL: Options entity is required');
                deferred.reject({});
              } else {
                data = {
                  data: opts.entity
                };
                if (Object.prototype.toString.call(opts.entity).slice(8, -1) === 'FormData') {
                  data = opts.entity;
                }
                apiParameters.data = data;
              }
          }
          if ((base3 = self.shApiInstance.beforeApiCallEntityHooks)[name = opts.name] == null) {
            base3[name] = [];
          }
          if ((base4 = self.shApiInstance.apiCallEntitySuccessHooks)[name1 = opts.name] == null) {
            base4[name1] = [];
          }
          if ((base5 = self.shApiInstance.apiCallEntityErrorHooks)[name2 = opts.name] == null) {
            base5[name2] = [];
          }
          if ((base6 = self.shApiInstance.afterApiCallEntityHooks)[name3 = opts.name] == null) {
            base6[name3] = [];
          }
          ref1 = self.shApiInstance.beforeApiCallEntityHooks[opts.name];
          for (i = 0, len = ref1.length; i < len; i++) {
            hook = ref1[i];
            hook();
          }
          shApi.apiCall(apiParameters).then(function(success) {
            var j, len1, ref2;
            ref2 = self.shApiInstance.apiCallEntitySuccessHooks[opts.name];
            for (j = 0, len1 = ref2.length; j < len1; j++) {
              hook = ref2[j];
              hook(success);
            }
            return deferred.resolve(success);
          }, function(error) {
            var j, len1, ref2;
            ref2 = self.shApiInstance.apiCallEntityErrorHooks[opts.name];
            for (j = 0, len1 = ref2.length; j < len1; j++) {
              hook = ref2[j];
              hook(error);
            }
            return deferred.reject(error);
          })["finally"](function() {
            var j, len1, ref2, results;
            ref2 = self.shApiInstance.afterApiCallEntityHooks[opts.name];
            results = [];
            for (j = 0, len1 = ref2.length; j < len1; j++) {
              hook = ref2[j];
              results.push(hook());
            }
            return results;
          });
        }
        return deferred.promise;
      };
      return this;
    };
    return ShApiHook;
  }
]);


/**
 * @ngdoc object
 * @name ShApi
 *
 * @description
 * ShApi factory
 *
 */
shApiModule.factory('ShApi', [
  '$q', function($q) {
    var ShApi;
    ShApi = function(params) {
      var self;
      self = this;
      self.resource = params.resource;

      /**
       * @ngdoc method
       * @name index
       *
       * @description
       * Get list of records based on params. `GET`
       *
       * @param {Object} params Parameter objects
       *
       * @returns {promise}
       */
      self.index = function(params) {
        var deferred;
        deferred = $q.defer();
        self.resource.get(params).$promise.then(function(success) {
          return deferred.resolve(success);
        }, function(error) {
          return deferred.reject(error);
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name new
       *
       * @description
       * Get a new Record. `GET`
       *
       * @returns {promise}
       */
      self["new"] = function(params) {
        var deferred;
        deferred = $q.defer();
        self.resource["new"](params).$promise.then(function(success) {
          return deferred.resolve(success);
        }, function(error) {
          return deferred.reject(error);
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name create
       *
       * @description
       * Create/persist an record to database. `POST`
       *
       * @param {Object} params Parameter objects
       * @param {Object} data Data object. Usualy it's formed `{data: entity}`
       *
       * @returns {promise}
       */
      self.create = function(params, data) {
        var deferred;
        deferred = $q.defer();
        self.resource.save(params, data).$promise.then(function(success) {
          return deferred.resolve(success);
        }, function(error) {
          return deferred.reject(error);
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name edit
       *
       * @description
       * Get a record, equals with show. `GET`
       *
       * @param {String} id Record id in string or UUID
       * @param {Object} params Parameter objects
       *
       * @returns {promise}
       */
      self.edit = function(id, params) {
        var deferred;
        deferred = $q.defer();
        self.resource.edit(angular.extend({
          id: id
        }, params)).$promise.then(function(success) {
          return deferred.resolve(success);
        }, function(error) {
          return deferred.reject(error);
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name update
       *
       * @description
       * Update a record
       *
       * @param {String} id Record id in string or UUID. `PUT`
       * @param {Object} params Parameter objects
       * @param {Object} data Data object. Usualy it's formed `{data: entity}`
       *
       * @returns {promise}
       */
      self.update = function(id, params, data) {
        var deferred;
        deferred = $q.defer();
        self.resource.update(angular.extend({
          id: id
        }, params), data).$promise.then(function(success) {
          return deferred.resolve(success);
        }, function(error) {
          return deferred.reject(error);
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name delete
       *
       * @description
       * Delete a record. `DELETE`
       *
       * @param {String} id Record id in string or UUID
       * @param {Object} params Parameter objects
       *
       * @returns {promise}
       */
      self["delete"] = function(id, params) {
        var deferred;
        deferred = $q.defer();
        self.resource["delete"](angular.extend({
          id: id
        }, params)).$promise.then(function(success) {
          return deferred.resolve(success);
        }, function(error) {
          return deferred.reject(error);
        });
        return deferred.promise;
      };

      /**
       * @ngdoc method
       * @name apiCall
       *
       * @description
       * apiCall `GET`
       * apiCall `POST`
       * apiCall `PUT`
       * apiCall `DELETE`
       *
       * @param {String} id Record id in string or UUID
       * @param {Object} params Parameter objects
       *
       * @returns {promise}
       */
      self.apiCall = function(opts) {
        var deferred;
        deferred = $q.defer();
        switch (opts.method) {
          case 'GET':
          case 'DELETE':
            self.resource[opts.name](angular.extend({
              id: opts.id
            }, opts.params)).$promise.then(function(success) {
              return deferred.resolve(success);
            }, function(error) {
              return deferred.reject(error);
            });
            break;
          case 'POST':
          case 'PUT':
            self.resource[opts.name](angular.extend({
              id: opts.id
            }, opts.params), opts.data).$promise.then(function(success) {
              return deferred.resolve(success);
            }, function(error) {
              return deferred.reject(error);
            });
            break;
          default:
            console.error('STARQLE_NG_UTIL: Unknown Method');
            deferred.reject({});
        }
        return deferred.promise;
      };
      return this;
    };
    return ShApi;
  }
]);

angular.module('sh.filter.collection', []).filter("shFilterCollection", function() {
  return function(collection, callback, entity) {
    if (collection && entity) {
      return collection.filter(function(item) {
        return callback(item, entity);
      });
    }
  };
}).filter('searchAnyIn', [
  '$filter', function($filter) {
    return function(collection, fields, query) {
      if (!query) {
        return collection;
      } else {
        return collection.filter(function(item) {
          var field, i, len, result;
          result = false;
          for (i = 0, len = fields.length; i < len; i++) {
            field = fields[i];
            if (!result) {
              result = result || item[field].toLowerCase().indexOf(query.toLowerCase()) >= 0;
            }
          }
          return result;
        });
      }
    };
  }
]);

angular.module('sh.floating.precision', []).filter("shFloatingPrecision", function() {
  return function(value, accuracy) {
    if (accuracy == null) {
      accuracy = 12;
    }
    return parseFloat(value.toPrecision(accuracy));
  };
});

angular.module('sh.range', []).filter("shRange", function() {
  return function(input, min, max, interval) {
    var i;
    if (interval) {
      interval = parseInt(interval);
    } else {
      interval = 1;
    }
    min = parseInt(min);
    max = parseInt(max);
    i = min;
    while (i < max) {
      input.push(i);
      i += interval;
    }
    return input;
  };
});

angular.module('sh.remove.duplicates', []).filter("shRemoveDuplicates", [
  function() {
    return function(collection, fieldName, callback) {
      var aggregateItems, i, item, key, len, newArray, newCollection, newItem, value;
      if (collection) {
        newArray = [];
        newCollection = {};
        aggregateItems = {};
        for (i = 0, len = collection.length; i < len; i++) {
          item = collection[i];
          newCollection[item[fieldName]] = angular.extend({}, item);
          newItem = newCollection[item[fieldName]];
          if (typeof callback === 'function') {
            callback(newItem, newItem[fieldName], aggregateItems);
          }
        }
        for (key in newCollection) {
          value = newCollection[key];
          value[fieldName] = key;
          newArray.push(value);
        }
        return newArray;
      }
    };
  }
]);

angular.module('sh.strip.html', []).filter("shStripHtml", function() {
  return function(value) {
    if (!value) {
      return "";
    } else {
      return value.replace(/<[^>]+>/gm, '');
    }
  };
});

angular.module('sh.strip.to.newline', []).filter("shStripToNewline", function() {
  return function(value) {
    if (!value) {
      return "";
    } else {
      return value.replace(/\s-\s/g, '<br/>');
    }
  };
});

angular.module('sh.truncate', []).filter("shTruncate", [
  function() {
    return function(text, wordwise, max, tail) {
      var lastspace;
      if (!text) {
        return '';
      }
      max = parseInt(max, 10);
      if (!max) {
        return text;
      }
      if (text.length <= max) {
        return text;
      }
      text = text.substr(0, max);
      if (wordwise) {
        lastspace = text.lastIndexOf(' ');
        if (lastspace !== -1) {
          text = text.substr(0, lastspace);
        }
      }
      return text + (tail || ' ...');
    };
  }
]);

angular.module('sh.notification', []).service("ShNotification", [
  '$timeout', '$interval', function($timeout, $interval) {
    var defaultDuration, defaultLifetime;
    defaultLifetime = 3000;
    defaultDuration = 500;
    this.toasts = [];
    this.notifications = [];
    this.addToast = function(options, lifetimeOpt, durationOpt) {
      var opts;
      opts = {
        index: 0,
        lifetime: defaultLifetime,
        duration: defaultDuration,
        beforeAdd: function() {},
        afterAdd: function() {},
        beforeRemove: function() {},
        afterRemove: function() {}
      };
      if ((options.type != null) && (options.message != null)) {
        opts.toast = options;
        if (lifetimeOpt != null) {
          opts.lifetime = lifetimeOpt;
        }
        if (durationOpt != null) {
          opts.duration = durationOpt;
        }
        opts.toast.deathtime = Date.now() + opts.lifetime;
        opts.toast.alive = true;
      } else {
        angular.extend(opts, options);
      }
      opts.beforeAdd.call(this);
      this.toasts.unshift(opts.toast);
      opts.afterAdd.call(this);
    };
    this.removeOldestToast = function() {
      this.removeToast(this.toasts.length - 1);
    };
    this.removeToast = function(options, lifetimeOpt, durationOpt) {
      var opts, toasts;
      opts = {
        index: 0,
        lifetime: defaultLifetime,
        duration: defaultDuration,
        beforeRemove: function() {},
        afterRemove: function() {}
      };
      if (typeof (options * 1) === "number" && isFinite(options * 1)) {
        opts.index = options * 1;
        if (lifetimeOpt != null) {
          opts.lifetime = lifetimeOpt;
        }
        if (durationOpt != null) {
          opts.duration = durationOpt;
        }
      } else {
        angular.extend(opts, options);
      }
      toasts = this.toasts;
      opts.beforeRemove.call(this);
      angular.element("#toast-group-item-" + opts.index).animate({
        height: 0,
        opacity: 0
      }, opts.duration);
      $timeout(function() {
        toasts.splice(opts.index, 1);
        return opts.afterRemove.call(this);
      }, opts.duration + 1);
    };
    this.runInterval = function(self) {
      $interval(function() {
        var i, j, len, ref, ref1, results, toast;
        ref = self.toasts;
        results = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          toast = ref[i];
          if (toast.alive && toast.deathtime < Date.now()) {
            toast.alive = false;
            if ((ref1 = toast.type) !== 'error' && ref1 !== 'danger') {
              results.push(self.removeToast(i, 1));
            } else {
              results.push(void 0);
            }
          } else {
            results.push(void 0);
          }
        }
        return results;
      }, 500, 0, false);
    };
    this.addNotification = function(options) {
      var opts;
      opts = {
        index: 0,
        beforeAdd: function() {},
        afterAdd: function() {},
        beforeRemove: function() {},
        afterRemove: function() {}
      };
      if ((options.type != null) && (options.message != null)) {
        opts.notification = options;
      } else {
        angular.extend(opts, options);
      }
      opts.beforeAdd.call(this);
      this.notifications.unshift(opts.notification);
      opts.afterAdd.call(this);
    };
    this.removeNotification = function(options, durationOpt) {
      var notifications, opts;
      opts = {
        index: 0,
        duration: defaultDuration,
        beforeRemove: function() {},
        afterRemove: function() {}
      };
      if (typeof (options * 1) === "number" && isFinite(options * 1)) {
        opts.index = options * 1;
        if (durationOpt != null) {
          opts.duration = durationOpt;
        }
      } else {
        angular.extend(opts, options);
      }
      notifications = this.notifications;
      opts.beforeRemove.call(this);
      angular.element("#notification-group-item-" + opts.index).animate({
        height: 0,
        opacity: 0
      }, opts.duration);
      $timeout(function() {
        notifications.splice(opts.index, 1);
        return opts.afterRemove.call(this);
      }, opts.duration);
    };
    this.toastByResponse = function(response, defaultToast) {
      var fn, fn1, j, k, len, len1, n, ref, ref1;
      if (response.notification) {
        ref = response.notification.notifications;
        fn = (function(_this) {
          return function(n) {
            return _this.addToast({
              type: n.type,
              data: response,
              message: n.message,
              field: n.field
            });
          };
        })(this);
        for (j = 0, len = ref.length; j < len; j++) {
          n = ref[j];
          fn(n);
        }
      } else if (response.data && response.data.error) {
        ref1 = response.data.error.errors;
        fn1 = (function(_this) {
          return function(n) {
            return _this.addToast({
              type: 'danger',
              data: response,
              message: n.message,
              field: n.field
            });
          };
        })(this);
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          n = ref1[k];
          fn1(n);
        }
      } else if (defaultToast) {
        this.addToast({
          type: defaultToast.type,
          data: response,
          message: defaultToast.message,
          field: defaultToast.field
        });
      } else {
        this.addToast({
          type: 'danger',
          data: response,
          message: response.data
        });
      }
    };
    this.runInterval(this);
  }
]);

angular.module("sh.page.service", []).service("ShPageService", [
  '$window', function($window) {
    var _appName, _pageTitle;
    _pageTitle = '';
    _appName = '';
    this.setPageTitle = function(pageTitle) {
      _pageTitle = pageTitle;
      $window.document.title = this.getAppName() + ' - ' + this.getPageTitle();
      this.getPageTitle();
    };
    this.getPageTitle = function() {
      return _pageTitle;
    };
    this.setAppName = function(appName) {
      _appName = appName;
      $window.document.title = this.getAppName() + ' - ' + this.getPageTitle();
      this.getAppName();
    };
    this.getAppName = function() {
      return _appName;
    };
  }
]);

shSpinningModule.service("ShSpinningService", function() {
  var spinningStates;
  spinningStates = {};

  /**
   * @ngdoc method
   * @name spin
   *
   * @description
   * Get CSS class based on sortable state
   *
   * @param {String} key shSpinning directive value that used as a key
   * @param {Boolean=} spinning `true` to spin or `false` to stop. default is `true`
   *
   * @returns {*}
   */
  this.spin = function(key, spinning) {
    if (spinning == null) {
      spinning = true;
    }
    if (spinning) {
      spinningStates[key] = true;
    } else {
      this.stop(key);
    }
  };

  /**
   * @ngdoc method
   * @name stop
   *
   * @description
   * Stopping spinner.
   * Call `ShSpinningService.stop('some-key')` is equals to `ShSpinningService.spin('some-key', false)`.
   *
   * @param {String} key shSpinning directive value that used as a key
   *
   * @returns {*} class for CSS usage
   */
  this.stop = function(key) {
    delete spinningStates[key];
  };

  /**
   * @ngdoc method
   * @name isSpinning
   *
   * @description
   * Check whether a loading spinner is on spinning state
   *
   * @param {String} key shSpinning directive value that used as a key
   *
   * @returns {Boolean}
   */
  this.isSpinning = function(key) {
    return spinningStates[key] === true;
  };
});

shHelperModule.service("HelperService", [
  function() {
    this.rowSelect = function(obj, collections, key) {
      var idx;
      if (key != null) {
        idx = collections.map(function(o) {
          return o[key + ''];
        }).indexOf(obj[key + '']);
      } else {
        idx = collections.indexOf(obj);
      }
      if (idx < 0) {
        collections.push(obj);
      }
    };
    this.rowDeselect = function(obj, collections, key) {
      var idx;
      if (key != null) {
        idx = collections.map(function(o) {
          return o[key + ''];
        }).indexOf(obj[key + '']);
      } else {
        idx = collections.indexOf(obj);
      }
      if (idx >= 0) {
        collections.splice(idx, 1);
      }
    };
    this.clearRowSelection = function(collections) {
      collections.splice(0);
    };
    this.rowToggle = function(obj, collections, key) {
      if (this.isRowSelected(obj, collections, key)) {
        this.rowDeselect(obj, collections, key);
      } else {
        this.rowSelect(obj, collections, key);
      }
    };
    this.isRowSelected = function(obj, collections, key) {
      if (key != null) {
        return collections.map(function(o) {
          return o[key + ''];
        }).indexOf(obj[key + '']) >= 0;
      } else {
        return collections.indexOf(obj) >= 0;
      }
    };
    this.getRowSelection = function(collections, key) {
      if (key != null) {
        return collections.map(function(o) {
          return o[key + ''];
        });
      } else {
        return collections;
      }
    };
    this.totalRowSelection = function(collections) {
      return collections.length;
    };
    this.isRowSelectionEmpty = function(collections) {
      return this.totalRowSelection(collections) === 0;
    };
    this.selectAttributes = function(object) {
      var args, i, key, len, result;
      if (object != null) {
        args = Array.prototype.slice.call(arguments, 1);
        result = {};
        for (i = 0, len = args.length; i < len; i++) {
          key = args[i];
          result[key] = object[key];
        }
        return result;
      } else {
        return object;
      }
    };
    this.findById = function(source, id) {
      return source.filter(function(obj) {
        return +obj.id === +id;
      });
    };
    this.findFirstById = function(source, id) {
      var ref;
      return (ref = source.filter(function(obj) {
        return +obj.id === +id;
      })[0]) != null ? ref : {};
    };
    this.findByField = function(source, value) {
      return source.filter(function(obj) {
        return obj.field === value;
      });
    };
    this.findByElmt = function(source, elmt) {
      return source.filter(function(obj) {
        return +obj === +elmt;
      });
    };
  }
]);

angular.module('starqle.ng.util', ['on.root.scope', 'sh.bootstrap', 'sh.collapsible', 'sh.focus', 'sh.number.format', 'sh.segment', 'sh.submit', 'sh.view.helper', 'auth.token.handler', 'sh.filter.collection', 'sh.floating.precision', 'sh.range', 'sh.remove.duplicates', 'sh.strip.html', 'sh.strip.to.newline', 'sh.truncate', 'sh.api.module', 'sh.datepicker.module', 'sh.dialog.module', 'sh.form.module', 'sh.helper.module', 'sh.persistence.module', 'sh.spinning.module', 'sh.table.module', 'sh.validation.module', 'sh.notification', 'sh.page.service']);

}());
