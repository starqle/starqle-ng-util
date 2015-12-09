"use strict";
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

"use strict";

/**
 * @ngdoc module
 * @name shApiModule
 *
 * @description
 * shApiModule
 */
var shApiModule;

shApiModule = angular.module('sh.api.module', []);

"use strict";

/**
 * @ngdoc module
 * @name shFormModule
 *
 * @description
 * shFormModule
 */
var shFormModule;

shFormModule = angular.module('sh.form.module', []);

"use strict";

/**
 * @ngdoc module
 * @name shHelperModule
 *
 * @description
 * shHelperModule
 */
var shHelperModule;

shHelperModule = angular.module('sh.helper.module', []);

"use strict";

/**
 * @ngdoc module
 * @name shPersistenceModule
 *
 * @description
 * shPersistenceModule
 */
var shPersistenceModule;

shPersistenceModule = angular.module('sh.persistence.module', []);

"use strict";

/**
 * @ngdoc module
 * @name shSpinningModule
 *
 * @description
 * shSpinningModule
 */
var shSpinningModule;

shSpinningModule = angular.module('sh.spinning.module', []);

"use strict";

/**
 * @ngdoc module
 * @name shTableModule
 *
 * @description
 * shTableModule
 */
var shTableModule;

shTableModule = angular.module('sh.table.module', []);

"use strict";

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

