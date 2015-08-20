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
        shStartDate: '=',
        shEndDate: '='
      },
      require: '?ngModel',
      link: function($scope, $element, $attrs, ngModelCtrl) {
        var initiation;
        initiation = true;
        $element.datetimepicker({
          showClear: true,
          showTodayButton: true,
          useCurrent: false,
          format: 'DD-MM-YYYY',
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
            $element.data('DateTimePicker').date(moment(date, 'YYYY-MM-DD'));
          }
          return ngModelCtrl.$viewValue;
        };
        ngModelCtrl.$parsers.push(function(data) {
          return moment(data, 'DD-MM-YYYY').format('YYYY-MM-DD');
        });
        $element.bind('dp.change', function(data) {
          if (initiation) {
            ngModelCtrl.$pristine = false;
          }
          ngModelCtrl.$setViewValue(data.date.format('DD-MM-YYYY'));
          if (initiation) {
            ngModelCtrl.$pristine = true;
          }
          return initiation = false;
        });
        $element.bind('dp.show', function(data) {
          if (initiation) {
            return initiation = false;
          }
        });
        $scope.$watch('shStartDate', function(newVal, oldVal) {
          if (newVal) {
            newVal = newVal || -Infinity;
            return $element.data('DateTimePicker').minDate(moment(newVal));
          }
        });
        return $scope.$watch('shEndDate', function(newVal, oldVal) {
          if (newVal) {
            newVal = newVal || 0;
            return $element.data('DateTimePicker').maxDate(moment(newVal));
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
        shStartDate: '=',
        shEndDate: '='
      },
      require: '?ngModel',
      link: function($scope, $element, $attrs, ngModelCtrl) {
        var initiation;
        initiation = true;
        $element.datetimepicker({
          showClose: true,
          showClear: true,
          useCurrent: false,
          showTodayButton: true,
          format: 'DD-MM-YYYY, HH:mm',
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
            $element.data('DateTimePicker').date(moment(date, 'x'));
          }
          return ngModelCtrl.$viewValue;
        };
        ngModelCtrl.$parsers.push(function(data) {
          return moment(data, 'DD-MM-YYYY, HH:mm').format('x');
        });
        $element.bind('dp.change', function(data) {
          if (data.date) {
            if (initiation) {
              ngModelCtrl.$pristine = false;
            }
            ngModelCtrl.$setViewValue(data.date.format('DD-MM-YYYY, HH:mm'));
            if (initiation) {
              ngModelCtrl.$pristine = true;
            }
            return initiation = false;
          }
        });
        $element.bind('dp.show', function(data) {
          if (initiation) {
            return initiation = false;
          }
        });
        $scope.$watch('shStartDate', function(newVal, oldVal) {
          if (newVal) {
            newVal = newVal || -Infinity;
            return $element.data('DateTimePicker').minDate(moment(newVal));
          }
        });
        return $scope.$watch('shEndDate', function(newVal, oldVal) {
          if (newVal) {
            newVal = newVal || 0;
            return $element.data('DateTimePicker').maxDate(moment(newVal));
          }
        });
      }
    };
  }
]);

