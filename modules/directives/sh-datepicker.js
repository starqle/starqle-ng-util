// ============================================================================
// Copyright (c) 2013 All Right Reserved, http://starqle.com/
//
// This source is subject to the Starqle Permissive License.
// Please see the License.txt file for more information.
// All other rights reserved.
//
// THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
// KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// @file_name modules/directives/sh-datepicker.js
// @author Bimo Horizon
// @email bimo@starqle.com
// @company PT. Starqle Indonesia
// @note This file contains shDatepicker directive
// ============================================================================

angular.module("sh.datepicker", []).directive("shDatepicker", [
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