"use strict";
angular.module('sh.bootstrap', []).directive('shBootstrapTooltip', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $(element).on('click', function() {
          $(element).tooltip('hide');
        }).on('mouseenter', function() {
          $(element).tooltip('show');
        }).on('mouseleave', function() {
          $(element).tooltip('hide');
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
            return localAttrs.timeoutFn = $timeout(function() {
              return $(element).popover('hide');
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
        $(element).on('mouseenter', function() {
          localAttrs.cancelTimeout();
          if (angular.isUndefined($(element).attr('aria-describedby'))) {
            $(element).popover('show');
          }
        }).on('mouseleave', function() {
          return localAttrs.addTimeout(element);
        }).on('shown.bs.popover', function() {
          localAttrs.popoverId = $(element).attr('aria-describedby');
          $('#' + localAttrs.popoverId).on('mouseenter', cancelTimeout);
          return $('#' + localAttrs.popoverId).on('mouseleave', addTimeout);
        }).on('hide.bs.popover', function() {
          $('#' + localAttrs.popoverId).off('mouseenter', cancelTimeout);
          return $('#' + localAttrs.popoverId).off('mouseleave', addTimeout);
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
        this.shCollapse = false;
        this.bodyElements = [];
        this.toggleCollapse = function() {
          var bodyElement, i, j, len, len1, ref, ref1;
          this.shCollapse = !this.shCollapse;
          if (this.isCollapse()) {
            ref = this.bodyElements;
            for (i = 0, len = ref.length; i < len; i++) {
              bodyElement = ref[i];
              bodyElement.slideUp('fast', function() {
                return $timeout((function() {
                  return $(window).trigger('resize');
                }), 10);
              });
              $element.addClass('is-collapse');
            }
          } else {
            ref1 = this.bodyElements;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              bodyElement = ref1[j];
              bodyElement.slideDown('fast', function() {
                return $timeout((function() {
                  return $(window).trigger('resize');
                }), 10);
              });
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

"use strict";
angular.module('sh.datepicker', []).directive("shDatepicker", [
  function() {
    return {
      restrict: 'A',
      scope: {
        shFromDate: '=?',
        shThruDate: '=?',
        shTimezone: '@',
        widgetVerticalPosition: '@?'
      },
      require: '?ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        var initiation;
        initiation = true;
        element.datetimepicker({
          timeZone: scope.shTimezone,
          showClear: true,
          showTodayButton: true,
          useCurrent: false,
          format: 'DD-MM-YYYY',
          widgetPositioning: {
            vertical: scope.widgetVerticalPosition || 'auto'
          },
          icons: {
            time: 'fa fa-clock-o',
            date: 'fa fa-calendar',
            up: 'fa fa-chevron-up',
            down: 'fa fa-chevron-down',
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-crosshairs',
            clear: 'fa fa-trash',
            close: 'fa fa-times'
          }
        });
        ngModelCtrl.$render = function() {
          var date, ref;
          date = ngModelCtrl.$viewValue;
          if (angular.isDefined(date) && date !== null) {
            if ((ref = element.data('DateTimePicker')) != null) {
              ref.date(moment(date, 'YYYY-MM-DD'));
            }
          }
          return ngModelCtrl.$viewValue;
        };
        ngModelCtrl.$parsers.push(function(data) {
          if (moment(data, 'DD-MM-YYYY').isValid()) {
            return moment(data, 'DD-MM-YYYY').format('YYYY-MM-DD');
          } else {
            data = null;
            return void 0;
          }
        });
        element.bind('dp.change', function(data) {
          if (initiation) {
            ngModelCtrl.$pristine = false;
          }
          if (data.date) {
            ngModelCtrl.$setViewValue(data.date.format('DD-MM-YYYY'));
          } else {
            ngModelCtrl.$setViewValue(null);
          }
          if (initiation) {
            ngModelCtrl.$pristine = true;
          }
          return initiation = false;
        });
        element.bind('dp.show', function(data) {
          if (initiation) {
            return initiation = false;
          }
        });
        element.bind('dp.hide', function(data) {
          var ref;
          if (!moment(ngModelCtrl.$viewValue, 'DD-MM-YYYY').isValid()) {
            ngModelCtrl.$setViewValue(null);
            return (ref = element.data('DateTimePicker')) != null ? ref.date(null) : void 0;
          }
        });
        scope.$watch('shFromDate', function(newVal, oldVal) {
          var ref, ref1;
          if (newVal != null) {
            if (moment(new Date(newVal)).isValid()) {
              return (ref = element.data('DateTimePicker')) != null ? ref.minDate(moment(new Date(newVal))) : void 0;
            }
          } else {
            return (ref1 = element.data('DateTimePicker')) != null ? ref1.minDate(false) : void 0;
          }
        });
        return scope.$watch('shThruDate', function(newVal, oldVal) {
          var ref, ref1;
          if (newVal != null) {
            if (moment(new Date(newVal)).isValid()) {
              return (ref = element.data('DateTimePicker')) != null ? ref.maxDate(moment(new Date(newVal))) : void 0;
            }
          } else {
            return (ref1 = element.data('DateTimePicker')) != null ? ref1.maxDate(false) : void 0;
          }
        });
      }
    };
  }
]).directive("shDatetimepicker", [
  'dateFilter', function(dateFilter) {
    return {
      restrict: 'A',
      scope: {
        shFromTime: '=?',
        shThruTime: '=?',
        shTimezone: '@',
        widgetVerticalPosition: '@?'
      },
      require: '?ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        var initiation;
        initiation = true;
        element.datetimepicker({
          timeZone: scope.shTimezone,
          showClose: true,
          showClear: true,
          useCurrent: false,
          showTodayButton: false,
          format: 'DD-MM-YYYY, HH:mm (z)',
          widgetPositioning: {
            vertical: scope.widgetVerticalPosition || 'auto'
          },
          icons: {
            time: 'fa fa-clock-o',
            date: 'fa fa-calendar',
            up: 'fa fa-chevron-up',
            down: 'fa fa-chevron-down',
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-crosshairs',
            clear: 'fa fa-trash',
            close: 'fa fa-times'
          }
        });
        ngModelCtrl.$render = function() {
          var date, ref;
          date = ngModelCtrl.$viewValue;
          if (angular.isDefined(date) && date !== null) {
            return (ref = element.data('DateTimePicker')) != null ? ref.date(moment.tz(moment(+date).format(), scope.shTimezone)) : void 0;
          }
        };
        ngModelCtrl.$parsers.push(function(data) {
          if (moment.tz(data, 'DD-MM-YYYY, HH:mm', scope.shTimezone).isValid()) {
            return moment.tz(data, 'DD-MM-YYYY, HH:mm', scope.shTimezone).format('x');
          } else {
            return void 0;
          }
        });
        element.bind('dp.change', function(data) {
          if (initiation) {
            ngModelCtrl.$pristine = false;
          }
          if (data.date) {
            ngModelCtrl.$setViewValue(data.date.tz(scope.shTimezone).format('DD-MM-YYYY, HH:mm (z)'));
          } else {
            ngModelCtrl.$setViewValue(null);
          }
          if (initiation) {
            ngModelCtrl.$pristine = true;
          }
          return initiation = false;
        });
        element.bind('dp.show', function(data) {
          if (initiation) {
            return initiation = false;
          }
        });
        element.bind('dp.hide', function(data) {
          var ref;
          if (!moment(ngModelCtrl.$viewValue, 'DD-MM-YYYY, HH:mm (z)').isValid()) {
            ngModelCtrl.$setViewValue(null);
            return (ref = element.data('DateTimePicker')) != null ? ref.date(null) : void 0;
          }
        });
        scope.$watch('shFromTime', function(newVal, oldVal) {
          var ref, ref1;
          if (newVal != null) {
            return (ref = element.data('DateTimePicker')) != null ? ref.minDate(moment.tz(newVal * 1, scope.shTimezone)) : void 0;
          } else {
            return (ref1 = element.data('DateTimePicker')) != null ? ref1.minDate(false) : void 0;
          }
        });
        scope.$watch('shThruTime', function(newVal, oldVal) {
          var ref, ref1;
          if (newVal != null) {
            return (ref = element.data('DateTimePicker')) != null ? ref.maxDate(moment.tz(newVal * 1, scope.shTimezone)) : void 0;
          } else {
            return (ref1 = element.data('DateTimePicker')) != null ? ref1.maxDate(false) : void 0;
          }
        });
        return scope.$watch('shTimezone', function(newVal, oldVal) {
          var date, ref;
          if (newVal != null) {
            date = ngModelCtrl.$modelValue;
            if (angular.isDefined(date) && date !== null) {
              return (ref = element.data('DateTimePicker')) != null ? ref.date(moment.tz(moment(+date).format(), scope.shTimezone)) : void 0;
            }
          }
        });
      }
    };
  }
]);

"use strict";
angular.module('sh.dialog', []).directive("shDialog", [
  '$compile', '$templateCache', function($compile, $templateCache) {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        shDialogOk: '&',
        shDialogCancel: '&?',
        shDialogContent: '@?',
        shDialogSrc: '@?',
        shDialogClass: '@?',
        title: '@?'
      },
      template: '<span>\n  <a title="{{getTitle()}}" ng-click="onHandleClick()" ng-transclude></a>\n</span>',
      link: function(scope, element, attrs) {
        scope.getShDialogModal = function() {
          return element.find('#modal-sh-dialog');
        };
        scope.getShDialogContent = function() {
          return scope.shDialogContent || 'Are you sure?';
        };
        scope.getTitle = function() {
          return scope.title || element.text();
        };
        scope.onHandleClick = function() {
          var shDialogModal, shDialogModalSrc;
          if (!(scope.getShDialogModal().length > 0)) {
            shDialogModal = angular.element('<div id="modal-sh-dialog" tabindex="-1" role="dialog" aria-labelledby="modalShDialogLabel" aria-hidden="true" class="modal">\n  <div class="modal-dialog {{shDialogClass || \'modal-sm\'}}">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;</button>\n        <div class="modal-title">&nbsp;</div>\n      </div>\n      <div class="modal-body">\n        <div class="row">\n          <div class="col-lg-12 sh-dialog-modal-content"></div>\n        </div>\n      </div>\n      <div class="modal-footer">\n        <button ng-click="onHandleModalOkClick()" class="btn btn-primary">OK</button>\n        <button data-dismiss="modal" class="btn btn-default">Cancel</button>\n      </div>\n    </div>\n  </div>\n</div>');
            $compile(shDialogModal)(scope);
            if (scope.shDialogSrc) {
              shDialogModalSrc = angular.element($templateCache.get(scope.shDialogSrc));
              $compile(shDialogModalSrc)(scope.$parent);
              shDialogModal.find('.sh-dialog-modal-content').append(shDialogModalSrc);
            } else {
              shDialogModal.find('.sh-dialog-modal-content').append(scope.getShDialogContent());
            }
            element.append(shDialogModal);
          }
          scope.getShDialogModal().modal('show');
        };
        return scope.onHandleModalOkClick = function() {
          scope.getShDialogModal().modal('hide');
          scope.shDialogOk();
        };
      }
    };
  }
]);

"use strict";
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

"use strict";
angular.module('sh.number.format', []).directive("shNumberFormat", [
  '$filter', function($filter) {
    return {
      restrict: 'A',
      scope: {
        shAllowZero: '@?',
        shMin: '@',
        shMax: '@',
        shNumberInvalidMessage: '@?',
        shNumberHint: '@?',
        ngModel: '='
      },
      require: '?ngModel',
      link: function(scope, element, attributes, ngModel) {
        var shAllowZero, updatePopover;
        shAllowZero = scope.shAllowZero === 'false' ? false : true;
        updatePopover = function() {
          var popoverContent, ref, ref1;
          popoverContent = element.attr('data-content');
          if (ngModel.$invalid) {
            popoverContent = (ref = scope.shNumberInvalidMessage) != null ? ref : 'Invalid Number';
          } else {
            if (ngModel.$modelValue == null) {
              popoverContent = (ref1 = scope.shNumberHint) != null ? ref1 : 'Insert valid number';
            }
          }
          element.siblings('.popover').find('.popover-content').html(popoverContent);
          return scope.applyValidity();
        };
        ngModel.$formatters.push(function(value) {
          return $filter('number')(parseFloat(value));
        });
        ngModel.$parsers.push(function(value) {
          var number;
          number = String(value).replace(/\,/g, '');
          number = parseFloat(number);
          if (!number) {
            return 0;
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
          var valid;
          if (attributes.required != null) {
            valid = true;
            if (scope.shMin != null) {
              valid = valid && +scope.ngModel >= scope.shMin;
            }
            if (scope.shMax != null) {
              valid = valid && +scope.ngModel <= scope.shMax;
            }
            if (!shAllowZero) {
              valid = +scope.ngModel !== 0;
            }
            return ngModel.$setValidity('required', valid);
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
          var ref;
          if ($.inArray(e.keyCode, [16, 17, 18, 46, 8, 9, 27, 13, 110, 173, 190, 189]) !== -1 || (e.keyCode >= 112 && e.keyCode <= 123) || ((ref = e.keyCode) === 65 || ref === 67 || ref === 86) && (e.ctrlKey === true || e.metaKey === true) || e.keyCode >= 35 && e.keyCode <= 40) {

          } else if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
            return e.preventDefault();
          }
        });
        scope.$watch('ngModel', function(newValue, oldValue) {
          return scope.applyValidity();
        });
        element.popover({
          trigger: 'focus',
          placement: 'top'
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
    compile: function(element, attrs) {
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
        return scope.height = elem.outerHeight();
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
        return scope.height = elem.outerHeight();
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
      scope: {},
      link: function(scope, element, attrs) {
        var assignBaseCss, assignShadowCss, refreshFreezedPane;
        assignBaseCss = function(elmt, left) {
          var outerHeight, paddingBottom, paddingLeft, paddingRight, paddingTop, parent, parentRow, reduction;
          parent = $(elmt).parent();
          parentRow = parent.parents('tr');
          paddingTop = parent.css('padding-top');
          paddingLeft = parent.css('padding-left');
          paddingRight = parent.css('padding-right');
          paddingBottom = parent.css('padding-bottom');
          outerHeight = parentRow.outerHeight();
          reduction = 1;
          return $(elmt).css({
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
          parent = $(elmt).parent();
          paddingRight = parent.css('padding-right');
          if (shadowDirection > 0) {
            if (!parent.next().hasClass('td-fixed')) {
              if (scrollSize > 0) {
                return $(elmt).css({
                  boxShadow: '1px 0 0 rgba(0, 0, 0, 0.05), -1px 0 0 rgba(0, 0, 0, 0.1), ' + (shadowDirection * 5) + 'px 0px 0px 0px rgba(0, 0, 0, 0.03)',
                  borderColor: 'rgba(0, 0, 0, 0.1)'
                });
              } else {
                return $(elmt).css({
                  boxShadow: '1px 0 0 rgba(0, 0, 0, 0.05), -1px 0 0 rgba(0, 0, 0, 0.05)',
                  borderColor: 'rgba(0, 0, 0, 0.05)'
                });
              }
            }
          } else {
            if (!parent.prev().hasClass('td-fixed')) {
              if (scrollSize > 0) {
                return $(elmt).css({
                  boxShadow: '-1px 0 0 rgba(0, 0, 0, 0.1), ' + (shadowDirection * 5) + 'px 0px 0px 0px rgba(0, 0, 0, 0.03)',
                  borderColor: 'rgba(0, 0, 0, 0.1)'
                });
              } else {
                return $(elmt).css({
                  boxShadow: 'none',
                  borderColor: 'rgba(0, 0, 0, 0.05)'
                });
              }
            }
          }
        };
        refreshFreezedPane = function() {
          var elementParent, left, scrollLeft, scrollTop, tableWidth, width;
          elementParent = $(element).parent();
          scrollTop = $(element).scrollTop();
          scrollLeft = $(element).scrollLeft();
          width = $(element)[0].clientWidth;
          tableWidth = $(element).find('table.table').width();
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
        $(element).on('scroll', function() {
          refreshFreezedPane();
        });
        return scope.$watch(function() {
          refreshFreezedPane();
        });
      }
    };
  }
]);

"use strict";
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
          if (ShSpinningService.isSpinning(attrs.shSpinning)) {
            angular.element(element).addClass('sh-spinning-spin');
            scope.spinner.spin(element[0]);
          } else {
            angular.element(element).removeClass('sh-spinning-spin');
            scope.spinner.stop();
          }
        }));
      }
    };
  }
]);

"use strict";
angular.module('sh.submit', []).directive('shSubmit', [
  '$compile', function($compile) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var random, shSubmitInvalid, shSubmitOverlay;
        random = (Math.random() + '').slice(2);
        shSubmitOverlay = angular.element('<span class="sh-submit-overlay" ng-mouseover="overlayHover' + random + '()" ng-mouseleave="overlayLeave()"></span>');
        $compile(shSubmitOverlay)(scope);
        shSubmitInvalid = attrs.shSubmitInvalid || 'Please correct/fill out the highlighted fields';
        if (element.next('.sh-submit-overlay').length === 0 && element.parents('.sh-submit-overlay').length === 0) {
          shSubmitOverlay.insertAfter(element);
          shSubmitOverlay.tooltip({
            title: shSubmitInvalid
          });
          element.appendTo(shSubmitOverlay);
        }
        scope['overlayHover' + random] = function() {
          var form;
          if (scope["" + attrs.shSubmit].$invalid) {
            form = element.parents('form').eq(0);
            if (form.length > 0) {
              form.addClass('sh-highlight-required');
            } else {
              angular.element("form[name='" + attrs.shSubmit + "']").addClass('sh-highlight-required');
            }
          }
        };
        return scope.$watch(attrs.shSubmit + ".$invalid", function(newValue, oldValue) {
          if (newValue === false) {
            return shSubmitOverlay.tooltip('destroy');
          } else {
            shSubmitOverlay.tooltip('destroy');
            return shSubmitOverlay.tooltip({
              title: shSubmitInvalid
            });
          }
        });
      }
    };
  }
]);

angular.module('sh.view.helper', []).directive('yesNo', function() {
  return {
    restrict: 'A',
    scope: {
      yesNo: '='
    },
    template: function(element, attrs) {
      return '<span ng-if="yesNo == true" class="text-success"><i class="fa fa-left fa-check"></i>{{"LABEL_YES" | translate}}</span>\n<span ng-if="yesNo == false" class="text-danger"><i class="fa fa-left fa-times"></i>{{"LABEL_NO" | translate}}</span>\n<span ng-if="yesNo == null || yesNo == undefined" class="text-muted"><i class="fa fa-left fa-dash"></i></span>';
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

"use strict";
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
      return username = newUsername;
    };
    authTokenHandler.setAuthToken = function(newAuthToken) {
      return authToken = newAuthToken;
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
        return resource[action] = function(params, data, success, error) {
          return resource['_' + action](angular.extend({}, params || {}, {
            username: authTokenHandler.getUsername(),
            authn_token: authTokenHandler.getAuthToken()
          }), data, success, error);
        };
      } else {
        return resource[action] = function(params, success, error) {
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

"use strict";

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
     * @name reload
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
      this.getData = params.getData;
      this.$data = [];
      this.$pagination = [];

      /**
       * @ngdoc method
       * @name initialize
       *
       * @param {}
       *
       * @returns promise
       *
       * @description
       * ShTableParams factory
       *
       */
      this.initialize = function() {
        return this.reload();
      };

      /**
       * @ngdoc method
       * @name reload
       *
       * @param {}
       *
       * @returns promise
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
        self.getData().then(function(success) {
          self.$data = success.items;
          self.$totalCount = success.totalCount;
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
       * @returns promise
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
       * @returns promise
       *
       * @description
       * ShTableParams factory
       *
       */
      this.sortData = function(field, direction) {
        this.$params.sorting = {};
        this.$params.sorting[field] = direction;
        return this.reload();
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

"use strict";
angular.module('sh.filter.collection', []).filter("shFilterCollection", [
  function() {
    return function(collection, callback, entity) {
      if (collection && entity) {
        return collection.filter(function(item) {
          return callback(item, entity);
        });
      }
    };
  }
]);

"use strict";
angular.module('sh.floating.precision', []).filter("shFloatingPrecision", function() {
  return function(value, accuracy) {
    if (accuracy == null) {
      accuracy = 12;
    }
    return parseFloat(value.toPrecision(accuracy));
  };
});

"use strict";
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

"use strict";
angular.module('sh.strip.html', []).filter("shStripHtml", function() {
  return function(value) {
    if (!value) {
      return "";
    } else {
      return value.replace(/<[^>]+>/gm, '');
    }
  };
});

"use strict";
angular.module('sh.strip.to.newline', []).filter("shStripToNewline", function() {
  return function(value) {
    if (!value) {
      return "";
    } else {
      return value.replace(/\s-\s/g, '<br/>');
    }
  };
});

"use strict";
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

"use strict";
angular.module('sh.bulk.helper', []).run([
  '$rootScope', function($rootScope) {
    return $rootScope.bulkHelper = [
      '$scope', function($scope) {
        $scope.selectedEntities = [];
        $scope.selectAll = function(items) {
          var activeItems;
          activeItems = $scope.activeItems(items);
          if ($scope.selectedItems(activeItems).length === activeItems.length) {
            return activeItems.forEach(function(item) {
              return item.$selected = false;
            });
          } else {
            return activeItems.forEach(function(item) {
              return item.$selected = true;
            });
          }
        };
        $scope.updateSelectedEntities = function(items) {
          var activeItems;
          activeItems = $scope.activeItems(items);
          return $scope.selectedEntities = $scope.selectedItems(activeItems);
        };
        $scope.activeItems = function(items) {
          if (items instanceof Array) {
            return items.filter(function(item) {
              return $scope.recentlyDeletedIds.indexOf(item.id) < 0;
            });
          }
        };
        return $scope.selectedItems = function(items) {
          var activeItems, i, j, len, ref, results;
          if (items instanceof Array) {
            activeItems = $scope.activeItems(items);
            ref = activeItems.filter(function(item) {
              return !!item.$selected;
            });
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
              i = ref[j];
              results.push(i.id);
            }
            return results;
          }
        };
      }
    ];
  }
]);

"use strict";
angular.module('sh.init.ng.table', []).run([
  '$rootScope', '$templateCache', 'ngTableParams', function($rootScope, $templateCache, ngTableParams) {
    return $rootScope.initNgTable = [
      '$scope', '$timeout', '$filter', function($scope, $timeout, $filter) {
        $scope.recentlyCreatedIds = [];
        $scope.recentlyUpdatedIds = [];
        $scope.recentlyDeletedIds = [];
        if ($scope.asyncBlock == null) {
          $scope.asyncBlock = false;
        }
        $scope.gridRefreshing = true;
        $scope.pagingOptions = {
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 25, 50, 100]
        };
        if ($scope.sorting == null) {
          $scope.sorting = {
            id: "desc"
          };
        }
        $scope.tableParams = new ngTableParams({
          page: $scope.pagingOptions.currentPage,
          count: $scope.pagingOptions.pageSize,
          sorting: $scope.sorting
        }, {
          total: 0,
          getData: function($defer, params) {
            $scope.tableParamsGetData = {
              defer: $defer,
              params: params
            };
            return $scope.refreshGrid();
          }
        });
        $scope.beforeGetPagedData = function() {

          /* Befor Get PAge Data Callback */
        };
        $scope.refreshGrid = function(currentPage) {
          if (currentPage == null) {
            currentPage = null;
          }
          if (currentPage) {
            $scope.tableParams.page(currentPage);
          }
          return $scope.getPagedDataAsync();
        };
        $scope.generateGridParams = function() {
          var $defer, directions, fields, gridParams, params, property;
          $defer = $scope.tableParamsGetData.defer;
          params = $scope.tableParamsGetData.params;
          fields = [];
          directions = [];
          for (property in params.$params.sorting) {
            fields.push(property);
            directions.push(params.$params.sorting[property]);
          }
          gridParams = {
            column_defs: JSON.stringify($scope.getProcessedColumnDefs($scope.columnDefs)),
            page: params.$params.page,
            per_page: params.$params.count,
            sort_info: JSON.stringify({
              fields: fields,
              directions: directions
            }),
            filter_params: {}
          };
          if ($scope.filterParams) {
            angular.extend(gridParams.filter_params, $scope.filterParams);
          }
          return gridParams;
        };
        $scope.getPagedDataAsync = function() {
          if ($scope.asyncBlock === false) {
            $scope.asyncBlock = true;
            return $timeout((function() {
              var $defer, gridParams, params;
              $scope.beforeGetPagedData();
              $defer = $scope.tableParamsGetData.defer;
              params = $scope.tableParamsGetData.params;
              gridParams = $scope.generateGridParams();
              $scope.gridRefreshing = true;
              return $scope.resource.get(angular.extend(gridParams, $scope.optParams)).$promise.then(function(success) {
                params.total(success.data.total_server_items);
                $defer.resolve(success.data.items);
                $scope.tableParams.reload();
                if (($scope.getPagedDataAsyncSuccess != null) && typeof $scope.getPagedDataAsyncSuccess === 'function') {
                  $scope.getPagedDataAsyncSuccess(success);
                }
                $scope.gridRefreshing = false;
                $scope.asyncBlock = false;
              }, function(error) {
                $scope.gridRefreshing = false;
                return $scope.asyncBlock = false;
              });
            }), 100);
          }
        };
        $scope.getProcessedColumnDefs = function(columnDefs) {
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
        $scope.getPagedDataAsyncSuccess = function(response) {};
        $scope.sortableClass = function(fieldName) {
          if ($scope.tableParams.isSortBy(fieldName, 'asc')) {
            return 'sortable sort-asc';
          } else if ($scope.tableParams.isSortBy(fieldName, 'desc')) {
            return 'sortable sort-desc';
          } else {
            return 'sortable';
          }
        };
        $scope.sortableClick = function(fieldName) {
          var newDirection;
          newDirection = 'asc';
          if ($scope.tableParams.isSortBy(fieldName, 'asc')) {
            newDirection = 'desc';
          }
          return $scope.tableParams.sorting(fieldName, newDirection);
        };
        $scope.getGeneratedPagesArray = function() {
          return $scope.tableParams.generatePagesArray($scope.tableParams.page(), $scope.tableParams.total(), $scope.tableParams.count());
        };
        $scope.pages = $scope.getGeneratedPagesArray();
        return $scope.$on('ngTableAfterReloadData', function() {
          return $scope.pages = $scope.getGeneratedPagesArray();
        }, true);
      }
    ];
  }
]);

"use strict";
angular.module('sh.modal.persistence', []).run([
  '$rootScope', function($rootScope) {
    return $rootScope.modalPersistence = [
      '$scope', '$q', '$timeout', 'ShNotification', 'ShButtonState', function($scope, $q, $timeout, ShNotification, ShButtonState) {
        $scope.entity = {};
        $scope.errors = [];
        $scope.localLookup = {};
        $scope.modalProperties = {};
        $scope.beforeNewEntity = function() {};
        $scope.newEntitySuccess = function(response) {};
        $scope.newEntitySuccessNotification = function(response) {};
        $scope.newEntityFailure = function(response) {};
        $scope.newEntityFailureNotification = function(response) {};
        $scope.beforeCreateEntity = function($event) {};
        $scope.createEntitySuccess = function(response, $event) {};
        $scope.createEntitySuccessNotification = function(response, $event) {
          return ShNotification.toastByResponse(response, {
            type: 'success',
            message: 'Successfully Created'
          });
        };
        $scope.createEntityFailure = function(response, $event) {};
        $scope.createEntityFailureNotification = function(response, $event) {
          if (response && response.data && response.data.error) {
            return ShNotification.toastByResponse(response, {
              type: 'danger',
              message: response.data.error.message
            });
          } else {
            return ShNotification.toastByResponse(response, {
              type: 'danger',
              message: 'Failed to Create'
            });
          }
        };
        $scope.beforeEditEntity = function(id) {};
        $scope.editEntitySuccess = function(response, id) {};
        $scope.editEntitySuccessNotification = function(response, id) {};
        $scope.editEntityFailure = function(response, id) {};
        $scope.editEntityFailureNotification = function(response, id) {};
        $scope.beforeUpdateEntity = function($event) {};
        $scope.updateEntitySuccess = function(response, $event) {};
        $scope.updateEntitySuccessNotification = function(response, $event) {
          return ShNotification.toastByResponse(response, {
            type: 'success',
            message: 'Successfully Updated'
          });
        };
        $scope.updateEntityFailure = function(response, $event) {};
        $scope.updateEntityFailureNotification = function(response, $event) {
          if (response && response.data && response.data.error) {
            return ShNotification.toastByResponse(response, {
              type: 'danger',
              message: response.data.error.message
            });
          } else {
            return ShNotification.toastByResponse(response, {
              type: 'danger',
              message: 'Failed to Update'
            });
          }
        };
        $scope.beforeDestroyEntity = function($event) {};
        $scope.destroyEntitySuccess = function(response, $event) {};
        $scope.destroyEntitySuccessNotification = function(response, $event) {
          return ShNotification.toastByResponse(response, {
            type: 'success',
            message: 'Successfully Deleted'
          });
        };
        $scope.destroyEntityFailure = function(response, $event) {};
        $scope.destroyEntityFailureNotification = function(response, $event) {
          if (response.data.error.message !== null) {
            return ShNotification.toastByResponse(response, {
              type: 'danger',
              message: response.data.error.message
            });
          } else {
            return ShNotification.toastByResponse(response, {
              type: 'danger',
              message: 'Failed to Delete'
            });
          }
        };
        $scope.beforeMultipleDestroyEntity = function() {};
        $scope.multipleDestroyEntitySuccess = function(response) {};
        $scope.multipleDestroyEntitySuccessNotification = function(response) {
          return ShNotification.toastByResponse(response, {
            type: 'success',
            message: 'Successfully Deleted'
          });
        };
        $scope.multipleDestroyEntityFailure = function(response) {};
        $scope.multipleDestroyEntityFailureNotification = function(response) {
          if (response.data.error.message !== null) {
            return ShNotification.toastByResponse(response, {
              type: 'danger',
              message: response.data.error.message
            });
          } else {
            return ShNotification.toastByResponse(response, {
              type: 'danger',
              message: 'Failed to Delete'
            });
          }
        };
        $scope.beforeShowEntityModal = function(elementStr, id) {
          if (id == null) {
            id = null;
          }
        };
        $scope.afterCloseEntityModal = function(elementStr, id) {
          if (id == null) {
            id = null;
          }
        };
        $scope.beforeSaveEntity = function(elementStr, $event) {};
        $scope.showEntityModal = function(elementStr, id) {
          if (id == null) {
            id = null;
          }
          $scope.beforeShowEntityModal(elementStr, id);
          if (id === null) {
            return $scope.showNewEntityModal(elementStr);
          } else {
            return $scope.showEditEntityModal(id, elementStr);
          }
        };
        $scope.resetEntityModal = function(elementStr) {
          var entityForm, entityFormName, ref;
          if (elementStr == null) {
            elementStr = null;
          }
          $scope.entity = {};
          $scope.errors = [];
          $scope.localLookup = {};
          if (elementStr) {
            entityForm = angular.element("#" + elementStr).find('form').eq(0);
            entityForm.removeClass('sh-highlight-required');
            entityFormName = entityForm.attr('name');
            if ((entityFormName != null) && $scope[entityFormName] !== null) {
              return (ref = $scope[entityFormName]) != null ? ref.$setPristine() : void 0;
            }
          }
        };
        $scope.closeEntityModal = function(elementStr) {
          angular.element("#" + elementStr).modal('hide');
          $scope.resetEntityModal(elementStr);
          return $scope.afterCloseEntityModal(elementStr);
        };
        $scope.saveEntity = function(elementStr, $event) {
          $scope.beforeSaveEntity(elementStr, $event);
          if ($scope.entity.id != null) {
            return $scope.updateEntity(elementStr, $event);
          } else {
            return $scope.createEntity(elementStr, $event);
          }
        };
        $scope.showNewEntityModal = function(elementStr) {
          angular.element("#" + elementStr).modal('show');
          angular.element("#" + elementStr).on('hidden.bs.modal', function() {
            $scope.closeNewEntityModal(elementStr);
            return $scope.modalProperties.visible = false;
          });
          return $scope.fetchNewEntity();
        };
        $scope.fetchNewEntity = function() {
          var deferred;
          deferred = $q.defer();
          $rootScope.spinningService.spin('modal');
          $scope.beforeNewEntity();
          $scope.resource["new"](angular.extend({}, $scope.optParams)).$promise.then(function(success) {
            $rootScope.spinningService.stop('modal');
            $scope.entity = success.data;
            $scope.localLookup = success.lookup;
            $scope.modalProperties.visible = true;
            $scope.newEntitySuccess(success);
            $scope.newEntitySuccessNotification(success);
            return deferred.resolve(success);
          }, function(error) {
            $rootScope.spinningService.stop('modal');
            $scope.newEntityFailure(error);
            $scope.newEntityFailureNotification(error);
            return deferred.reject(error);
          });
          return deferred.promise;
        };
        $scope.closeNewEntityModal = function(elementStr) {
          angular.element("#" + elementStr).modal('hide');
          $scope.resetEntityModal(elementStr);
          return $scope.afterCloseEntityModal(elementStr);
        };
        $scope.createEntity = function(elementStr, $event) {
          $scope.beforeCreateEntity($event);
          $event = ShButtonState.initializeEvent($event);
          ShButtonState.loading($event);
          return $scope.resource.save(angular.extend({}, $scope.optParams), {
            data: $scope.entity
          }).$promise.then(function(success) {
            $scope.closeNewEntityModal(elementStr);
            if ($scope.recentlyCreatedIds != null) {
              $scope.recentlyCreatedIds.push(success.data.id);
            }
            if (typeof $scope.getPagedDataAsync === 'function') {
              $scope.refreshGrid();
            }
            ShButtonState.enable($event);
            $scope.createEntitySuccess(success, $event);
            return $scope.createEntitySuccessNotification(success, $event);
          }, function(error) {
            $scope.errors = error.data.error.errors;
            ShButtonState.enable($event);
            $scope.createEntityFailure(error, $event);
            return $scope.createEntityFailureNotification(error, $event);
          });
        };
        $scope.showEditEntityModal = function(id, elementStr) {
          angular.element("#" + elementStr).modal('show');
          angular.element("#" + elementStr).on('hidden.bs.modal', function() {
            $scope.closeEditEntityModal(elementStr, id);
            return $scope.modalProperties.visible = false;
          });
          return $scope.fetchEditEntity(id);
        };
        $scope.fetchEditEntity = function(id) {
          var deferred;
          deferred = $q.defer();
          $rootScope.spinningService.spin('modal');
          $scope.beforeEditEntity(id);
          $scope.resource.edit(angular.extend({
            id: id
          }, $scope.optParams)).$promise.then(function(success) {
            $rootScope.spinningService.stop('modal');
            $scope.entity = success.data;
            $scope.localLookup = success.lookup;
            $scope.modalProperties.visible = true;
            $scope.editEntitySuccess(success, id);
            $scope.editEntitySuccessNotification(success, id);
            return deferred.resolve(success);
          }, function(error) {
            $rootScope.spinningService.stop('modal');
            $scope.editEntityFailure(error, id);
            $scope.editEntityFailureNotification(error, id);
            return deferred.reject(error);
          });
          return deferred.promise;
        };
        $scope.closeEditEntityModal = function(elementStr, id) {
          angular.element("#" + elementStr).modal('hide');
          $scope.resetEntityModal(elementStr);
          return $scope.afterCloseEntityModal(elementStr, id);
        };
        $scope.updateEntity = function(elementStr, $event) {
          $scope.beforeUpdateEntity($event);
          $event = ShButtonState.initializeEvent($event);
          ShButtonState.loading($event);
          return $scope.resource.update(angular.extend({
            id: $scope.entity.id
          }, $scope.optParams), {
            data: $scope.entity
          }).$promise.then(function(success) {
            $scope.closeEditEntityModal(elementStr, $scope.entity.id);
            if ($scope.recentlyUpdatedIds != null) {
              $scope.recentlyUpdatedIds.push(success.data.id);
            }
            if (typeof $scope.getPagedDataAsync === 'function') {
              $scope.refreshGrid();
            }
            ShButtonState.enable($event);
            $scope.updateEntitySuccess(success, $event);
            return $scope.updateEntitySuccessNotification(success, $event);
          }, function(error) {
            $scope.errors = error.data.error.errors;
            ShButtonState.enable($event);
            $scope.updateEntityFailure(error, $event);
            return $scope.updateEntityFailureNotification(error, $event);
          });
        };
        $scope.destroyEntity = function(id, $event) {
          var deferred;
          deferred = $q.defer();
          $event = ShButtonState.initializeEvent($event);
          ShButtonState.loading($event);
          $scope.beforeDestroyEntity($event);
          $scope.resource["delete"](angular.extend({
            id: id
          }, $scope.optParams)).$promise.then(function(success) {
            if ($scope.recentlyDeletedIds != null) {
              $scope.recentlyDeletedIds.push(success.data.id);
            }
            if (typeof $scope.getPagedDataAsync === 'function') {
              $scope.refreshGrid();
            }
            $scope.destroyEntitySuccess(success, $event);
            $scope.destroyEntitySuccessNotification(success, $event);
            angular.element('.modal').modal('hide');
            return deferred.resolve(success);
          }, function(error) {
            $scope.destroyEntityFailure(error, $event);
            $scope.destroyEntityFailureNotification(error, $event);
            ShButtonState.enable($event);
            return deferred.reject(error);
          });
          return deferred.promise;
        };
        $scope.deleteEntity = function(id, $event) {
          return $scope.destroyEntity(id, $event);
        };
        $scope.multipleDestroyEntity = function(ids) {
          $scope.beforeMultipleDestroyEntity();
          return $scope.resource.multiple_delete(angular.extend({
            'ids[]': ids
          }, $scope.optParams)).$promise.then(function(success) {
            if ($scope.recentlyDeletedIds != null) {
              $scope.recentlyDeletedIds = ids;
            }
            $scope.selectedEntities = [];
            $scope.multipleDestroyEntitySuccess(success);
            return $scope.multipleDestroyEntitySuccessNotification(success);
          }, function(error) {
            $scope.multipleDestroyEntityFailure(error);
            return $scope.multipleDestroyEntityFailureNotification(error);
          });
        };
        $scope.multipleDeleteEntity = function(ids) {
          return $scope.multipleDestroyEntity(ids);
        };
        return $scope.rowEvent = function(entity) {
          if ($scope.recentlyDeletedIds.indexOf(entity.id) >= 0) {
            return 'recently-deleted';
          } else if ($scope.recentlyUpdatedIds.indexOf(entity.id) >= 0) {
            return 'recently-updated';
          } else if ($scope.recentlyCreatedIds.indexOf(entity.id) >= 0) {
            return 'recently-created';
          } else {
            return 'else';
          }
        };
      }
    ];
  }
]);

"use strict";
angular.module('sh.persistence', []).run([
  '$rootScope', function($rootScope) {
    return $rootScope.persistence = [
      '$scope', '$timeout', '$state', 'ShNotification', 'ShButtonState', function($scope, $timeout, $state, ShNotification, ShButtonState) {
        $scope.entity = {};
        $scope.localLookup = {};
        $scope.privileges = {};
        $scope.saved = false;
        $scope.addNestedAttributes = function(objName) {
          return $scope.entity[objName].push({});
        };
        $scope.removeNestedAttributes = function(objName, obj) {
          var index;
          if (obj['id']) {
            return obj['_destroy'] = true;
          } else {
            index = $scope.entity[objName].indexOf(obj);
            return $scope.entity[objName].splice(index, 1);
          }
        };
        $scope.beforeNewEntity = function() {};
        $scope.newEntitySuccess = function(response) {};
        $scope.newEntitySuccessNotification = function(response) {};
        $scope.newEntityFailure = function(response) {};
        $scope.newEntityFailureNotification = function(response) {};
        $scope.beforeCreateEntity = function($event) {};
        $scope.createEntitySuccess = function(response, $event) {};
        $scope.createEntitySuccessNotification = function(response, $event) {
          return ShNotification.toastByResponse(response, {
            type: 'success',
            message: 'Successfully Created'
          });
        };
        $scope.createEntityFailure = function(response, $event) {};
        $scope.createEntityFailureNotification = function(response, $event) {
          return ShNotification.toastByResponse(response, {
            type: 'danger',
            message: 'Failed to Create'
          });
        };
        $scope.beforeEditEntity = function() {};
        $scope.editEntitySuccess = function(response) {};
        $scope.editEntitySuccessNotification = function(response) {};
        $scope.editEntityFailure = function(response) {};
        $scope.editEntityFailureNotification = function(response) {};
        $scope.beforeUpdateEntity = function($event) {};
        $scope.updateEntitySuccess = function(response, $event) {};
        $scope.updateEntitySuccessNotification = function(response, $event) {
          return ShNotification.toastByResponse(response, {
            type: 'success',
            message: 'Successfully Updated'
          });
        };
        $scope.updateEntityFailure = function(response, $event) {};
        $scope.updateEntityFailureNotification = function(response, $event) {
          return ShNotification.toastByResponse(response, {
            type: 'danger',
            message: 'Failed to Update'
          });
        };
        $scope.saveEntity = function($event) {
          if ($scope.entity.id != null) {
            return $scope.updateEntity($event);
          } else {
            return $scope.createEntity($event);
          }
        };
        $scope.createEntity = function($event) {
          $scope.beforeCreateEntity($event);
          $event = ShButtonState.initializeEvent($event);
          ShButtonState.loading($event);
          return $scope.resource.save(angular.extend({}, $scope.optParams), {
            data: $scope.entity
          }).$promise.then(function(success) {
            var params;
            params = {};
            params['id'] = success.data.id;
            $state.transitionTo($scope.showPath, params);
            $scope.createEntitySuccess(success, $event);
            $scope.createEntitySuccessNotification(success, $event);
            return ShButtonState.enable($event);
          }, function(error) {
            $scope.createEntityFailure(error, $event);
            $scope.createEntityFailureNotification(error, $event);
            return ShButtonState.enable($event);
          });
        };
        $scope.updateEntity = function($event) {
          $scope.beforeUpdateEntity($event);
          $event = ShButtonState.initializeEvent($event);
          ShButtonState.loading($event);
          $scope.saved = false;
          return $scope.resource.update(angular.extend({
            id: $scope.entity.id
          }, $scope.optParams), {
            data: $scope.entity
          }).$promise.then(function(success) {
            $scope.saved = true;
            $timeout((function() {
              return $scope.saved = false;
            }), 5000);
            $scope.updateEntitySuccess(success, $event);
            $scope.updateEntitySuccessNotification(success, $event);
            return ShButtonState.enable($event);
          }, function(error) {
            $scope.updateEntityFailure(error, $event);
            $scope.updateEntityFailureNotification(error, $event);
            return ShButtonState.enable($event);
          });
        };
        $scope.init = function() {
          if ($scope.id === void 0) {
            $scope.beforeNewEntity();
            return $scope.resource["new"]($scope.optParams).$promise.then(function(success) {
              $scope.entity = success.data;
              $scope.localLookup = success.lookup;
              $scope.privileges = success.privileges;
              $scope.newEntitySuccess(success);
              return $scope.newEntitySuccessNotification(success);
            }, function(error) {
              $scope.newEntityFailure(error);
              return $scope.newEntityFailureNotification(error);
            });
          } else {
            $scope.beforeEditEntity();
            return $scope.resource.edit(angular.extend({
              id: $scope.id
            }, $scope.optParams)).$promise.then(function(success) {
              $scope.entity = success.data;
              $scope.localLookup = success.lookup;
              $scope.privileges = success.privileges;
              $scope.editEntitySuccess(success);
              return $scope.editEntitySuccessNotification(success);
            }, function(error) {
              $scope.editEntityFailure(error);
              return $scope.editEntityFailureNotification(error);
            });
          }
        };
        if (!$scope.skipInit) {
          return $scope.init();
        }
      }
    ];
  }
]);

"use strict";
shApiModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shApi
     *
     * @description
     * ShTableRest
     */
    return $rootScope.shApi = [
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
        return this["delete"] = function(id, params) {
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
      }
    ];
  }
]);

"use strict";
shFormModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shForm
     *
     * @description
     * ShForm
     */
    return $rootScope.shForm = [
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
        return this.isResetButtonDisabled = function() {
          var ref, ref1;
          return ((ref = this.entityForm) != null ? ref.$pristine : void 0) || ((ref1 = this.entityForm) != null ? ref1.$submitted : void 0);
        };
      }
    ];
  }
]);

