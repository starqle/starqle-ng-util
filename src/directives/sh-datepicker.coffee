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

).directive("shDatepicker", [ ->
  #
  #
  #
  restrict: 'A'
  scope:
    shStartDate: '='
    shEndDate:  '='
  require: '?ngModel'
  link: ($scope, $element, $attrs, ngModelCtrl) ->
    #
    # SETUP
    #
    $element.datetimepicker(
      showClear: true
      showTodayButton: true
      format: 'DD-MM-YYYY'
      icons:
        time: 'fa fa-clock-o'
        date: 'fa fa-calendar'
        up: 'fa fa-chevron-up'
        down: 'fa fa-chevron-down'
        previous: 'fa fa-chevron-left'
        next: 'fa fa-chevron-right'
        today: 'fa fa-crosshairs'
        clear: 'fa fa-trash'
        close: 'fa fa-times'
    )

    #
    # ngModelCtrl
    #
    ngModelCtrl.$render = ->
      date = ngModelCtrl.$viewValue
      if angular.isDefined(date) and date != null
        $element.data('DateTimePicker').date moment(date, 'YYYY-MM-DD')
      ngModelCtrl.$viewValue

    ngModelCtrl.$parsers.push (data) ->
      moment(data, 'DD-MM-YYYY').format('YYYY-MM-DD')

    #
    # BINDING
    #
    $element.bind 'dp.change', (data) ->
      ngModelCtrl.$setViewValue(data.date.format('DD-MM-YYYY'))

    #
    # WATCHERS
    #
    $scope.$watch 'shStartDate', (newVal, oldVal) ->
      if newVal
        newVal = newVal || -Infinity
        $element.data('DateTimePicker').minDate(moment(newVal))

    $scope.$watch 'shEndDate', (newVal, oldVal) ->
      if newVal
        newVal = newVal || 0
        $element.data('DateTimePicker').maxDate(moment(newVal))


]).directive("shDatetimepicker", ['dateFilter', (dateFilter) ->
  #
  #
  #
  restrict: 'A'
  scope:
    shStartDate: '='
    shEndDate:  '='
  require: '?ngModel'
  link: ($scope, $element, $attrs, ngModelCtrl) ->
    #
    # SETUP
    #
    $element.datetimepicker
      showClose: true
      showClear: true
      showTodayButton: true
      format: 'DD-MM-YYYY, HH:mm'
      icons:
        time: 'fa fa-clock-o'
        date: 'fa fa-calendar'
        up: 'fa fa-chevron-up'
        down: 'fa fa-chevron-down'
        previous: 'fa fa-chevron-left'
        next: 'fa fa-chevron-right'
        today: 'fa fa-crosshairs'
        clear: 'fa fa-trash'
        close: 'fa fa-times'

    #
    # ngModelCtrl
    #
    ngModelCtrl.$render = ->
      date = ngModelCtrl.$viewValue
      if angular.isDefined(date) and date != null
        $element.data('DateTimePicker').date moment(date, 'x')
      ngModelCtrl.$viewValue

    ngModelCtrl.$parsers.push (data) ->
      moment(data, 'DD-MM-YYYY, HH:mm').format('x')

    #
    # BINDING
    #
    $element.bind 'dp.change', (data) ->
      if data.date
        ngModelCtrl.$setViewValue(data.date.format('DD-MM-YYYY, HH:mm'))

    #
    # WATCHERS
    #
    $scope.$watch 'shStartDate', (newVal, oldVal) ->
      if newVal
        newVal = newVal || -Infinity
        $element.data('DateTimePicker').minDate(moment(newVal))

    $scope.$watch 'shEndDate', (newVal, oldVal) ->
      if newVal
        newVal = newVal || 0
        $element.data('DateTimePicker').maxDate(moment(newVal))
])
