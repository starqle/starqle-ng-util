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
        shFromDate: '=',
        shThruDate: '=',
        widgetVerticalPosition: '@?'
      },
      require: '?ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        var initiation;
        initiation = true;
        element.datetimepicker({
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
          var date;
          date = ngModelCtrl.$viewValue;
          if (angular.isDefined(date) && date !== null) {
            element.data('DateTimePicker').date(moment(date, 'YYYY-MM-DD'));
          }
          return ngModelCtrl.$viewValue;
        };
        ngModelCtrl.$parsers.push(function(data) {
          return moment(data, 'DD-MM-YYYY').format('YYYY-MM-DD');
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
        scope.$watch('shFromDate', function(newVal, oldVal) {
          if (newVal) {
            newVal = newVal || -Infinity;
            return element.data('DateTimePicker').minDate(moment(newVal));
          }
        });
        return scope.$watch('shThruDate', function(newVal, oldVal) {
          if (newVal) {
            if ((scope.shFromDate != null) && newVal < scope.shFromDate) {
              newVal = scope.shFromDate;
            }
            element.data('DateTimePicker').maxDate(moment(newVal));
          }
          if (oldVal && !newVal) {
            return element.data('DateTimePicker').maxDate(false);
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
        shFromTime: '=',
        shThruTime: '=',
        widgetVerticalPosition: '@?'
      },
      require: '?ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        var initiation;
        initiation = true;
        element.datetimepicker({
          showClose: true,
          showClear: true,
          useCurrent: false,
          showTodayButton: true,
          format: 'DD-MM-YYYY, HH:mm',
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
          var date;
          date = ngModelCtrl.$viewValue;
          if (angular.isDefined(date) && date !== null) {
            element.data('DateTimePicker').date(moment(date, 'x'));
          }
          return ngModelCtrl.$viewValue;
        };
        ngModelCtrl.$parsers.push(function(data) {
          return moment(data, 'DD-MM-YYYY, HH:mm').format('x');
        });
        element.bind('dp.change', function(data) {
          if (initiation) {
            ngModelCtrl.$pristine = false;
          }
          if (data.date) {
            ngModelCtrl.$setViewValue(data.date.format('DD-MM-YYYY, HH:mm'));
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
        scope.$watch('shFromTime', function(newVal, oldVal) {
          if (newVal) {
            newVal = newVal || -Infinity;
            return element.data('DateTimePicker').minDate(moment(newVal * 1));
          }
        });
        return scope.$watch('shThruTime', function(newVal, oldVal) {
          if (newVal) {
            if ((scope.shFromTime != null) && newVal < scope.shFromTime) {
              newVal = scope.shFromTime;
            }
            element.data('DateTimePicker').maxDate(moment(newVal * 1));
          }
          if (oldVal && !newVal) {
            return element.data('DateTimePicker').maxDate(false);
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
          var outerHeight, paddingBottom, paddingLeft, paddingRight, paddingTop, parent, reduction;
          parent = $(elmt).parent();
          paddingTop = parent.css('padding-top');
          paddingLeft = parent.css('padding-left');
          paddingRight = parent.css('padding-right');
          paddingBottom = parent.css('padding-bottom');
          outerHeight = parent.outerHeight();
          reduction = 2;
          if (parent.parents('.table-nested').length) {
            reduction = 6;
          }
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
        $(window).on('resize', function() {
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
angular.module('sh.spinning', []).directive("shSpinning", [
  'ShSpinningService', function(ShSpinningService) {
    return {
      restrict: 'A',
      scope: {
        shSpinning: '@',
        shSpinningLines: '@?',
        shSpinningLength: '@?',
        shSpinningWidth: '@?',
        shSpinningRadius: '@?',
        shSpinningCorners: '@?',
        shSpinningRotate: '@?',
        shSpinningDirection: '@?',
        shSpinningColor: '@?',
        shSpinningSpeed: '@?',
        shSpinningTrail: '@?',
        shSpinningShadow: '@?',
        shSpinningHwaccel: '@?',
        shSpinningClassName: '@?',
        shSpinningZIndex: '@?',
        shSpinningTop: '@?',
        shSpinningLeft: '@?'
      },
      link: function(scope, element, attrs) {
        var opts;
        scope.shSpinningLines = +scope.shSpinningLines || 13;
        scope.shSpinningLength = +scope.shSpinningLength || 30;
        scope.shSpinningWidth = +scope.shSpinningWidth || 10;
        scope.shSpinningRadius = +scope.shSpinningRadius || 38;
        scope.shSpinningCorners = +scope.shSpinningCorners || 1;
        scope.shSpinningRotate = +scope.shSpinningRotate || 0;
        scope.shSpinningDirection = +scope.shSpinningDirection || 1;
        scope.shSpinningColor = scope.shSpinningColor || '#000';
        scope.shSpinningSpeed = +scope.shSpinningSpeed || 2.2;
        scope.shSpinningTrail = +scope.shSpinningTrail || 100;
        scope.shSpinningShadow = scope.shSpinningShadow || false;
        scope.shSpinningHwaccel = scope.shSpinningHwaccel || false;
        scope.shSpinningClassName = scope.shSpinningClassName || 'spinner';
        scope.shSpinningZIndex = +scope.shSpinningZIndex || 2e9;
        scope.shSpinningTop = scope.shSpinningTop || '45%';
        scope.shSpinningLeft = scope.shSpinningLeft || '50%';
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
          return ShSpinningService.isSpinning(scope.shSpinning);
        }), function(newVal) {
          if (ShSpinningService.isSpinning(scope.shSpinning)) {
            scope.spinner.spin(element[0]);
          } else {
            scope.spinner.stop();
          }
        });
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
          var entityForm, entityFormName;
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
              return $scope[entityFormName].$setPristine();
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
angular.module('sh.ng.table.filter', []).run([
  '$rootScope', '$filter', function($rootScope, $filter) {
    return $rootScope.ngTableFilter = [
      '$scope', function($scope) {
        var dateParams, numberParams;
        $scope.filterParams = {};
        $scope.filterRegion = {
          visible: true
        };
        dateParams = {};
        $scope.filterLabel = {};
        $scope.prepareFilterDate = function(navbarFilter) {
          dateParams = {};
          delete $scope.filterParams[navbarFilter + "_eqdate"];
          delete $scope.filterParams[navbarFilter + "_lteqdate"];
          return delete $scope.filterParams[navbarFilter + "_gteqdate"];
        };
        $scope.executeFilterDate = function() {
          angular.extend($scope.filterParams, dateParams);
          $scope.tableParamsGetData.params.$params.page = 1;
          return $scope.refreshGrid();
        };
        $scope.filterDateAny = function(navbarFilter) {
          $scope.prepareFilterDate(navbarFilter);
          return $scope.executeFilterDate();
        };
        $scope.filterDateToday = function(navbarFilter) {
          $scope.prepareFilterDate(navbarFilter);
          dateParams[navbarFilter + "_eqdate"] = moment().format('YYYY-MM-DD');
          return $scope.executeFilterDate();
        };
        $scope.filterDatePastNDays = function(navbarFilter, n) {
          $scope.prepareFilterDate(navbarFilter);
          dateParams[navbarFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
          dateParams[navbarFilter + "_gteqdate"] = moment().subtract('days', n).format('YYYY-MM-DD');
          return $scope.executeFilterDate();
        };
        $scope.filterDatePastNWeeks = function(navbarFilter, n) {
          $scope.prepareFilterDate(navbarFilter);
          dateParams[navbarFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
          dateParams[navbarFilter + "_gteqdate"] = moment().subtract('weeks', n).format('YYYY-MM-DD');
          return $scope.executeFilterDate();
        };
        $scope.filterDatePastNMonths = function(navbarFilter, n) {
          $scope.prepareFilterDate(navbarFilter);
          dateParams[navbarFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
          dateParams[navbarFilter + "_gteqdate"] = moment().subtract('months', n).format('YYYY-MM-DD');
          return $scope.executeFilterDate();
        };
        $scope.filterDatePastNYears = function(navbarFilter, n) {
          $scope.prepareFilterDate(navbarFilter);
          dateParams[navbarFilter + "_lteqdate"] = moment().format('YYYY-MM-DD');
          dateParams[navbarFilter + "_gteqdate"] = moment().subtract('years', n).format('YYYY-MM-DD');
          return $scope.executeFilterDate();
        };
        $scope.filterDateRange = function(navbarFilter) {
          var fromDate, thruDate;
          fromDate = $scope.filterParams[navbarFilter + "_gteqdate"];
          thruDate = $scope.filterParams[navbarFilter + "_lteqdate"];
          $scope.prepareFilterDate(navbarFilter);
          $scope.filterLabel[navbarFilter] = fromDate + ' - ' + thruDate;
          dateParams[navbarFilter + "_gteqdate"] = fromDate;
          dateParams[navbarFilter + "_lteqdate"] = thruDate;
          $scope.executeFilterDate();
          angular.element("#date-filter-" + navbarFilter + "-modal").modal('hide');
        };
        $scope.openDateFilterModal = function(navbarFilter) {
          angular.element("#date-filter-" + navbarFilter + "-modal").modal('show');
        };
        numberParams = {};
        $scope.prepareFilterNumber = function(navbarFilter) {
          numberParams = {};
          delete $scope.filterParams[navbarFilter + "_eq"];
          delete $scope.filterParams[navbarFilter + "_tleq"];
          return delete $scope.filterParams[navbarFilter + "_gteq"];
        };
        $scope.executeFilterNumber = function() {
          angular.extend($scope.filterParams, numberParams);
          $scope.tableParamsGetData.params.$params.page = 1;
          return $scope.refreshGrid();
        };
        $scope.filterNumberAny = function(navbarFilter) {
          $scope.prepareFilterNumber(navbarFilter);
          return $scope.executeFilterNumber();
        };
        $scope.filterNumberRange = function(navbarFilter, leftNumber, rightNumber) {
          var fromNumber, thruNumber;
          if (leftNumber) {
            $scope.prepareFilterNumber(navbarFilter);
            numberParams[navbarFilter + "_tleq"] = rightNumber;
            numberParams[navbarFilter + "_gteq"] = leftNumber;
            return $scope.executeFilterNumber();
          } else {
            fromNumber = $scope.filterParams[navbarFilter + "_gteq"];
            thruNumber = $scope.filterParams[navbarFilter + "_tleq"];
            $scope.prepareFilterDate(navbarFilter);
            $scope.filterLabel[navbarFilter] = $filter('number')(parseInt(fromNumber), 0) + ' - ' + $filter('number')(parseInt(thruNumber), 0);
            dateParams[navbarFilter + "_gteq"] = fromNumber;
            dateParams[navbarFilter + "_tleq"] = thruNumber;
            $scope.executeFilterDate();
            angular.element("#number-filter-" + navbarFilter + "-modal").modal('hide');
          }
        };
        $scope.openNumberFilterModal = function(navbarFilter) {
          angular.element("#number-filter-" + navbarFilter + "-modal").modal('show');
        };
        $scope.filterTextCont = function(navbarFilter) {
          $scope.tableParamsGetData.params.$params.page = 1;
          return $scope.refreshGrid();
        };
        $scope.toggleFilterRegion = function() {
          return $scope.filterRegion.visible = !$scope.filterRegion.visible;
        };
        $scope.resetFilter = function() {
          $scope.filterParams = {};
          return $scope.refreshGrid();
        };
        $scope.isNoFilter = function() {
          return angular.equals($scope.filterParams, {});
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
angular.module("sh.element.finder", []).service("shElementFinder", function() {
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
angular.module('sh.notification', []).service("ShNotification", [
  '$timeout', '$interval', function($timeout, $interval) {
    var defaultDuration, defaultLifetime;
    defaultLifetime = 4000;
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
angular.module('sh.spinning.service', []).service("ShSpinningService", function() {
  var spinningStates;
  spinningStates = {};
  this.spin = function(key) {
    return spinningStates[key] = true;
  };
  this.stop = function(key) {
    return delete spinningStates[key];
  };
  this.isSpinning = function(key) {
    return spinningStates[key] === true;
  };
  return this;
});

'use strict';
angular.module('starqle.ng.util', ['on.root.scope', 'sh.bootstrap', 'sh.collapsible', 'sh.datepicker', 'sh.dialog', 'sh.focus', 'sh.number.format', 'sh.segment', 'sh.spinning', 'sh.submit', 'sh.view.helper', 'auth.token.handler', 'sh.filter.collection', 'sh.floating.precision', 'sh.remove.duplicates', 'sh.strip.html', 'sh.strip.to.newline', 'sh.truncate', 'sh.bulk.helper', 'sh.init.ng.table', 'sh.modal.persistence', 'sh.ng.table.filter', 'sh.persistence', 'sh.button.state', 'sh.element.finder', 'sh.notification', 'sh.page.service', 'sh.priv', 'sh.spinning.service']);
