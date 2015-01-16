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
    scope: {},
    controller: function($scope, $element) {
      this.shCollapse = false;
      this.bodyElements = [];
      this.toggleCollapse = function() {
        var bodyElement, _i, _j, _len, _len1, _ref, _ref1;
        this.shCollapse = !this.shCollapse;
        if (this.isCollapse()) {
          _ref = this.bodyElements;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            bodyElement = _ref[_i];
            bodyElement.slideUp('fast');
            $element.addClass('is-collapse');
          }
        } else {
          _ref1 = this.bodyElements;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            bodyElement = _ref1[_j];
            bodyElement.slideDown('fast');
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
  'dateFilter', function(dateFilter) {
    return {
      restrict: 'A',
      scope: {
        shStartDate: '=',
        shEndDate: '='
      },
      require: '?ngModel',
      link: function($scope, $element, $attrs, ngModel) {
        var datepickerOptions, init, onChangeDateEvent, onShowEvent;
        datepickerOptions = {
          format: 'dd-mm-yyyy',
          autoclose: true,
          todayBtn: 'linked',
          todayHighlight: true,
          weekStart: 1
        };
        onChangeDateEvent = function(event) {
          ngModel.$setViewValue(event.date);
          return $($element).datepicker("update");
        };
        onShowEvent = function() {
          $attrs.value = $attrs.value || '';
          if ($attrs.value !== dateFilter($element.datepicker('getDate'), 'dd-MM-yyyy')) {
            return $element.datepicker('setDate', $attrs.value);
          }
        };
        init = function() {
          return $element.datepicker(datepickerOptions).on('changeDate', onChangeDateEvent).on('show', onShowEvent);
        };
        init();
        ngModel.$formatters.push(function(data) {
          return dateFilter(data, 'dd-MM-yyyy');
        });
        $scope.$watch('shStartDate', function(newVal, oldVal) {
          newVal = newVal || -Infinity;
          return $element.datepicker('setStartDate', newVal);
        });
        return $scope.$watch('shEndDate', function(newVal, oldVal) {
          newVal = newVal || 0;
          return $element.datepicker('setEndDate', newVal);
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
        scope.shSpinningLines = scope.shSpinningLines || 13;
        scope.shSpinningLength = scope.shSpinningLength || 30;
        scope.shSpinningWidth = scope.shSpinningWidth || 10;
        scope.shSpinningRadius = scope.shSpinningRadius || 38;
        scope.shSpinningCorners = scope.shSpinningCorners || 1;
        scope.shSpinningRotate = scope.shSpinningRotate || 0;
        scope.shSpinningDirection = scope.shSpinningDirection || 1;
        scope.shSpinningColor = scope.shSpinningColor || '#000';
        scope.shSpinningSpeed = scope.shSpinningSpeed || 2.2;
        scope.shSpinningTrail = scope.shSpinningTrail || 100;
        scope.shSpinningShadow = scope.shSpinningShadow || false;
        scope.shSpinningHwaccel = scope.shSpinningHwaccel || false;
        scope.shSpinningClassName = scope.shSpinningClassName || 'spinner';
        scope.shSpinningZIndex = scope.shSpinningZIndex || 2e9;
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
        var shSubmitInvalid, shSubmitOverlay;
        shSubmitOverlay = angular.element('<span class="sh-submit-overlay" ng-mouseover="overlayHover()" ng-mouseleave="overlayLeave()"></span>');
        $compile(shSubmitOverlay)(scope);
        shSubmitInvalid = attrs.shSubmitInvalid || 'Please correct/fill out the highlighted fields';
        if (element.next('.sh-submit-overlay').length === 0 && element.parents('.sh-submit-overlay').length === 0) {
          shSubmitOverlay.insertAfter(element);
          shSubmitOverlay.tooltip({
            title: shSubmitInvalid
          });
          element.appendTo(shSubmitOverlay);
        }
        scope.overlayHover = function() {
          var form;
          if (scope["" + attrs.shSubmit].$invalid) {
            form = element.parents('form').eq(0);
            if (form.length > 0) {
              form.addClass('sh-highlight-required');
            } else {
              angular.elemet("form[name='" + attrs.shSubmit + "']").addClass('sh-highlight-required');
            }
          }
        };
        return scope.$watch("" + attrs.shSubmit + ".$invalid", function(newValue, oldValue) {
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
            auth_token: authTokenHandler.getAuthToken()
          }), data, success, error);
        };
      } else {
        return resource[action] = function(params, success, error) {
          return resource["_" + action](angular.extend({}, params || {}, {
            username: authTokenHandler.getUsername(),
            auth_token: authTokenHandler.getAuthToken()
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
      var aggregateItems, item, key, newArray, newCollection, newItem, value, _i, _len;
      if (collection) {
        newArray = [];
        newCollection = {};
        aggregateItems = {};
        for (_i = 0, _len = collection.length; _i < _len; _i++) {
          item = collection[_i];
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
          var activeItems, i, _i, _len, _ref, _results;
          if (items instanceof Array) {
            activeItems = $scope.activeItems(items);
            _ref = activeItems.filter(function(item) {
              return !!item.$selected;
            });
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              i = _ref[_i];
              _results.push(i.id);
            }
            return _results;
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
        $scope.refreshGrid = function(currentPage) {
          if (currentPage == null) {
            currentPage = null;
          }
          if (currentPage === null) {
            currentPage = $scope.pagingOptions.currentPage;
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
              $defer = $scope.tableParamsGetData.defer;
              params = $scope.tableParamsGetData.params;
              gridParams = $scope.generateGridParams();
              return $scope.resource.get($.extend(gridParams, $scope.optParams)).$promise.then(function(success) {
                params.total(success.data.total_server_items);
                $defer.resolve(success.data.items);
                $scope.tableParams.reload();
                if (($scope.getPagedDataAsyncSuccess != null) && typeof $scope.getPagedDataAsyncSuccess === 'function') {
                  $scope.getPagedDataAsyncSuccess(success);
                }
                $scope.asyncBlock = false;
              }, function(error) {
                return $scope.asyncBlock = false;
              });
            }), 100);
          }
        };
        $scope.getProcessedColumnDefs = function(columnDefs) {
          var columnDef, processedColumnDefs, _i, _len;
          processedColumnDefs = [];
          for (_i = 0, _len = columnDefs.length; _i < _len; _i++) {
            columnDef = columnDefs[_i];
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
            return 'sort-asc';
          } else if ($scope.tableParams.isSortBy(fieldName, 'desc')) {
            return 'sort-desc';
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
              auth_token: $rootScope.authToken
            });
            elementId = 'xls' + moment();
            xlsFullpath = "" + $scope.xlsPath + "?" + ($.param(gridParams));
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
        if ($scope.refreshGrid == null) {
          $scope.refreshGrid = function(currentPage) {
            if (currentPage == null) {
              currentPage = null;
            }
            if (currentPage === null) {
              currentPage = $scope.pagingOptions.currentPage;
            }
            return $scope.getPagedDataAsync();
          };
        }
        $scope.toggleSelection = function(obj, arr) {
          var idx;
          idx = arr.indexOf(obj);
          if (idx > -1) {
            return arr.splice(idx, 1);
          } else {
            return arr.push(obj);
          }
        };
        $scope.beforeNewEntity = function() {};
        $scope.newEntitySuccess = function(response) {};
        $scope.newEntitySuccessNotification = function(response) {};
        $scope.newEntityFailure = function(response) {};
        $scope.newEntityFailureNotification = function(response) {};
        $scope.beforeCreateEntity = function() {};
        $scope.createEntitySuccess = function(response) {};
        $scope.createEntitySuccessNotification = function(response) {
          return ShNotification.toastByResponse(response, {
            type: 'success',
            message: 'Successfully Created'
          });
        };
        $scope.createEntityFailure = function(response) {};
        $scope.createEntityFailureNotification = function(response) {
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
        $scope.beforeEditEntity = function() {};
        $scope.editEntitySuccess = function(response) {};
        $scope.editEntitySuccessNotification = function(response) {};
        $scope.editEntityFailure = function(response) {};
        $scope.editEntityFailureNotification = function(response) {};
        $scope.beforeUpdateEntity = function() {};
        $scope.updateEntitySuccess = function(response) {};
        $scope.updateEntitySuccessNotification = function(response) {
          return ShNotification.toastByResponse(response, {
            type: 'success',
            message: 'Successfully Updated'
          });
        };
        $scope.updateEntityFailure = function(response) {};
        $scope.updateEntityFailureNotification = function(response) {
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
        $scope.beforeDestroyEntity = function() {};
        $scope.destroyEntitySuccess = function(response) {};
        $scope.destroyEntitySuccessNotification = function(response) {
          return ShNotification.toastByResponse(response, {
            type: 'success',
            message: 'Successfully Deleted'
          });
        };
        $scope.destroyEntityFailure = function(response) {};
        $scope.destroyEntityFailureNotification = function(response) {
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
          $scope.beforeCreateEntity();
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
            $scope.createEntitySuccess(success);
            return $scope.createEntitySuccessNotification(success);
          }, function(error) {
            $scope.errors = error.data.error.errors;
            ShButtonState.enable($event);
            $scope.createEntityFailure(error);
            return $scope.createEntityFailureNotification(error);
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
          $scope.beforeEditEntity();
          return $scope.resource.edit($.extend({
            id: id
          }, $scope.optParams)).$promise.then(function(success) {
            $rootScope.spinningService.stop('modal');
            $scope.entity = success.data;
            $scope.localLookup = success.lookup;
            $scope.modalProperties.visible = true;
            $scope.editEntitySuccess(success);
            return $scope.editEntitySuccessNotification(success);
          }, function(error) {
            $rootScope.spinningService.stop('modal');
            $scope.editEntityFailure(error);
            return $scope.editEntityFailureNotification(error);
          });
        };
        $scope.closeEditEntityModal = function(elementStr, id) {
          angular.element("#" + elementStr).modal('hide');
          $scope.resetEntityModal(elementStr);
          return $scope.afterCloseEntityModal(elementStr, id);
        };
        $scope.updateEntity = function(elementStr, $event) {
          $scope.beforeUpdateEntity();
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
            $scope.updateEntitySuccess(success);
            return $scope.updateEntitySuccessNotification(success);
          }, function(error) {
            $scope.errors = error.data.error.errors;
            ShButtonState.enable($event);
            $scope.updateEntityFailure(error);
            return $scope.updateEntityFailureNotification(error);
          });
        };
        $scope.destroyEntity = function(id, name, $event) {
          if (name == null) {
            name = 'this entry';
          }
          $event = ShButtonState.initializeEvent($event);
          ShButtonState.loading($event);
          $scope.beforeDestroyEntity();
          return $scope.resource["delete"]($.extend({
            id: id
          }, $scope.optParams)).$promise.then(function(success) {
            if ($scope.recentlyDeletedIds != null) {
              $scope.recentlyDeletedIds.push(success.data.id);
            }
            if (typeof $scope.getPagedDataAsync === 'function') {
              $scope.refreshGrid();
            }
            $scope.destroyEntitySuccess(success);
            return $scope.destroyEntitySuccessNotification(success);
          }, function(error) {
            $scope.destroyEntityFailure(error);
            $scope.destroyEntityFailureNotification(error);
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
        $scope.toggleSelection = function(obj, arr) {
          var idx;
          idx = arr.indexOf(obj);
          if (idx > -1) {
            return arr.splice(idx, 1);
          } else {
            return arr.push(obj);
          }
        };
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
        $scope.beforeCreateEntity = function() {};
        $scope.createEntitySuccess = function(response) {};
        $scope.createEntitySuccessNotification = function(response) {
          return ShNotification.toastByResponse(response, {
            type: 'success',
            message: 'Successfully Created'
          });
        };
        $scope.createEntityFailure = function(response) {};
        $scope.createEntityFailureNotification = function(response) {
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
        $scope.beforeUpdateEntity = function() {};
        $scope.updateEntitySuccess = function(response) {};
        $scope.updateEntitySuccessNotification = function(response) {
          return ShNotification.toastByResponse(response, {
            type: 'success',
            message: 'Successfully Updated'
          });
        };
        $scope.updateEntityFailure = function(response) {};
        $scope.updateEntityFailureNotification = function(response) {
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
          $scope.beforeCreateEntity();
          $event = ShButtonState.initializeEvent($event);
          ShButtonState.loading($event);
          return $scope.resource.save($.extend({}, $scope.optParams), {
            data: $scope.entity
          }).$promise.then(function(success) {
            var params;
            params = {};
            params['id'] = success.data.id;
            $state.transitionTo($scope.showPath, params);
            $scope.createEntitySuccess(success);
            $scope.createEntitySuccessNotification(success);
            return ShButtonState.enable($event);
          }, function(error) {
            $scope.createEntityFailure(error);
            $scope.createEntityFailureNotification(error);
            return ShButtonState.enable($event);
          });
        };
        $scope.updateEntity = function($event) {
          $scope.beforeUpdateEntity();
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
            $scope.updateEntitySuccess(success);
            $scope.updateEntitySuccessNotification(success);
            return ShButtonState.enable($event);
          }, function(error) {
            $scope.updateEntityFailure(error);
            $scope.updateEntityFailureNotification(error);
            return ShButtonState.enable($event);
          });
        };
        $scope.init = function() {
          if ($scope.id === void 0) {
            $scope.beforeNewEntity();
            return $scope.resource["new"]({}).$promise.then(function(success) {
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
        var i, toast, _i, _len, _ref, _results;
        _ref = self.toasts;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          toast = _ref[i];
          if (toast.alive && toast.deathtime < Date.now()) {
            toast.alive = false;
            _results.push(self.removeToast(i, 1));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
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
      var n, _i, _len, _ref, _results;
      if (response.notification) {
        _ref = response.notification.notifications;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          _results.push((function(_this) {
            return function(n) {
              return _this.addToast({
                type: n.type,
                message: n.message
              });
            };
          })(this)(n));
        }
        return _results;
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
angular.module('starqle.ng.util', ['on.root.scope', 'sh.collapsible', 'sh.datepicker', 'sh.dialog', 'sh.focus', 'sh.number.format', 'sh.spinning', 'sh.submit', 'sh.tooltip', 'auth.token.handler', 'sh.filter.collection', 'sh.floating.precision', 'sh.remove.duplicates', 'sh.strip.html', 'sh.strip.to.newline', 'sh.truncate', 'sh.bulk.helper', 'sh.init.ng.table', 'sh.modal.persistence', 'sh.ng.table.filter', 'sh.persistence', 'sh.button.state', 'sh.element.finder', 'sh.notification', 'sh.page.service', 'sh.priv', 'sh.spinning.service']);