"use strict";
shPersistenceModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableHook
     *
     * @description
     * ShTableRest
     */
    return $rootScope.shPersistenceHookNotification = [
      'ShNotification', function(ShNotification) {
        var self;
        self = this;
        this.newEntityErrorHooks.push(function(error) {
          return ShNotification.toastByResponse(error);
        });
        this.createEntityErrorHooks.push(function(error) {
          return ShNotification.toastByResponse(error);
        });
        this.editEntityErrorHooks.push(function(error) {
          return ShNotification.toastByResponse(error);
        });
        return this.updateEntityErrorHooks.push(function(error) {
          return ShNotification.toastByResponse(error);
        });
      }
    ];
  }
]);

"use strict";
shPersistenceModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableHook
     *
     * @description
     * ShTableRest
     */
    return $rootScope.shPersistenceHook = [
      '$q', '$injector', function($q, $injector) {
        var self;
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
        this.shApi = {
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
          this.shApi["new"](this.optParams).then(function(success) {
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
          this.shApi.create(this.optParams, data).then(function(success) {
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
          this.shApi.edit(id, this.optParams).then(function(success) {
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
          this.shApi.update(id, this.optParams, data).then(function(success) {
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
          this.shApi["delete"](id, this.optParams).then(function(success) {
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
        $injector.invoke($rootScope.shApi, this.shApi);
        $injector.invoke($rootScope.shPersistenceHookNotification, self);
      }
    ];
  }
]);

"use strict";
shPersistenceModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTable
     *
     * @description
     * shTable
     */
    return $rootScope.shPersistence = [
      '$injector', '$q', function($injector, $q) {
        var self;
        self = this;
        this.entity = {};
        if (this.resource == null) {
          this.resource = null;
        }
        this.localLookup = {};
        if (this.sorting == null) {
          this.sorting = {
            id: "desc"
          };
        }
        if (this.autoload == null) {
          this.autoload = true;
        }
        $injector.invoke($rootScope.shPersistenceHook, this);
        if (this.autoload) {
          return this.initEntity();
        }
      }
    ];
  }
]);

"use strict";
shTableModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableHelper
     *
     * @description
     * shTableHelper
     */
    return $rootScope.shTableFilter = [
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
          $.extend(this.filterParams, dateParams);
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
          return dateParams[shFilter + "_eqdate"] = moment().format('YYYY-MM-DD');
        };
        this.filterDatePastNDays = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
          return dateParams[shFilter + "_gteqdate"] = moment().subtract(n, 'days').format('YYYY-MM-DD');
        };
        this.filterDatePastNWeeks = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
          return dateParams[shFilter + "_gteqdate"] = moment().subtract(n, 'weeks').format('YYYY-MM-DD');
        };
        this.filterDatePastNMonths = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
          return dateParams[shFilter + "_gteqdate"] = moment().subtract(n, 'months').format('YYYY-MM-DD');
        };
        this.filterDatePastNYears = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
          return dateParams[shFilter + "_gteqdate"] = moment().subtract(n, 'years').format('YYYY-MM-DD');
        };
        this.filterDateNextNDays = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().add(n, 'days').format('YYYY-MM-DD');
          return dateParams[shFilter + "_gteqdate"] = moment().format('YYYY-MM-DD');
        };
        this.filterDateNextNWeeks = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().add(n, 'weeks').format('YYYY-MM-DD');
          return dateParams[shFilter + "_gteqdate"] = moment().format('YYYY-MM-DD');
        };
        this.filterDateNextNMonths = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().add(n, 'months').format('YYYY-MM-DD');
          return dateParams[shFilter + "_gteqdate"] = moment().format('YYYY-MM-DD');
        };
        this.filterDateNextNYears = function(shFilter, n) {
          dateParams[shFilter + "_lteqdate"] = moment().add(n, 'years').format('YYYY-MM-DD');
          return dateParams[shFilter + "_gteqdate"] = moment().format('YYYY-MM-DD');
        };
        this.filterDateRange = function(shFilter, fromDate, thruDate) {
          dateParams[shFilter + "_gteqdate"] = fromDate;
          return dateParams[shFilter + "_lteqdate"] = thruDate;
        };
        this.getLabelDateSpecific = function(shFilter) {
          return this.filterParams[shFilter + "_eqdate"] || null;
        };
        this.openDateFilterModal = function(shFilter) {
          angular.element("#date-filter-" + shFilter + "-modal").modal('show');
        };
        numberParams = {};
        this.prepareFilterNumber = function(shFilter) {
          numberParams = {};
          delete this.filterParams[shFilter + "_eq"];
          delete this.filterParams[shFilter + "_lteq"];
          return delete this.filterParams[shFilter + "_gteq"];
        };
        this.executeFilterNumber = function() {
          $.extend(this.filterParams, numberParams);
          this.tableParams.$params.pageNumber = 1;
          return this.refreshGrid();
        };
        this.filterNumberAny = function(shFilter) {
          console.log('@filterNumberAny', shFilter);
          this.prepareFilterNumber(shFilter);
          return this.executeFilterNumber();
        };
        this.filterNumberSpecific = function(shFilter, number) {
          console.log('@filterNumberSpecific', number);
          this.prepareFilterNumber(shFilter);
          if (!(number === null || number === void 0)) {
            numberParams[shFilter + "_eq"] = number;
          }
          return this.executeFilterNumber();
        };
        this.filterNumberRange = function(shFilter, leftNumber, rightNumber) {
          console.log('@filterNumberRange', shFilter, leftNumber, rightNumber);
          this.prepareFilterNumber(shFilter);
          if (!(leftNumber === null || leftNumber === void 0)) {
            numberParams[shFilter + "_gteq"] = leftNumber;
          }
          if (!(rightNumber === null || rightNumber === void 0)) {
            numberParams[shFilter + "_lteq"] = rightNumber;
          }
          return this.executeFilterNumber();
        };
        this.getLabelNumberRange = function(shFilter, leftNumber, rightNumber) {
          if (!(leftNumber === null || leftNumber === void 0) && !(rightNumber === null || rightNumber === void 0)) {
            return $filter('number')(leftNumber) + ' - ' + $filter('number')(rightNumber);
          } else if (!(leftNumber === null || leftNumber === void 0)) {
            return '> ' + $filter('number')(leftNumber);
          } else if (!(rightNumber === null || rightNumber === void 0)) {
            return '< ' + $filter('number')(rightNumber);
          } else {
            return null;
          }
        };
        this.getLabelNumberSpecific = function(shFilter) {
          return this.filterParams[shFilter + "_eq"] || null;
        };
        this.openNumberFilterModal = function(shFilter) {
          angular.element("#number-filter-" + shFilter + "-modal").modal('show');
        };
        this.filterTextCont = function(shFilter) {
          console.log('bar');
          this.tableParams.$params.pageNumber = 1;
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
          return this.refreshGrid();
        };
        this.filterMonthBetween = function(shFilter, month) {
          var mDate, year;
          console.log('month', month);
          if (this.filterParams[shFilter + '_year']) {
            year = this.filterParams[shFilter + '_year'];
            month = ('00' + month).slice(-2);
            this.filterParams[shFilter + '_month'] = month;
            mDate = moment(year + '-' + month + '-01');
            this.filterParams[shFilter + '_lteqdate'] = mDate.endOf('month').format('YYYY-MM-DD');
            this.filterParams[shFilter + '_gteqdate'] = mDate.startOf('month').format('YYYY-MM-DD');
          }
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
          return this.filterRegion.visible = !this.filterRegion.visible;
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
          return this.refreshGrid();
        };
        return this.isNoFilter = function() {
          return $.isEmptyObject(this.filterParams);
        };
      }
    ];
  }
]);

