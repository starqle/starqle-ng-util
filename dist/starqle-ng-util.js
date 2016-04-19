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
        var displayFormat, dpChange, formatter, parser, ref, setupDatepicker, updateDate, updateIcon, updateMaxDate, updateMinDate, valueFormat;
        valueFormat = 'YYYY-MM-DD';
        displayFormat = (ref = scope.shDisplayFormat) != null ? ref : 'DD-MM-YYYY';
        formatter = function(value) {
          if (value != null) {
            return moment(value).format(displayFormat);
          } else {
            return null;
          }
        };
        ngModelCtrl.$formatters.push(formatter);
        parser = function(value) {
          if (moment(value, displayFormat).isValid()) {
            return moment(value, displayFormat).format(valueFormat);
          } else {
            value = null;
            return void 0;
          }
        };
        ngModelCtrl.$parsers.push(parser);
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
          var ref1, ref2;
          if (value != null) {
            if ((ref1 = element.data('DateTimePicker')) != null) {
              ref1.minDate(moment(value));
            }
          } else {
            if ((ref2 = element.data('DateTimePicker')) != null) {
              ref2.minDate(false);
            }
          }
        };
        updateMaxDate = function(value) {
          var ref1, ref2;
          if (value != null) {
            if ((ref1 = element.data('DateTimePicker')) != null) {
              ref1.maxDate(moment(value));
            }
          } else {
            if ((ref2 = element.data('DateTimePicker')) != null) {
              ref2.maxDate(false);
            }
          }
        };
        updateIcon = function(obj) {
          if (obj != null) {
            element.data('DateTimePicker').icons(obj);
          }
        };
        dpChange = function(data) {
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
          if (newVal != null) {
            setupDatepicker(ngModelCtrl.$modelValue);
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
        shDisplayFormat: '@?',
        shFromTime: '=?',
        shIcons: '=?',
        shThruTime: '=?',
        widgetVerticalPosition: '@?'
      },
      require: '?ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        var displayFormat, dpChange, formatter, parser, ref, setupDatepicker, updateDate, updateIcon, updateMaxDate, updateMinDate, valueFormat;
        valueFormat = 'x';
        displayFormat = (ref = scope.shDisplayFormat) != null ? ref : 'DD-MM-YYYY, HH:mm (z)';
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
          if (moment.tz(value, displayFormat, moment.defaultZone.name).isValid()) {
            return moment.tz(value, displayFormat, moment.defaultZone.name).format(valueFormat);
          } else {
            value = null;
            return void 0;
          }
        };
        ngModelCtrl.$parsers.push(parser);
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
          var ref1, ref2;
          if (value != null) {
            if (!(isNaN(value) && moment(value, moment.ISO_8601).isValid())) {
              value *= 1;
            }
            if ((ref1 = element.data('DateTimePicker')) != null) {
              ref1.minDate(moment(value).tz(moment.defaultZone.name));
            }
          } else {
            if ((ref2 = element.data('DateTimePicker')) != null) {
              ref2.minDate(false);
            }
          }
        };
        updateMaxDate = function(value) {
          var ref1, ref2;
          if (value != null) {
            if (!(isNaN(value) && moment(value, moment.ISO_8601).isValid())) {
              value *= 1;
            }
            if ((ref1 = element.data('DateTimePicker')) != null) {
              ref1.maxDate(moment(value).tz(moment.defaultZone.name));
            }
          } else {
            if ((ref2 = element.data('DateTimePicker')) != null) {
              ref2.maxDate(false);
            }
          }
        };
        updateIcon = function(obj) {
          if (obj != null) {
            element.data('DateTimePicker').icons(obj);
          }
        };
        dpChange = function(data) {
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
          if (newVal != null) {
            setupDatepicker(ngModelCtrl.$modelValue);
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
          var ref, ref1, shDateFormat, shDatetimeFormat;
          if (scope.shDatetime != null) {
            if (moment(scope.shDatetime, 'YYYY-MM-DD', true).isValid()) {
              shDateFormat = (ref = scope.shDateFormat) != null ? ref : 'DD-MM-YYYY';
              return moment(scope.shDatetime).format(shDateFormat);
            } else {
              if (!(isNaN(scope.shDatetime) && moment(scope.shDatetime, moment.ISO_8601).isValid())) {
                scope.shDatetime *= 1;
              }
              shDatetimeFormat = (ref1 = scope.shDatetimeFormat) != null ? ref1 : 'DD MMM YYYY, HH:mm (z)';
              return moment(scope.shDatetime).tz(moment.defaultZone.name).format(shDatetimeFormat);
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
        var hideModal, onHandleClick, ref, ref1, ref2, shDialogLabelCancel, shDialogLabelClose, shDialogLabelOk;
        shDialogLabelOk = (ref = scope.shDialogLabelOk) != null ? ref : 'Submit';
        shDialogLabelClose = (ref1 = scope.shDialogLabelClose) != null ? ref1 : 'Close';
        shDialogLabelCancel = (ref2 = scope.shDialogLabelCancel) != null ? ref2 : 'Cancel';
        angular.element(element).addClass('sh-dialog').children().eq(0).on('click', function() {
          if (angular.element(this).find('> *:first-child').attr('disabled') !== 'disabled') {
            onHandleClick();
          }
        });
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
              hideModal();
              return deferred.reject(error);
            })["finally"](function() {

              /* */
              parent.shDialogLoading = false;
            });
            return deferred.promise;
          }).on('hidden.bs.modal', function() {
            shDialogModal.remove();
            parent.shDialogEntity = {};
          });
          $timeout(function() {
            return shDialogModal.modal('show');
          }, 20);
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
              hideModal();
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
        hideModal = function() {
          angular.element('.modal').modal('hide');
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
      return "<button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-default margin-left\">\n</button>";
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
        shLowerThan: '=?',
        shGreaterThan: '=?',
        shLowerThanEqual: '=?',
        shGreaterThanEqual: '=?',
        shNumberInvalidMessage: '@?',
        shNumberHint: '@?',
        ngModel: '='
      },
      require: '?ngModel',
      link: function(scope, element, attributes, ngModel) {
        var classId, ref, ref1, shAllowZero, updatePopover;
        classId = 'sh-number-' + Math.random().toString().slice(2);
        shAllowZero = scope.shAllowZero === 'false' ? false : true;
        scope.shLowerThanEqual = (ref = scope.shLowerThanEqual) != null ? ref : scope.shMax;
        scope.shGreaterThanEqual = (ref1 = scope.shGreaterThanEqual) != null ? ref1 : scope.shMin;
        updatePopover = function() {
          var popoverContent, ref2, ref3, ref4;
          popoverContent = element.attr('data-content');
          if (ngModel.$invalid) {
            if (ngModel.$error.out_of_range) {
              popoverContent = (ref2 = scope.shNumberInvalidMessage) != null ? ref2 : 'Invalid Number';
            }
            if (ngModel.$error.required) {
              popoverContent = (ref3 = scope.shNumberInvalidMessage) != null ? ref3 : 'Please insert a number';
            }
          } else {
            if (ngModel.$modelValue == null) {
              popoverContent = (ref4 = scope.shNumberHint) != null ? ref4 : 'Insert valid number';
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
          if (scope.shLowerThanEqual != null) {
            valid = valid && +scope.ngModel <= scope.shLowerThanEqual;
          }
          if (scope.shGreaterThanEqual != null) {
            valid = valid && +scope.ngModel >= scope.shGreaterThanEqual;
          }
          if (scope.shLowerThan != null) {
            valid = valid && +scope.ngModel < scope.shLowerThan;
          }
          if (scope.shGreaterThan != null) {
            valid = valid && +scope.ngModel > scope.shGreaterThan;
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
            return ngModel.$setValidity('required', validRequired);
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
          var ref2, ref3;
          if (((ref2 = e.keyCode) === 16 || ref2 === 17 || ref2 === 18 || ref2 === 46 || ref2 === 8 || ref2 === 9 || ref2 === 27 || ref2 === 13 || ref2 === 110 || ref2 === 173 || ref2 === 190 || ref2 === 189) || (e.keyCode >= 112 && e.keyCode <= 123) || (((ref3 = e.keyCode) === 65 || ref3 === 67 || ref3 === 86) && (e.ctrlKey === true || e.metaKey === true)) || (e.keyCode >= 35 && e.keyCode <= 40)) {

            /*let it happen, don't do anything */
          } else if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
            return e.preventDefault();
          }
        });
        scope.$watch('ngModel', function(newValue, oldValue) {
          return scope.applyValidity();
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
      return scope.$watch('height', function(newVal, oldVal) {
        return elem.next().css('top', newVal + 'px');
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
      return scope.$watch('height', function(newVal, oldVal) {
        return elem.prev().css('bottom', newVal + 'px');
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
        return scope.$watch(function() {
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

shFormModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shForm
     *
     * @description
     * ShForm
     */
    $rootScope.shForm = [
      function() {
        var self;
        self = this;
        if (this.entityForm == null) {
          this.entityForm = null;
        }
        if (this.entity == null) {
          this.entity = null;
        }

        /**
         * @ngdoc method
         * @name validationClass
         *
         * @description
         * Gives elements a class that mark its fieldname state
         *
         * @returns {String} String as class that mark element state
         */
        this.validationClass = function(fieldName) {
          var ref, result;
          result = '';
          if (((ref = this.entityForm) != null ? ref[fieldName] : void 0) != null) {
            if (this.entityForm[fieldName].$invalid) {
              if (this.entityForm[fieldName].$dirty) {
                result += 'has-error ';
              } else {
                result += 'has-pristine-error ';
              }
            } else if (this.entityForm[fieldName].$dirty && this.entityForm[fieldName].$valid) {
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
        this.reset = function() {
          var ref, ref1;
          if ((ref = this.entityForm) != null) {
            ref.$setPristine();
          }
          return (ref1 = this.entityForm) != null ? ref1.$setUntouched() : void 0;
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
        this.resetSubmitted = function() {
          var ref;
          return (ref = this.entityForm) != null ? ref.$submitted = false : void 0;
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
        this.isDisabled = function() {
          var ref, ref1, ref2;
          if (this.entityForm == null) {
            return true;
          }
          return ((ref = this.entityForm) != null ? ref.$pristine : void 0) || ((ref1 = this.entityForm) != null ? ref1.$invalid : void 0) || ((ref2 = this.entityForm) != null ? ref2.$submitted : void 0);
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
        this.isCompleted = function() {
          var ref, ref1;
          return ((ref = this.entityForm) != null ? ref.$pristine : void 0) && ((ref1 = this.entityForm) != null ? ref1.$valid : void 0) && !this.entityForm.$submitted;
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
        this.isDirtyAndValid = function() {
          var ref, ref1;
          return ((ref = this.entityForm) != null ? ref.$dirty : void 0) && ((ref1 = this.entityForm) != null ? ref1.$valid : void 0);
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
        this.isDirtyAndInvalid = function() {
          var ref, ref1;
          return ((ref = this.entityForm) != null ? ref.$dirty : void 0) && ((ref1 = this.entityForm) != null ? ref1.$invalid : void 0);
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
        this.isResetButtonDisabled = function() {
          var ref, ref1;
          return ((ref = this.entityForm) != null ? ref.$pristine : void 0) || ((ref1 = this.entityForm) != null ? ref1.$submitted : void 0);
        };
      }
    ];
  }
]);

shApiModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shApiHook
     *
     * @description
     * ShTableRest
     */
    $rootScope.shApiHook = [
      '$q', '$injector', function($q, $injector) {
        var self, shApi;
        self = this;
        if (this.resource == null) {
          this.resource = null;
        }
        if (this.entity == null) {
          this.entity = {};
        }
        if (this.lookup == null) {
          this.lookup = {};
        }
        if (this.optParams == null) {
          this.optParams = {};
        }
        this.createdIds = [];
        this.updatedIds = [];
        this.deletedIds = [];
        shApi = {
          resource: self.resource
        };
        this.beforeApiCallEntityHooks = {};
        this.apiCallEntitySuccessHooks = {};
        this.apiCallEntityErrorHooks = {};
        this.afterApiCallEntityHooks = {};

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
        this.apiCallEntity = function(opts) {
          var apiParameters, base, base1, base2, base3, data, deferred, hook, i, len, name, name1, name2, name3, ref, ref1;
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
              params: this.optParams
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
            if ((base = self.beforeApiCallEntityHooks)[name = opts.name] == null) {
              base[name] = [];
            }
            if ((base1 = self.apiCallEntitySuccessHooks)[name1 = opts.name] == null) {
              base1[name1] = [];
            }
            if ((base2 = self.apiCallEntityErrorHooks)[name2 = opts.name] == null) {
              base2[name2] = [];
            }
            if ((base3 = self.afterApiCallEntityHooks)[name3 = opts.name] == null) {
              base3[name3] = [];
            }
            ref1 = self.beforeApiCallEntityHooks[opts.name];
            for (i = 0, len = ref1.length; i < len; i++) {
              hook = ref1[i];
              hook();
            }
            shApi.apiCall(apiParameters).then(function(success) {
              var j, len1, ref2;
              ref2 = self.apiCallEntitySuccessHooks[opts.name];
              for (j = 0, len1 = ref2.length; j < len1; j++) {
                hook = ref2[j];
                hook(success);
              }
              return deferred.resolve(success);
            }, function(error) {
              var j, len1, ref2;
              ref2 = self.apiCallEntityErrorHooks[opts.name];
              for (j = 0, len1 = ref2.length; j < len1; j++) {
                hook = ref2[j];
                hook(error);
              }
              return deferred.reject(error);
            })["finally"](function() {
              var j, len1, ref2, results;
              ref2 = self.afterApiCallEntityHooks[opts.name];
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
        $injector.invoke($rootScope.shApi, shApi);
      }
    ];
  }
]);

shApiModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shApi
     *
     * @description
     * ShTableRest
     */
    $rootScope.shApi = [
      '$q', function($q) {
        if (this.resource == null) {
          this.resource = null;
        }

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
        this.index = function(params) {
          var deferred;
          deferred = $q.defer();
          this.resource.get(params).$promise.then(function(success) {
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
        this["new"] = function(params) {
          var deferred;
          deferred = $q.defer();
          this.resource["new"](params).$promise.then(function(success) {
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
        this.create = function(params, data) {
          var deferred;
          deferred = $q.defer();
          this.resource.save(params, data).$promise.then(function(success) {
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
        this.edit = function(id, params) {
          var deferred;
          deferred = $q.defer();
          this.resource.edit(angular.extend({
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
        this.update = function(id, params, data) {
          var deferred;
          deferred = $q.defer();
          this.resource.update(angular.extend({
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
        this["delete"] = function(id, params) {
          var deferred;
          deferred = $q.defer();
          this.resource["delete"](angular.extend({
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
        this.apiCall = function(opts) {
          var deferred;
          deferred = $q.defer();
          switch (opts.method) {
            case 'GET':
            case 'DELETE':
              this.resource[opts.name](angular.extend({
                id: opts.id
              }, opts.params)).$promise.then(function(success) {
                return deferred.resolve(success);
              }, function(error) {
                return deferred.reject(error);
              });
              break;
            case 'POST':
            case 'PUT':
              this.resource[opts.name](angular.extend({
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
      }
    ];
  }
]);

shPersistenceModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableHook
     *
     * @description
     * ShTableRest
     */
    $rootScope.shPersistenceHookNotification = [
      'ShNotification', function(ShNotification) {
        var self;
        self = this;
        this.newEntityErrorHooks.push(function(error) {
          ShNotification.toastByResponse(error);
        });
        this.createEntityErrorHooks.push(function(error) {
          ShNotification.toastByResponse(error);
        });
        this.editEntityErrorHooks.push(function(error) {
          ShNotification.toastByResponse(error);
        });
        this.updateEntityErrorHooks.push(function(error) {
          ShNotification.toastByResponse(error);
        });
      }
    ];
  }
]);

shPersistenceModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableHook
     *
     * @description
     * ShTableRest
     */
    $rootScope.shPersistenceHook = [
      '$q', '$injector', function($q, $injector) {
        var self, shApi;
        self = this;
        if (this.id == null) {
          this.id = null;
        }
        if (this.resource == null) {
          this.resource = null;
        }
        if (this.entity == null) {
          this.entity = {};
        }
        if (this.lookup == null) {
          this.lookup = {};
        }
        if (this.optParams == null) {
          this.optParams = {};
        }
        shApi = {
          resource: self.resource
        };
        this.beforeNewEntityHooks = [];
        this.newEntitySuccessHooks = [];
        this.newEntityErrorHooks = [];
        this.afterNewEntityHooks = [];
        this.beforeCreateEntityHooks = [];
        this.createEntitySuccessHooks = [];
        this.createEntityErrorHooks = [];
        this.afterCreateEntityHooks = [];
        this.beforeEditEntityHooks = [];
        this.editEntitySuccessHooks = [];
        this.editEntityErrorHooks = [];
        this.afterEditEntityHooks = [];
        this.beforeUpdateEntityHooks = [];
        this.updateEntitySuccessHooks = [];
        this.updateEntityErrorHooks = [];
        this.afterUpdateEntityHooks = [];
        this.beforeDeleteEntityHooks = [];
        this.deleteEntitySuccessHooks = [];
        this.deleteEntityErrorHooks = [];
        this.afterDeleteEntityHooks = [];
        this.beforeInitEntityHooks = [];
        this.initEntitySuccessHooks = [];
        this.initEntityErrorHooks = [];
        this.afterInitEntityHooks = [];

        /**
         * @ngdoc method
         * @name newEntity
         *
         * @description
         * New an entity
         *
         * @returns {promise}
         */
        this.newEntity = function() {
          var deferred, hook, i, len, ref;
          ref = self.beforeNewEntityHooks;
          for (i = 0, len = ref.length; i < len; i++) {
            hook = ref[i];
            hook();
          }
          deferred = $q.defer();
          shApi["new"](this.optParams).then(function(success) {
            var j, len1, ref1;
            self.entity = success.data;
            if (success.lookup != null) {
              self.lookup = success.lookup;
            }
            ref1 = self.newEntitySuccessHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(success);
            }
            return deferred.resolve(success);
          }, function(error) {
            var j, len1, ref1;
            ref1 = self.newEntityErrorHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(error);
            }
            return deferred.reject(error);
          })["finally"](function() {
            var j, len1, ref1, results;
            ref1 = self.afterNewEntityHooks;
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
        this.createEntity = function(entity) {
          var data, deferred, hook, i, len, ref;
          ref = self.beforeCreateEntityHooks;
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
          shApi.create(this.optParams, data).then(function(success) {
            var j, len1, ref1;
            self.entity = success.data;
            if (success.lookup != null) {
              self.lookup = success.lookup;
            }
            ref1 = self.createEntitySuccessHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(success);
            }
            return deferred.resolve(success);
          }, function(error) {
            var j, len1, ref1;
            ref1 = self.createEntityErrorHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(error);
            }
            return deferred.reject(error);
          })["finally"](function() {
            var j, len1, ref1, results;
            ref1 = self.afterCreateEntityHooks;
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
        this.editEntity = function(id) {
          var deferred, hook, i, len, ref;
          ref = self.beforeEditEntityHooks;
          for (i = 0, len = ref.length; i < len; i++) {
            hook = ref[i];
            hook();
          }
          deferred = $q.defer();
          if (!id) {
            id = this.id;
          }
          shApi.edit(id, this.optParams).then(function(success) {
            var j, len1, ref1;
            self.entity = success.data;
            if (success.lookup != null) {
              self.lookup = success.lookup;
            }
            ref1 = self.editEntitySuccessHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(success);
            }
            return deferred.resolve(success);
          }, function(error) {
            var j, len1, ref1;
            ref1 = self.editEntityErrorHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(error);
            }
            return deferred.reject(error);
          })["finally"](function() {
            var j, len1, ref1, results;
            ref1 = self.afterEditEntityHooks;
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
        this.updateEntity = function(id, entity) {
          var data, deferred, hook, i, len, ref;
          ref = self.beforeUpdateEntityHooks;
          for (i = 0, len = ref.length; i < len; i++) {
            hook = ref[i];
            hook();
          }
          deferred = $q.defer();
          if (angular.isObject(id)) {
            entity = id;
            id = this.id;
          }
          data = {
            data: entity
          };
          if (Object.prototype.toString.call(entity).slice(8, -1) === 'FormData') {
            data = entity;
          }
          shApi.update(id, this.optParams, data).then(function(success) {
            var j, len1, ref1;
            self.entity = success.data;
            if (success.lookup != null) {
              self.lookup = success.lookup;
            }
            ref1 = self.updateEntitySuccessHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(success);
            }
            return deferred.resolve(success);
          }, function(error) {
            var j, len1, ref1;
            ref1 = self.updateEntityErrorHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(error);
            }
            return deferred.reject(error);
          })["finally"](function() {
            var j, len1, ref1, results;
            ref1 = self.afterUpdateEntityHooks;
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
        this.deleteEntity = function(id) {
          var deferred, hook, i, len, ref;
          ref = self.beforeDeleteEntityHooks;
          for (i = 0, len = ref.length; i < len; i++) {
            hook = ref[i];
            hook();
          }
          deferred = $q.defer();
          if (!id) {
            id = this.id;
          }
          shApi["delete"](id, this.optParams).then(function(success) {
            var j, len1, ref1;
            ref1 = self.deleteEntitySuccessHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(success);
            }
            return deferred.resolve(success);
          }, function(error) {
            var j, len1, ref1;
            ref1 = self.deleteEntityErrorHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(error);
            }
            return deferred.reject(error);
          })["finally"](function() {
            var j, len1, ref1, results;
            ref1 = self.afterDeleteEntityHooks;
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
        this.initEntity = function() {
          var deferred, hook, i, len, ref;
          ref = self.beforeInitEntityHooks;
          for (i = 0, len = ref.length; i < len; i++) {
            hook = ref[i];
            hook();
          }
          deferred = $q.defer();
          $q.when(self.id != null ? this.editEntity(self.id) : this.newEntity()).then(function(success) {
            var j, len1, ref1;
            ref1 = self.initEntitySuccessHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(success);
            }
            return deferred.resolve(success);
          }, function(error) {
            var j, len1, ref1;
            ref1 = self.initEntityErrorHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(error);
            }
            return deferred.reject(error);
          })["finally"](function() {
            var j, len1, ref1, results;
            ref1 = self.afterInitEntityHooks;
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
        this.getLookup = function(key) {
          var ref;
          return (ref = self.lookup) != null ? ref[key] : void 0;
        };
        $injector.invoke($rootScope.shApi, shApi);
        $injector.invoke($rootScope.shApiHook, self);
        $injector.invoke($rootScope.shPersistenceHookNotification, self);
      }
    ];
  }
]);

shPersistenceModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTable
     *
     * @description
     * shTable
     */
    $rootScope.shPersistence = [
      '$injector', '$q', function($injector, $q) {
        var self;
        self = this;
        this.entity = {};
        if (this.id == null) {
          this.id = null;
        }
        if (this.resource == null) {
          this.resource = null;
        }
        this.localLookup = {};
        if (this.sorting == null) {
          this.sorting = {
            id: "desc"
          };
        }
        $injector.invoke($rootScope.shPersistenceHook, this);
      }
    ];
  }
]);

shTableModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableHelper
     *
     * @description
     * shTableHelper
     */
    $rootScope.shTableFilterStorage = [
      '$location', 'localStorageService', function($location, localStorageService) {
        var getCurrentFilterParams, getCurrentLocalStorage, self, setFilterCollection, setFilterLabel, setFilterParams, setLocalStorage, storageKey;
        self = this;
        storageKey = [self.name, $location.path()].join('');
        this.beforeRefreshGridHooks.push(function() {
          var collectionKey, currentFilterParams, currentLocalStorage, i, j, key, keysCollections, lastUnderscore, len, len1, new_key, obj, ref, ref1, resultFilterCollection, resultFilterLabel, resultFilterParams;
          currentFilterParams = (ref = getCurrentFilterParams()) != null ? ref : {};
          currentLocalStorage = getCurrentLocalStorage() === 'undefined' ? self.filterParams : getCurrentLocalStorage();
          resultFilterParams = self.filterParams.fromShFilter != null ? currentFilterParams : currentLocalStorage;
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
          return self.filterParams;
        };
        getCurrentLocalStorage = function() {
          return localStorageService.get(storageKey);
        };
        setFilterParams = function(currentLocalStorage) {
          self.filterParams = currentLocalStorage;
        };
        setLocalStorage = function(currentLocalStorage) {
          return localStorageService.set(storageKey, currentLocalStorage);
        };
        setFilterLabel = function(resultFilterLabel) {
          self.filterLabel = resultFilterLabel;
        };
        setFilterCollection = function(resultFilterCollection) {
          self.filterCollection = resultFilterCollection;
        };
      }
    ];
  }
]);

shTableModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableHelper
     *
     * @description
     * shTableHelper
     */
    $rootScope.shTableFilter = [
      '$filter', '$injector', '$rootScope', 'HelperService', function($filter, $injector, $rootScope, HelperService) {
        var dateParams, numberParams, self;
        self = this;
        if (this.filterParams == null) {
          this.filterParams = {};
        }
        this.filterRegion = {
          visible: true
        };
        this.form = {};
        $injector.invoke($rootScope.shForm, this.form);
        dateParams = {};
        this.filterLabel = {};
        this.filterCollection = {};
        this.prepareFilterDate = function(shFilter) {
          dateParams = {};
          delete this.filterParams[shFilter + "_eqdate"];
          delete this.filterParams[shFilter + "_lteqdate"];
          return delete this.filterParams[shFilter + "_gteqdate"];
        };
        this.executeFilterDate = function() {
          jQuery.extend(this.filterParams, dateParams);
          this.tableParams.$params.pageNumber = 1;
          return this.refreshGrid();
        };
        this.filterDateLabel = function(keyword, shFilter, n) {
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
        this.filterDate = function(keyword, shFilter, n) {
          var fromDate, thruDate;
          if (keyword === 'RANGE' || keyword === 'CERTAIN') {
            switch (keyword) {
              case 'RANGE':
                fromDate = this.filterParams[shFilter + "_gteqdate"];
                thruDate = this.filterParams[shFilter + "_lteqdate"];
                this.prepareFilterDate(shFilter);
                this.filterDateRange(shFilter, fromDate, thruDate);
                this.filterLabel[shFilter] = moment(fromDate).format('DD-MM-YYYY') + ' - ' + moment(thruDate).format('DD-MM-YYYY');
                break;
              case 'CERTAIN':
                fromDate = this.filterParams[shFilter + "_gteqdate"];
                thruDate = fromDate;
                this.prepareFilterDate(shFilter);
                this.filterDateRange(shFilter, fromDate, thruDate);
                this.filterLabel[shFilter] = moment(fromDate).format('DD-MM-YYYY');
            }
          } else {
            this.prepareFilterDate(shFilter);
            switch (keyword) {
              case 'ANY':
                this.filterDateAny(shFilter);
                break;
              case 'TODAY':
                this.filterDateToday(shFilter);
                break;
              case 'PAST_N_DAYS':
                this.filterDatePastNDays(shFilter, n);
                break;
              case 'PAST_N_WEEKS':
                this.filterDatePastNWeeks(shFilter, n);
                break;
              case 'PAST_N_MONTHS':
                this.filterDatePastNMonths(shFilter, n);
                break;
              case 'PAST_N_YEARS':
                this.filterDatePastNYears(shFilter, n);
                break;
              case 'NEXT_N_DAYS':
                this.filterDateNextNDays(shFilter, n);
                break;
              case 'NEXT_N_WEEKS':
                this.filterDateNextNWeeks(shFilter, n);
                break;
              case 'NEXT_N_MONTHS':
                this.filterDateNextNMonths(shFilter, n);
                break;
              case 'NEXT_N_YEARS':
                this.filterDateNextNYears(shFilter, n);
            }
            this.filterLabel[shFilter] = this.filterDateLabel(keyword, shFilter, n);
          }
          return this.executeFilterDate();
        };
        this.filterDateAny = function(shFilter) {

          /* */
        };
        this.filterDateToday = function(shFilter) {
          dateParams[shFilter + "_eqdate"] = moment().format('YYYY-MM-DD');
        };
        this.filterDatePastNDays = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
          dateParams[shFilter + "_gteqdate"] = moment().subtract(n, 'days').format('YYYY-MM-DD');
        };
        this.filterDatePastNWeeks = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
          dateParams[shFilter + "_gteqdate"] = moment().subtract(n, 'weeks').format('YYYY-MM-DD');
        };
        this.filterDatePastNMonths = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
          dateParams[shFilter + "_gteqdate"] = moment().subtract(n, 'months').format('YYYY-MM-DD');
        };
        this.filterDatePastNYears = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
          dateParams[shFilter + "_gteqdate"] = moment().subtract(n, 'years').format('YYYY-MM-DD');
        };
        this.filterDateNextNDays = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().add(n, 'days').format('YYYY-MM-DD');
          dateParams[shFilter + "_gteqdate"] = moment().format('YYYY-MM-DD');
        };
        this.filterDateNextNWeeks = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().add(n, 'weeks').format('YYYY-MM-DD');
          dateParams[shFilter + "_gteqdate"] = moment().format('YYYY-MM-DD');
        };
        this.filterDateNextNMonths = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().add(n, 'months').format('YYYY-MM-DD');
          dateParams[shFilter + "_gteqdate"] = moment().format('YYYY-MM-DD');
        };
        this.filterDateNextNYears = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().add(n, 'years').format('YYYY-MM-DD');
          dateParams[shFilter + "_gteqdate"] = moment().format('YYYY-MM-DD');
        };
        this.filterDateRange = function(shFilter, fromDate, thruDate) {
          dateParams[shFilter + "_gteqdate"] = fromDate;
          dateParams[shFilter + "_lteqdate"] = thruDate;
        };
        numberParams = {};
        this.prepareFilterNumber = function(shFilter) {
          numberParams = {};
          delete this.filterParams[shFilter + "_eq"];
          delete this.filterParams[shFilter + "_lteq"];
          return delete this.filterParams[shFilter + "_gteq"];
        };
        this.executeFilterNumber = function() {
          jQuery.extend(this.filterParams, numberParams);
          this.tableParams.$params.pageNumber = 1;
          return this.refreshGrid();
        };
        this.filterNumberLabel = function(keyword, shFilter, leftNumber, rightNumber) {
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
        this.filterNumber = function(keyword, shFilter, leftNumber, rightNumber) {
          var eqNumber;
          switch (keyword) {
            case 'ANY':
              this.prepareFilterNumber(shFilter);
              this.filterNumberAny(shFilter);
              break;
            case 'BETWEEN':
              this.prepareFilterNumber(shFilter);
              this.filterNumberRange(shFilter, leftNumber, rightNumber);
              break;
            case 'LOWER_THAN':
              rightNumber = this.filterParams[shFilter + "_lteq"];
              this.prepareFilterNumber(shFilter);
              this.filterNumberRange(shFilter, null, rightNumber);
              break;
            case 'GREATER_THAN':
              leftNumber = this.filterParams[shFilter + "_gteq"];
              this.prepareFilterNumber(shFilter);
              this.filterNumberRange(shFilter, leftNumber, null);
              break;
            case 'RANGE':
              leftNumber = this.filterParams[shFilter + "_gteq"];
              rightNumber = this.filterParams[shFilter + "_lteq"];
              this.prepareFilterNumber(shFilter);
              this.filterNumberRange(shFilter, leftNumber, rightNumber);
              break;
            case 'CERTAIN':
              eqNumber = this.filterParams[shFilter + "_eq"];
              this.prepareFilterNumber(shFilter);
              this.filterNumberSpecific(shFilter, eqNumber);
          }
          this.filterLabel[shFilter] = this.filterNumberLabel(keyword, shFilter);
          return this.executeFilterNumber();
        };
        this.filterNumberAny = function(shFilter) {};
        this.filterNumberSpecific = function(shFilter, number) {
          numberParams[shFilter + "_eq"] = number;
        };
        this.filterNumberRange = function(shFilter, leftNumber, rightNumber) {
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
        this.filterTextCont = function(shFilter) {
          this.tableParams.$params.pageNumber = 1;
          self.filterParams['fromShFilter'] = true;
          return this.refreshGrid();
        };
        this.getLabelTextCont = function(shFilter) {
          return this.filterParams[shFilter + "_cont"] || null;
        };
        this.filterYearBetween = function(shFilter, year) {
          this.filterParams[shFilter + '_month'] = null;
          this.filterParams[shFilter + '_year'] = year;
          this.filterParams[shFilter + '_lteqdate'] = year + '-12-31';
          this.filterParams[shFilter + '_gteqdate'] = year + '-01-01';
          self.filterParams['fromShFilter'] = true;
          return this.refreshGrid();
        };
        this.filterMonthBetween = function(shFilter, month) {
          var mDate, year;
          if (this.filterParams[shFilter + '_year']) {
            year = this.filterParams[shFilter + '_year'];
            month = ('00' + month).slice(-2);
            this.filterParams[shFilter + '_month'] = month;
            mDate = moment(year + '-' + month + '-01');
            this.filterParams[shFilter + '_lteqdate'] = mDate.endOf('month').format('YYYY-MM-DD');
            this.filterParams[shFilter + '_gteqdate'] = mDate.startOf('month').format('YYYY-MM-DD');
          }
          self.filterParams['fromShFilter'] = true;
          return this.refreshGrid();
        };
        this.filterInCollection = function(shFilter, key) {
          if (key == null) {
            key = null;
          }
          if (key != null) {
            this.filterLabel[shFilter] = this.filterCollection[shFilter].map(function(o) {
              return $filter('translate')(o[key + '']);
            }).join(', ');
            this.filterParams[shFilter + '_in'] = this.filterCollection[shFilter].map(function(o) {
              return o[key + ''];
            });
          } else {
            this.filterLabel[shFilter] = this.filterCollection[shFilter].map(function(o) {
              return $filter('translate')(o);
            }).join(', ');
            this.filterParams[shFilter + '_in'] = this.filterCollection[shFilter];
          }
          self.filterParams['fromShFilter'] = true;
          return this.refreshGrid();
        };
        this.collectionNavbarFilterSelect = function(shFilter, item, key) {
          if (key == null) {
            key = null;
          }
          if (this.filterCollection[shFilter] == null) {
            this.filterCollection[shFilter] = [];
          }
          HelperService.rowSelect(item, this.filterCollection[shFilter], key);
          return this.filterInCollection(shFilter, key);
        };
        this.collectionNavbarFilterDeselect = function(shFilter, item, key) {
          if (key == null) {
            key = null;
          }
          if (this.filterCollection[shFilter] == null) {
            this.filterCollection[shFilter] = [];
          }
          HelperService.rowDeselect(item, this.filterCollection[shFilter], key);
          return this.filterInCollection(shFilter, key);
        };
        this.collectionNavbarFilterIsSelected = function(shFilter, item, key) {
          if (key == null) {
            key = null;
          }
          if (this.filterCollection[shFilter] == null) {
            this.filterCollection[shFilter] = [];
          }
          return HelperService.isRowSelected(item, this.filterCollection[shFilter], key);
        };
        this.collectionNavbarClearSelection = function(shFilter, key) {
          if (key == null) {
            key = null;
          }
          if (this.filterCollection[shFilter] == null) {
            this.filterCollection[shFilter] = [];
          }
          HelperService.clearRowSelection(this.filterCollection[shFilter]);
          return this.filterInCollection(shFilter, key);
        };
        this.collectionNavbarFilterIsSelectionEmpty = function(shFilter, key) {
          if (key == null) {
            key = null;
          }
          if (this.filterCollection[shFilter] == null) {
            this.filterCollection[shFilter] = [];
          }
          return HelperService.isRowSelectionEmpty(this.filterCollection[shFilter]);
        };
        this.toggleFilterRegion = function() {
          this.filterRegion.visible = !this.filterRegion.visible;
        };
        this.resetFilter = function() {
          var k, ref, v;
          this.filterParams = {};
          this.filterLabel = {};
          ref = this.filterCollection;
          for (k in ref) {
            v = ref[k];
            HelperService.clearRowSelection(this.filterCollection[k]);
          }
          self.filterParams['fromShFilter'] = true;
          return this.refreshGrid();
        };
        this.isNoFilter = function() {
          return jQuery.isEmptyObject(this.filterParams);
        };
      }
    ];
  }
]);

shTableModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableHelper
     *
     * @description
     * shTableHelper
     */
    $rootScope.shTableHelper = [
      '$q', function($q) {

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
        this.sortableClass = function(fieldName) {
          if (this.tableParams.isSortBy(fieldName, 'asc')) {
            return 'sortable sort-asc';
          } else if (this.tableParams.isSortBy(fieldName, 'desc')) {
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
        this.sortableClick = function(fieldName) {
          var newDirection;
          newDirection = this.tableParams.isSortBy(fieldName, 'asc') ? 'desc' : 'asc';
          this.tableParams.sortData(fieldName, newDirection);
          this.refreshGrid();
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
        this.rowRestEventClass = function(obj) {
          if (this.isRecentlyDeleted(obj)) {
            return 'recently-deleted';
          }
          if (this.isRecentlyUpdated(obj)) {
            return 'recently-updated';
          }
          if (this.isRecentlyCreated(obj)) {
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
        this.isRecentlyCreated = function(obj) {
          return this.createdIds.indexOf((obj != null ? obj.id : void 0) || obj) >= 0;
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
        this.isRecentlyUpdated = function(obj) {
          return this.updatedIds.indexOf((obj != null ? obj.id : void 0) || obj) >= 0;
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
        this.isRecentlyDeleted = function(obj) {
          return this.deletedIds.indexOf((obj != null ? obj.id : void 0) || obj) >= 0;
        };
      }
    ];
  }
]);

shTableModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableHook
     *
     * @description
     * ShTableRest
     */
    $rootScope.shTableHookNotification = [
      'ShNotification', function(ShNotification) {
        var self;
        self = this;
        this.getEntitiesErrorHooks.push(function(error) {
          ShNotification.toastByResponse(error);
        });
        this.newEntityErrorHooks.push(function(error) {
          ShNotification.toastByResponse(error);
        });
        this.createEntityErrorHooks.push(function(error) {
          ShNotification.toastByResponse(error);
        });
        this.editEntityErrorHooks.push(function(error) {
          ShNotification.toastByResponse(error);
        });
        this.updateEntityErrorHooks.push(function(error) {
          ShNotification.toastByResponse(error);
        });
        this.deleteEntityErrorHooks.push(function(error) {
          ShNotification.toastByResponse(error);
        });
      }
    ];
  }
]);

shTableModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableHook
     *
     * @description
     * ShTableRest
     */
    $rootScope.shTableHook = [
      '$q', '$injector', function($q, $injector) {
        var self, shApi;
        self = this;
        if (this.resource == null) {
          this.resource = null;
        }
        if (this.entity == null) {
          this.entity = {};
        }
        if (this.lookup == null) {
          this.lookup = {};
        }
        if (this.optParams == null) {
          this.optParams = {};
        }
        this.createdIds = [];
        this.updatedIds = [];
        this.deletedIds = [];
        shApi = {
          resource: self.resource
        };
        this.beforeGetEntitiesHooks = [];
        this.getEntitiesSuccessHooks = [];
        this.getEntitiesErrorHooks = [];
        this.afterGetEntitiesHooks = [];
        this.beforeNewEntityHooks = [];
        this.newEntitySuccessHooks = [];
        this.newEntityErrorHooks = [];
        this.afterNewEntityHooks = [];
        this.beforeCreateEntityHooks = [];
        this.createEntitySuccessHooks = [];
        this.createEntityErrorHooks = [];
        this.afterCreateEntityHooks = [];
        this.beforeEditEntityHooks = [];
        this.editEntitySuccessHooks = [];
        this.editEntityErrorHooks = [];
        this.afterEditEntityHooks = [];
        this.beforeUpdateEntityHooks = [];
        this.updateEntitySuccessHooks = [];
        this.updateEntityErrorHooks = [];
        this.afterUpdateEntityHooks = [];
        this.beforeDeleteEntityHooks = [];
        this.deleteEntitySuccessHooks = [];
        this.deleteEntityErrorHooks = [];
        this.afterDeleteEntityHooks = [];

        /**
         * @ngdoc method
         * @name getEntities
         *
         * @description
         * Get list of entities based on `optParams`
         *
         * @returns {promise}
         */
        this.getEntities = function() {
          var deferred, hook, i, len, ref;
          ref = self.beforeGetEntitiesHooks;
          for (i = 0, len = ref.length; i < len; i++) {
            hook = ref[i];
            hook();
          }
          deferred = $q.defer();
          shApi.index(this.optParams).then(function(success) {
            var j, len1, ref1;
            ref1 = self.getEntitiesSuccessHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(success);
            }
            return deferred.resolve(success);
          }, function(error) {
            var j, len1, ref1;
            ref1 = self.getEntitiesErrorHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(error);
            }
            return deferred.reject(error);
          })["finally"](function() {
            var j, len1, ref1, results;
            ref1 = self.afterGetEntitiesHooks;
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
        this.newEntity = function() {
          var deferred, hook, i, len, ref;
          ref = self.beforeNewEntityHooks;
          for (i = 0, len = ref.length; i < len; i++) {
            hook = ref[i];
            hook();
          }
          deferred = $q.defer();
          shApi["new"](this.optParams).then(function(success) {
            var j, len1, ref1;
            self.entity = success.data;
            if (success.lookup != null) {
              self.lookup = success.lookup;
            }
            ref1 = self.newEntitySuccessHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(success);
            }
            return deferred.resolve(success);
          }, function(error) {
            var j, len1, ref1;
            ref1 = self.newEntityErrorHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(error);
            }
            return deferred.reject(error);
          })["finally"](function() {
            var j, len1, ref1, results;
            ref1 = self.afterNewEntityHooks;
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
        this.createEntity = function(entity) {
          var data, deferred, hook, i, len, ref;
          ref = self.beforeCreateEntityHooks;
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
          shApi.create(this.optParams, data).then(function(success) {
            var j, len1, ref1;
            self.createdIds.push(success.data.id);
            self.entity = success.data;
            if (success.lookup != null) {
              self.lookup = success.lookup;
            }
            self.refreshGrid();
            ref1 = self.createEntitySuccessHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(success);
            }
            return deferred.resolve(success);
          }, function(error) {
            var j, len1, ref1;
            ref1 = self.createEntityErrorHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(error);
            }
            return deferred.reject(error);
          })["finally"](function() {
            var j, len1, ref1, results;
            ref1 = self.afterCreateEntityHooks;
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
        this.editEntity = function(id) {
          var deferred, hook, i, len, ref;
          ref = self.beforeEditEntityHooks;
          for (i = 0, len = ref.length; i < len; i++) {
            hook = ref[i];
            hook();
          }
          deferred = $q.defer();
          shApi.edit(id, this.optParams).then(function(success) {
            var j, len1, ref1;
            self.entity = success.data;
            if (success.lookup != null) {
              self.lookup = success.lookup;
            }
            ref1 = self.editEntitySuccessHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(success);
            }
            return deferred.resolve(success);
          }, function(error) {
            var j, len1, ref1;
            ref1 = self.editEntityErrorHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(error);
            }
            return deferred.reject(error);
          })["finally"](function() {
            var j, len1, ref1, results;
            ref1 = self.afterEditEntityHooks;
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
        this.updateEntity = function(id, entity) {
          var data, deferred, hook, i, len, ref;
          ref = self.beforeUpdateEntityHooks;
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
          shApi.update(id, this.optParams, data).then(function(success) {
            var j, len1, ref1;
            self.updatedIds.push(success.data.id);
            self.entity = success.data;
            if (success.lookup != null) {
              self.lookup = success.lookup;
            }
            self.refreshGrid();
            ref1 = self.updateEntitySuccessHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(success);
            }
            return deferred.resolve(success);
          }, function(error) {
            var j, len1, ref1;
            ref1 = self.updateEntityErrorHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(error);
            }
            return deferred.reject(error);
          })["finally"](function() {
            var j, len1, ref1, results;
            ref1 = self.afterUpdateEntityHooks;
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
        this.deleteEntity = function(id) {
          var deferred, hook, i, len, ref;
          ref = self.beforeDeleteEntityHooks;
          for (i = 0, len = ref.length; i < len; i++) {
            hook = ref[i];
            hook();
          }
          deferred = $q.defer();
          shApi["delete"](id, this.optParams).then(function(success) {
            var j, len1, ref1;
            self.deletedIds.push(id);
            self.refreshGrid();
            ref1 = self.deleteEntitySuccessHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(success);
            }
            return deferred.resolve(success);
          }, function(error) {
            var j, len1, ref1;
            ref1 = self.deleteEntityErrorHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(error);
            }
            return deferred.reject(error);
          })["finally"](function() {
            var j, len1, ref1, results;
            ref1 = self.afterDeleteEntityHooks;
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
        this.getLookup = function(key) {
          var ref;
          return (ref = self.lookup) != null ? ref[key] : void 0;
        };
        $injector.invoke($rootScope.shApi, shApi);
        $injector.invoke($rootScope.shApiHook, self);
        $injector.invoke($rootScope.shTableHookNotification, self);
      }
    ];
  }
]);

shTableModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableParamsHook
     *
     * @description
     * ShTableRest
     */
    $rootScope.shTableParamsHook = [
      '$injector', '$q', function($injector, $q) {
        var self;
        self = this;
        this.beforeRefreshGridHooks = [];
        this.refreshGridSuccessHooks = [];
        this.refreshGridErrorHooks = [];
        this.afterRefreshGridHooks = [];

        /**
         * @ngdoc method
         * @name goToPage
         *
         * @description
         * Assign page number to `this.tableParams.$params.pageNumber`, then calling `this.refreshGrid()` in appropriate format
         *
         * @returns {*}
         */
        this.goToPage = function(pageNumber, perPage) {
          if (pageNumber != null) {
            this.tableParams.$params.perPage = perPage || this.tableParams.$params.perPage;
            this.tableParams.$params.pageNumber = pageNumber;
          }
          this.refreshGrid();
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
        this.refreshGrid = function() {
          var deferred, hook, i, len, ref;
          ref = self.beforeRefreshGridHooks;
          for (i = 0, len = ref.length; i < len; i++) {
            hook = ref[i];
            hook();
          }
          deferred = $q.defer();
          this.tableParams.reload().then(function(success) {
            var j, len1, ref1;
            ref1 = self.refreshGridSuccessHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(success);
            }
            return deferred.resolve(success);
          }, function(error) {
            var j, len1, ref1;
            ref1 = self.refreshGridErrorHooks;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              hook = ref1[j];
              hook(error);
            }
            return deferred.reject(error);
          })["finally"](function() {
            var j, len1, ref1, results;
            ref1 = self.afterRefreshGridHooks;
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
        this.getPagedDataAsync = function() {
          var deferred;
          deferred = $q.defer();
          this.getEntities().then(function(success) {
            return deferred.resolve({
              items: success.data.items,
              totalCount: success.data.total_server_items
            });
          });
          return deferred.promise;
        };
      }
    ];
  }
]);

shTableModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableProcessor
     *
     * @description
     * shTableProcessor
     *
     */
    $rootScope.shTableProcessor = [
      '$injector', function($injector) {

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
        this.generateGridParams = function(opts) {
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
            column_defs: JSON.stringify(this.getProcessedColumnDefs(opts.columnDefs))
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
        this.getProcessedColumnDefs = function(columnDefs) {
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
      }
    ];
  }
]);

shTableModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTable
     *
     * @description
     * shTable
     */
    $rootScope.shTable = [
      '$injector', '$q', 'ShTableParams', function($injector, $q, ShTableParams) {
        var self, shTableProcessor;
        self = this;
        this.entity = {};
        if (this.resource == null) {
          this.resource = null;
        }
        if (this.columnDefs == null) {
          this.columnDefs = [];
        }
        this.localLookup = {};
        if (this.sorting == null) {
          this.sorting = {};
        }
        if (this.name == null) {
          this.name = '';
        }
        shTableProcessor = {};
        $injector.invoke($rootScope.shTableFilter, this);
        $injector.invoke($rootScope.shTableHelper, this);
        $injector.invoke($rootScope.shTableHook, this);
        $injector.invoke($rootScope.shTableParamsHook, this);
        $injector.invoke($rootScope.shTableProcessor, shTableProcessor);
        $injector.invoke($rootScope.shTableFilterStorage, this);
        this.tableParams = new ShTableParams({
          pageNumber: 1,
          perPage: 10,
          sortInfo: 'this is sort info',
          sorting: this.sorting,
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
      }
    ];
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
