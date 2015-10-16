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
    shFromDate: '='
    shThruDate:  '='
    widgetVerticalPosition: '@?'
  require: '?ngModel'
  link: (scope, element, attrs, ngModelCtrl) ->
    initiation = true

    #
    # SETUP
    #
    element.datetimepicker(
      showClear: true
      showTodayButton: true
      useCurrent: false
      format: 'DD-MM-YYYY'
      widgetPositioning:
        vertical: scope.widgetVerticalPosition or 'auto'
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
        element.data('DateTimePicker').date moment(date, 'YYYY-MM-DD')
      ngModelCtrl.$viewValue

    ngModelCtrl.$parsers.push (data) ->
      moment(data, 'DD-MM-YYYY').format('YYYY-MM-DD')

    #
    # BINDING
    #
    element.bind 'dp.change', (data) ->
      ngModelCtrl.$pristine = false if initiation

      if data.date
        ngModelCtrl.$setViewValue(data.date.format('DD-MM-YYYY'))
      else
        ngModelCtrl.$setViewValue(null)

      ngModelCtrl.$pristine = true if initiation
      initiation = false

    element.bind 'dp.show', (data) ->
      initiation = false if initiation
    #
    # WATCHERS
    #
    scope.$watch 'shFromDate', (newVal, oldVal) ->
      if newVal
        newVal = newVal || -Infinity
        element.data('DateTimePicker').minDate(moment(newVal))

    scope.$watch 'shThruDate', (newVal, oldVal) ->
      if newVal
        newVal = scope.shFromDate if scope.shFromDate? and newVal < scope.shFromDate
        element.data('DateTimePicker').maxDate(moment(newVal))

      if oldVal and not newVal
        element.data('DateTimePicker').maxDate(false)


]).directive("shDatetimepicker", ['dateFilter', (dateFilter) ->
  #
  #
  #
  restrict: 'A'
  scope:
    shFromTime: '='
    shThruTime:  '='
    widgetVerticalPosition: '@?'
  require: '?ngModel'
  link: (scope, element, attrs, ngModelCtrl) ->
    initiation = true

    #
    # SETUP
    #
    element.datetimepicker
      showClose: true
      showClear: true
      useCurrent: false
      showTodayButton: true
      format: 'DD-MM-YYYY, HH:mm'
      widgetPositioning:
        vertical: scope.widgetVerticalPosition or 'auto'
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
        element.data('DateTimePicker').date moment(date, 'x')
      ngModelCtrl.$viewValue

    ngModelCtrl.$parsers.push (data) ->
      moment(data, 'DD-MM-YYYY, HH:mm').format('x')

    #
    # BINDING
    #
    element.bind 'dp.change', (data) ->
      ngModelCtrl.$pristine = false if initiation

      if data.date
        ngModelCtrl.$setViewValue(data.date.format('DD-MM-YYYY, HH:mm'))
      else
        ngModelCtrl.$setViewValue(null)

      ngModelCtrl.$pristine = true if initiation
      initiation = false

    element.bind 'dp.show', (data) ->
      initiation = false if initiation

    #
    #
    # WATCHERS
    #
    scope.$watch 'shFromTime', (newVal, oldVal) ->
      if newVal
        newVal = newVal || -Infinity
        element.data('DateTimePicker').minDate(moment(newVal * 1))

    scope.$watch 'shThruTime', (newVal, oldVal) ->
      if newVal
        newVal = scope.shFromTime if scope.shFromTime? and newVal < scope.shFromTime
        element.data('DateTimePicker').maxDate(moment(newVal * 1))

      if oldVal and not newVal
        element.data('DateTimePicker').maxDate(false)
])