"use strict";
shTableModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableHelper
     *
     * @description
     * shTableHelper
     */
    return $rootScope.shTableHelper = [
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
          return this.tableParams.sortData(fieldName, newDirection);
        };

        /**
         * @ngdoc method
         * @name rowEventClass
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
         * Return true if given object/entity/entity-id is recently created (found in сreatedIds)
         *
         * @param {Object} entity Entity object or string `UUID`
         *
         * @returns {Boolean}
         */
        this.isRecentlyCreated = function(obj) {
          return this.сreatedIds.indexOf((obj != null ? obj.id : void 0) || obj) >= 0;
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
        return this.isRecentlyDeleted = function(obj) {
          return this.deletedIds.indexOf((obj != null ? obj.id : void 0) || obj) >= 0;
        };
      }
    ];
  }
]);

"use strict";
shTableModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableHook
     *
     * @description
     * ShTableRest
     */
    return $rootScope.shTableHookNotification = [
      'ShNotification', function(ShNotification) {
        var self;
        self = this;
        this.getEntitiesErrorHooks.push(function(error) {
          return ShNotification.toastByResponse(error);
        });
        this.newEntityErrorHooks.push(function(error) {
          return ShNotification.toastByResponse(error);
        });
        this.createEntityErrorHooks.push(function(error) {
          return ShNotification.toastByResponse(error);
        });
        this.editEntityErrorHooks.push(function(error) {
          return ShNotification.toastByResponse(error);
        });
        this.updateEntityErrorHooks.push(function(error) {
          return ShNotification.toastByResponse(error);
        });
        return this.deleteEntityErrorHooks.push(function(error) {
          return ShNotification.toastByResponse(error);
        });
      }
    ];
  }
]);