"use strict";
angular.module('sh.dialog', []).directive("shDialog", [
  '$compile', function($compile) {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        shDialogOk: '&',
        shDialogCancel: '&?',
        shDialogContent: '@?',
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
          var shDialogModal;
          if (!(scope.getShDialogModal().length > 0)) {
            shDialogModal = angular.element('<div id="modal-sh-dialog" tabindex="-1" role="dialog" aria-labelledby="modalShDialogLabel" aria-hidden="true" class="modal">\n  <div class="modal-dialog modal-sm">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;</button>\n        <div class="modal-title">&nbsp;</div>\n      </div>\n      <div class="modal-body">\n        <div class="row">\n          <div class="col-lg-12">{{getShDialogContent()}}</div>\n        </div>\n      </div>\n      <div class="modal-footer">\n        <button ng-click="onHandleModalOkClick()" class="btn btn-primary">OK</button>\n        <button data-dismiss="modal" class="btn btn-default">Cancel</button>\n      </div>\n    </div>\n  </div>\n</div>');
            $compile(shDialogModal)(scope);
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
        shMin: '@',
        shMax: '@',
        ngModel: '='
      },
      require: '?ngModel',
      link: function(scope, element, attributes, ngModel) {
        element.popover({
          trigger: 'focus',
          placement: 'top'
        });
        ngModel.$formatters.push(function(value) {
          return $filter('number')(parseInt(value), 0);
        });
        ngModel.$parsers.push(function(value) {
          var number;
          number = String(value).replace('/\./g', '');
          number = parseInt(number);
          if (!number) {
            return 0;
          }
          if ((scope.shMin != null) && number < parseInt(scope.shMin)) {
            return parseInt(scope.shMin);
          } else if ((scope.shMax != null) && number > parseInt(scope.shMax)) {
            return parseInt(scope.shMax);
          }
          return number;
        });
        scope.applyValidity = function() {
          var valid;
          if (attributes.required) {
            valid = scope.ngModel && +scope.ngModel > 0;
            if (scope.shMin) {
              valid = valid && +scope.ngModel >= scope.shMin;
            }
            if (scope.shMax) {
              valid = valid && +scope.ngModel <= scope.shMax;
            }
            return ngModel.$setValidity('required', valid);
          }
        };
        scope.applyValidity();
        element.on('focusout', function() {
          ngModel.$viewValue = String($filter('number')(ngModel.$modelValue || 0, 0));
          return ngModel.$render();
        });
        element.on('focusin', function() {
          ngModel.$viewValue = String(ngModel.$modelValue || 0);
          ngModel.$render();
          return element.select();
        });
        element.on('keyup', function() {
          element.siblings('.popover').find('.popover-content').html(element.attr('data-content'));
          return scope.applyValidity();
        });
        return scope.$watch('ngModel', function(newValue, oldValue) {
          return scope.applyValidity();
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
}).directive("tableScrollHead", function() {
  return {
    restrict: 'C',
    link: function(scope, elem, attrs) {
      scope.__scrollHeadHeight = 0;
      scope.$watch(function() {
        return scope.__scrollHeadHeight = elem.outerHeight();
      });
      scope.$watch('__scrollHeadHeight', function(newVal, oldVal) {
        return elem.next().css('top', newVal + 'px');
      });
      return $(window).resize(function() {
        return scope.$apply(function() {
          return scope.__scrollHeadHeight = elem.outerHeight();
        });
      });
    }
  };
}).directive("tableScrollFoot", function() {
  return {
    restrict: 'C',
    link: function(scope, elem, attrs) {
      scope.__scrollFootHeight = 0;
      scope.$watch(function() {
        return scope.__scrollFootHeight = elem.outerHeight();
      });
      scope.$watch('__scrollFootHeight', function(newVal, oldVal) {
        return elem.prev().css('bottom', newVal + 'px');
      });
      return $(window).resize(function() {
        return scope.$apply(function() {
          return scope.__scrollFootHeight = elem.outerHeight();
        });
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
      scope.$watch('height', function(newVal, oldVal) {
        return elem.next().css('top', newVal + 'px');
      });
      return $(window).resize(function() {
        return scope.$apply(function() {
          return scope.height = elem.outerHeight();
        });
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
      scope.$watch('height', function(newVal, oldVal) {
        return elem.prev().css('bottom', newVal + 'px');
      });
      return $(window).resize(function() {
        return scope.$apply(function() {
          return scope.height = elem.outerHeight();
        });
      });
    }
  };
});

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

"use strict";
angular.module('sh.tooltip', []).directive("shTooltip", function() {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      $(element).tooltip({
        title: attrs.shTooltip,
        placement: "top",
        html: true
      });
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
          newCollection[item[fieldName]] = $.extend({}, item);
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
            $.extend(gridParams.filter_params, $scope.filterParams);
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
              return $scope.resource.get($.extend(gridParams, $scope.optParams)).$promise.then(function(success) {
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
        $scope.exportToXls = function() {
          var $defer, elementId, gridParams, params, xlsFullpath;
          if ($scope.xlsPath) {
            $defer = $scope.tableParamsGetData.defer;
            params = $scope.tableParamsGetData.params;
            gridParams = $scope.generateGridParams();
            $.extend(gridParams, $scope.optParams);
            $.extend(gridParams, {
              username: $rootScope.currentUser.username,
              authn_token: $rootScope.authToken
            });
            elementId = 'xls' + moment();
            xlsFullpath = $scope.xlsPath + "?" + ($.param(gridParams));
            $('body').append("<iframe id='" + elementId + "' style='display: none;' src='" + xlsFullpath + "'></iframe>");
            $("#" + elementId).load(function() {
              return setTimeout(function() {
                return $("#" + elementId).remove();
              }, 50);
            });
          }
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
      '$scope', '$timeout', 'ShNotification', 'ShButtonState', function($scope, $timeout, ShNotification, ShButtonState) {
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
          $rootScope.spinningService.spin('modal');
          $scope.beforeNewEntity();
          return $scope.resource["new"]($.extend({}, $scope.optParams)).$promise.then(function(success) {
            $rootScope.spinningService.stop('modal');
            $scope.entity = success.data;
            $scope.localLookup = success.lookup;
            $scope.modalProperties.visible = true;
            $scope.newEntitySuccess(success);
            return $scope.newEntitySuccessNotification(success);
          }, function(error) {
            $rootScope.spinningService.stop('modal');
            $scope.newEntityFailure(error);
            return $scope.newEntityFailureNotification(error);
          });
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
          return $scope.resource.save($.extend({}, $scope.optParams), {
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
          $rootScope.spinningService.spin('modal');
          $scope.beforeEditEntity(id);
          return $scope.resource.edit($.extend({
            id: id
          }, $scope.optParams)).$promise.then(function(success) {
            $rootScope.spinningService.stop('modal');
            $scope.entity = success.data;
            $scope.localLookup = success.lookup;
            $scope.modalProperties.visible = true;
            $scope.editEntitySuccess(success, id);
            return $scope.editEntitySuccessNotification(success, id);
          }, function(error) {
            $rootScope.spinningService.stop('modal');
            $scope.editEntityFailure(error, id);
            return $scope.editEntityFailureNotification(error, id);
          });
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
          return $scope.resource.update($.extend({
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
        $scope.destroyEntity = function(id, name, $event) {
          if (name == null) {
            name = 'this entry';
          }
          $event = ShButtonState.initializeEvent($event);
          ShButtonState.loading($event);
          $scope.beforeDestroyEntity($event);
          return $scope.resource["delete"]($.extend({
            id: id
          }, $scope.optParams)).$promise.then(function(success) {
            if ($scope.recentlyDeletedIds != null) {
              $scope.recentlyDeletedIds.push(success.data.id);
            }
            if (typeof $scope.getPagedDataAsync === 'function') {
              $scope.refreshGrid();
            }
            $scope.destroyEntitySuccess(success, $event);
            return $scope.destroyEntitySuccessNotification(success, $event);
          }, function(error) {
            $scope.destroyEntityFailure(error, $event);
            $scope.destroyEntityFailureNotification(error, $event);
            return ShButtonState.enable($event);
          });
        };
        $scope.deleteEntity = function(id, name, $event) {
          if (name == null) {
            name = 'this entry';
          }
          return $scope.destroyEntity(id, name, $event);
        };
        $scope.multipleDestroyEntity = function(ids, name) {
          if (name == null) {
            name = 'these entries';
          }
          $scope.beforeMultipleDestroyEntity();
          return $scope.resource.multiple_delete($.extend({
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
          $.extend($scope.filterParams, dateParams);
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
          $.extend($scope.filterParams, numberParams);
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
          return $.isEmptyObject($scope.filterParams);
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
          return $scope.resource.save($.extend({}, $scope.optParams), {
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
          return $scope.resource.update($.extend({
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
            return $scope.resource.edit($.extend({
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
        var i, j, len, ref, results, toast;
        ref = self.toasts;
        results = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          toast = ref[i];
          if (toast.alive && toast.deathtime < Date.now()) {
            toast.alive = false;
            results.push(self.removeToast(i, 1));
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
      var j, len, n, ref, results;
      if (response.notification) {
        ref = response.notification.notifications;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          n = ref[j];
          results.push((function(_this) {
            return function(n) {
              return _this.addToast({
                type: n.type,
                message: n.message
              });
            };
          })(this)(n));
        }
        return results;
      } else {
        return this.addToast(defaultToast);
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
angular.module('starqle.ng.util', ['on.root.scope', 'sh.collapsible', 'sh.datepicker', 'sh.dialog', 'sh.focus', 'sh.number.format', 'sh.spinning', 'sh.submit', 'sh.segment', 'sh.tooltip', 'auth.token.handler', 'sh.filter.collection', 'sh.floating.precision', 'sh.remove.duplicates', 'sh.strip.html', 'sh.strip.to.newline', 'sh.truncate', 'sh.bulk.helper', 'sh.init.ng.table', 'sh.modal.persistence', 'sh.ng.table.filter', 'sh.persistence', 'sh.button.state', 'sh.element.finder', 'sh.notification', 'sh.page.service', 'sh.priv', 'sh.spinning.service']);
