# =============================================================================
# Copyright (c) 2013 All Right Reserved, http://starqle.com/
#
# This source is subject to the Starqle Permissive License.
# Please see the License.txt file for more information.
# All other rights reserved.
#
# THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
# KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
# PARTICULAR PURPOSE.
#
# @file_name src/directives/sh-datepicker.coffee
# @author Bimo Horizon
# @email bimo@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shDatepicker directive
# =============================================================================

"use strict"

angular.module('sh.datepicker', []

).directive("shDatepicker", ['dateFilter', (dateFilter) ->
  #
  #
  #
  restrict: 'A'
  scope:
    shStartDate: '='
    shEndDate:  '='
  require: '?ngModel'
  link: ($scope, $element, $attrs, ngModelCtrl) ->
    datepickerOptions =
      format: 'dd-mm-yyyy'
      autoclose: true
      todayBtn: 'linked'
      todayHighlight: true
      weekStart: 1

    # Initialize datepicker
    init = ->
      $element.datepicker(datepickerOptions)

    ngModelCtrl.$formatters.push (data) ->
      dateFilter data, 'dd-MM-yyyy'

    ngModelCtrl.$parsers.push (data) ->
      moment(data, 'DD-MM-YYYY').format('YYYY-MM-DD')

    init()

    # When i18n language is changed
    $scope.$watch 'shStartDate', (newVal, oldVal) ->
      if newVal
        newVal = newVal || -Infinity
        $element.datepicker('setStartDate', dateFilter(newVal, 'dd-MM-yyyy'))

    $scope.$watch 'shEndDate', (newVal, oldVal) ->
      if newVal
        newVal = newVal || 0
        $element.datepicker('setEndDate', dateFilter(newVal, 'dd-MM-yyyy'))



]).directive("shMillisecondDatepicker", ['dateFilter', (dateFilter) ->
  #
  #
  #
  restrict: 'A'
  scope:
    shStartDate: '='
    shEndDate:  '='
  require: '?ngModel'
  link: ($scope, $element, $attrs, ngModelCtrl) ->
    datepickerOptions =
      format: 'dd-mm-yyyy'
      autoclose: true
      todayBtn: 'linked'
      todayHighlight: true
      weekStart: 1

    # Initialize datepicker
    init = ->
      $element.datepicker(datepickerOptions)

    ngModelCtrl.$formatters.push (data) ->
      dateFilter data, 'dd-MM-yyyy'

    ngModelCtrl.$parsers.push (data) ->
      moment(data, 'DD-MM-YYYY').valueOf()

    init()

    # When i18n language is changed
    $scope.$watch 'shStartDate', (newVal, oldVal) ->
      if newVal
        newVal = newVal || -Infinity
        $element.datepicker('setStartDate', newVal)

    $scope.$watch 'shEndDate', (newVal, oldVal) ->
      if newVal
        newVal = newVal || 0
        $element.datepicker('setEndDate', newVal)
])