"use strict";
shTableModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableHook
     *
     * @description
     * ShTableRest
     */
    return $rootScope.shTableHook = [
      '$q', '$injector', function($q, $injector) {
        var self;
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
        this.сreatedIds = [];
        this.updatedIds = [];
        this.deletedIds = [];
        this.shApi = {
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
          this.shApi.index(this.optParams).then(function(success) {
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
          this.shApi["new"](this.optParams).then(function(success) {
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
          this.shApi.create(this.optParams, data).then(function(success) {
            var j, len1, ref1;
            self.сreatedIds.push(success.data.id);
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
          this.shApi.edit(id, this.optParams).then(function(success) {
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
          this.shApi.update(id, this.optParams, data).then(function(success) {
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
          this.shApi["delete"](id, this.optParams).then(function(success) {
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
        $injector.invoke($rootScope.shApi, this.shApi);
        $injector.invoke($rootScope.shTableHookNotification, self);
      }
    ];
  }
]);

"use strict";
shTableModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTableProcessor
     *
     * @description
     * shTableProcessor
     */
    return $rootScope.shTableProcessor = [
      '$injector', '$q', function($injector, $q) {
        var self;
        self = this;
        $injector.invoke($rootScope.shTableFilter, this);
        $injector.invoke($rootScope.shTableHelper, this);
        $injector.invoke($rootScope.shTableHook, this);

        /**
         * @ngdoc method
         * @name goToPage
         *
         * @description
         *
         *
         * @returns {*}
         */
        this.goToPage = function(pageNumber, perPage) {
          if (pageNumber != null) {
            this.tableParams.$params.perPage = perPage || this.tableParams.$params.perPage;
            this.tableParams.$params.pageNumber = pageNumber;
          }
          return this.refreshGrid();
        };

        /**
         * @ngdoc method
         * @name refreshGrid
         *
         * @description
         *
         *
         * @returns {*}
         */
        this.refreshGrid = function() {
          return this.tableParams.reload();
        };

        /**
         * @ngdoc method
         * @name generateGridParams
         *
         * @description
         *
         *
         * @returns {Object} Grid params object
         */
        this.generateGridParams = function() {
          var directions, fields, gridParams, params, property;
          params = this.tableParams.$params;
          fields = [];
          directions = [];
          for (property in params.sorting) {
            fields.push(property);
            directions.push(params.sorting[property]);
          }
          gridParams = {
            column_defs: JSON.stringify(this.getProcessedColumnDefs(this.columnDefs)),
            page: params.pageNumber,
            per_page: params.perPage,
            sort_info: JSON.stringify({
              fields: fields,
              directions: directions
            }),
            filter_params: {}
          };
          if (this.filterParams) {
            angular.extend(gridParams.filter_params, this.filterParams);
          }
          return gridParams;
        };

        /**
         * @ngdoc method
         * @name getPagedDataAsync
         *
         * @description
         *
         *
         * @returns {promise}
         */
        this.getPagedDataAsync = function() {
          var deferred, gridParams, params;
          deferred = $q.defer();
          params = this.tableParams.$params;
          gridParams = this.generateGridParams();
          angular.extend(this.optParams, gridParams);
          this.getEntities().then(function(success) {
            return deferred.resolve({
              items: success.data.items,
              totalCount: success.data.total_server_items
            });
          });
          return deferred.promise;
        };

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
        return this.getProcessedColumnDefs = function(columnDefs) {
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

"use strict";
shTableModule.run([
  '$rootScope', function($rootScope) {

    /**
     * @ngdoc factory
     * @name shTable
     *
     * @description
     * shTable
     */
    return $rootScope.shTable = [
      '$injector', '$q', 'ShTableParams', function($injector, $q, ShTableParams) {
        var self;
        self = this;
        this.entity = {};
        if (this.resource == null) {
          this.resource = null;
        }
        this.localLookup = {};
        if (this.sorting == null) {
          this.sorting = {
            id: "desc"
          };
        }
        if (this.autoload == null) {
          this.autoload = true;
        }
        $injector.invoke($rootScope.shTableProcessor, this);
        this.tableParams = new ShTableParams({
          pageNumber: 1,
          perPage: 10,
          sortInfo: 'this is sort info',
          sorting: this.sorting,
          getData: function() {
            return self.getPagedDataAsync();
          }
        });
        if (this.autoload) {
          return this.tableParams.initialize();
        }
      }
    ];
  }
]);

"use strict";
angular.module('sh.button.state', []).service("ShButtonState", [
  '$timeout', function($timeout) {
    this.initializeEvent = function($event, defaultValue) {
      defaultValue = (typeof defaultValue === "undefined" ? null : defaultValue);
      return (typeof $event === "undefined" ? defaultValue : $event);
    };
    this.setEnable = function($event, enabled) {
      var btn, target;
      if ($event != null) {
        target = $($event.target);
        target.prop('disabled', !enabled);
        if (target.is('form')) {
          btn = target.find('button[type="submit"]');
          return btn.prop('disabled', !enabled);
        } else if (target.is('a')) {
          if (enabled) {
            return target.removeClass('disabled');
          } else {
            return target.addClass('disabled');
          }
        } else if (target.is('span')) {
          target = target.parent();
          if (enabled) {
            return target.removeClass('disabled');
          } else {
            return target.addClass('disabled');
          }
        }
      }
    };
    this.disable = function($event) {
      return this.setEnable($event, false);
    };
    this.loading = function($event) {
      return this.disable($event);
    };
    this.enable = function($event) {
      return this.setEnable($event, true);
    };
    return this;
  }
]);

"use strict";
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
      return opts.afterAdd.call(this);
    };
    this.removeOldestToast = function() {
      return this.removeToast(this.toasts.length - 1);
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
      return $timeout(function() {
        toasts.splice(opts.index, 1);
        return opts.afterRemove.call(this);
      }, opts.duration + 1);
    };
    this.runInterval = function(self) {
      return $interval(function() {
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
      return opts.afterAdd.call(this);
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
      return $timeout(function() {
        notifications.splice(opts.index, 1);
        return opts.afterRemove.call(this);
      }, opts.duration);
    };
    this.toastByResponse = function(response, defaultToast) {
      var j, k, len, len1, n, ref, ref1, results, results1;
      if (response.notification) {
        ref = response.notification.notifications;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          n = ref[j];
          results.push((function(_this) {
            return function(n) {
              return _this.addToast({
                type: n.type,
                data: response,
                message: n.message,
                field: n.field
              });
            };
          })(this)(n));
        }
        return results;
      } else if (response.data && response.data.error) {
        ref1 = response.data.error.errors;
        results1 = [];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          n = ref1[k];
          results1.push((function(_this) {
            return function(n) {
              return _this.addToast({
                type: 'danger',
                data: response,
                message: n.message,
                field: n.field
              });
            };
          })(this)(n));
        }
        return results1;
      } else if (defaultToast) {
        return this.addToast({
          type: defaultToast.type,
          data: response,
          message: defaultToast.message,
          field: defaultToast.field
        });
      } else {
        return this.addToast({
          type: 'danger',
          data: response,
          message: response.data
        });
      }
    };
    this.runInterval(this);
    return this;
  }
]);

"use strict";
angular.module("sh.page.service", []).service("ShPageService", [
  '$window', function($window) {
    var _appName, _pageTitle;
    _pageTitle = '';
    _appName = '';
    this.setPageTitle = function(pageTitle) {
      _pageTitle = pageTitle;
      $window.document.title = this.getAppName() + ' - ' + this.getPageTitle();
      return this.getPageTitle();
    };
    this.getPageTitle = function() {
      return _pageTitle;
    };
    this.setAppName = function(appName) {
      _appName = appName;
      $window.document.title = this.getAppName() + ' - ' + this.getPageTitle();
      return this.getAppName();
    };
    this.getAppName = function() {
      return _appName;
    };
    return this;
  }
]);

"use strict";
angular.module("sh.priv", []).service("ShPriv", function() {
  this.can = function(privileges, ability) {
    return privileges.indexOf(ability) !== -1;
  };
  return this;
});

"use strict";
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
      return spinningStates[key] = true;
    } else {
      return this.stop(key);
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
    return delete spinningStates[key];
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
  return this;
});

"use strict";
shHelperModule.service("shElementFinder", function() {
  this.findById = function(source, id) {
    var obj;
    obj = void 0;
    return obj = source.filter(function(obj) {
      return +obj.id === +id;
    });
  };
  this.findFirstById = function(source, id) {
    var obj;
    obj = void 0;
    obj = source.filter(function(obj) {
      return +obj.id === +id;
    })[0];
    if (obj != null) {
      return obj;
    } else {
      return obj = {};
    }
  };
  this.findByField = function(source, value) {
    var obj;
    obj = void 0;
    return obj = source.filter(function(obj) {
      return obj.field === value;
    });
  };
  this.findByElmt = function(source, elmt) {
    var obj;
    obj = void 0;
    return obj = source.filter(function(obj) {
      return +obj === +elmt;
    });
  };
  return this;
});

"use strict";
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
        return collections.push(obj);
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
        return collections.splice(idx, 1);
      }
    };
    this.clearRowSelection = function(collections) {
      return collections.splice(0);
    };
    this.rowToggle = function(obj, collections, key) {
      if (this.isRowSelected(obj, collections, key)) {
        return this.rowDeselect(obj, collections, key);
      } else {
        return this.rowSelect(obj, collections, key);
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
    return this;
  }
]);

'use strict';
angular.module('starqle.ng.util', ['on.root.scope', 'sh.bootstrap', 'sh.collapsible', 'sh.datepicker', 'sh.dialog', 'sh.focus', 'sh.number.format', 'sh.segment', 'sh.submit', 'sh.view.helper', 'auth.token.handler', 'sh.filter.collection', 'sh.floating.precision', 'sh.remove.duplicates', 'sh.strip.html', 'sh.strip.to.newline', 'sh.truncate', 'sh.bulk.helper', 'sh.init.ng.table', 'sh.modal.persistence', 'sh.persistence', 'sh.api.module', 'sh.form.module', 'sh.helper.module', 'sh.persistence.module', 'sh.spinning.module', 'sh.table.module', 'sh.button.state', 'sh.notification', 'sh.page.service', 'sh.priv']);
