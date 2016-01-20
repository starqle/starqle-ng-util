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


angular.module('sh.datepicker', []

).directive("shDatepicker", [ ->
  #
  #
  #
  restrict: 'A'
  scope:
    shFromDate: '=?'
    shThruDate: '=?'
    shTimezone: '@'
    widgetVerticalPosition: '@?'
  require: '?ngModel'
  link: (scope, element, attrs, ngModelCtrl) ->
    initiation = true

    #
    # SETUP
    #
    element.datetimepicker(
      timeZone: scope.shTimezone
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
        element.data('DateTimePicker')?.date moment(date, 'YYYY-MM-DD')
      ngModelCtrl.$viewValue

    ngModelCtrl.$parsers.push (data) ->
      if moment(data, 'DD-MM-YYYY').isValid()
        moment(data, 'DD-MM-YYYY').format('YYYY-MM-DD')
      else
        data = null
        undefined

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


    element.bind 'dp.hide', (data) ->
      unless moment(ngModelCtrl.$viewValue, 'DD-MM-YYYY').isValid()
        ngModelCtrl.$setViewValue(null)
        element.data('DateTimePicker')?.date(null)

    #
    # WATCHERS
    #
    scope.$watch 'shFromDate', (newVal, oldVal) ->
      if newVal?
        if moment(new Date(newVal)).isValid()
          element.data('DateTimePicker')?.minDate(moment(new Date(newVal)))
      else
        element.data('DateTimePicker')?.minDate(false)

    scope.$watch 'shThruDate', (newVal, oldVal) ->
      if newVal?
        if moment(new Date(newVal)).isValid()
          element.data('DateTimePicker')?.maxDate(moment(new Date(newVal)))
      else
        element.data('DateTimePicker')?.maxDate(false)


]).directive("shDatetimepicker", ['dateFilter', (dateFilter) ->
  #
  #
  #
  restrict: 'A'
  scope:
    shFromTime: '=?'
    shThruTime: '=?'
    shTimezone: '@'
    widgetVerticalPosition: '@?'
  require: '?ngModel'
  link: (scope, element, attrs, ngModelCtrl) ->
    initiation = true

    #
    # SETUP
    #
    element.datetimepicker
      timeZone: scope.shTimezone
      showClose: true
      showClear: true
      useCurrent: false
      showTodayButton: false
      format: 'DD-MM-YYYY, HH:mm (z)'
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
        element.data('DateTimePicker')?.date moment.tz(moment(+date).format(), scope.shTimezone)

    ngModelCtrl.$parsers.push (data) ->
      if moment.tz(data, 'DD-MM-YYYY, HH:mm', scope.shTimezone).isValid()
        moment.tz(data, 'DD-MM-YYYY, HH:mm', scope.shTimezone).format('x')
      else
        undefined
    #
    # BINDING
    #
    element.bind 'dp.change', (data) ->
      ngModelCtrl.$pristine = false if initiation

      if data.date
        ngModelCtrl.$setViewValue(data.date.tz(scope.shTimezone).format('DD-MM-YYYY, HH:mm (z)'))
      else
        ngModelCtrl.$setViewValue(null)

      ngModelCtrl.$pristine = true if initiation
      initiation = false


    element.bind 'dp.show', (data) ->
      initiation = false if initiation

    element.bind 'dp.hide', (data) ->
      unless moment(ngModelCtrl.$viewValue, 'DD-MM-YYYY, HH:mm (z)').isValid()
        ngModelCtrl.$setViewValue(null)
        element.data('DateTimePicker')?.date(null)
    #
    #
    # WATCHERS
    #
    scope.$watch 'shFromTime', (newVal, oldVal) ->
      if newVal?
        element.data('DateTimePicker')?.minDate(moment.tz(newVal * 1, scope.shTimezone))
      else
        element.data('DateTimePicker')?.minDate(false)

    scope.$watch 'shThruTime', (newVal, oldVal) ->
      if newVal?
        element.data('DateTimePicker')?.maxDate(moment.tz(newVal * 1, scope.shTimezone))
      else
        element.data('DateTimePicker')?.maxDate(false)

    scope.$watch 'shTimezone', (newVal, oldVal) ->
      if newVal?
        date = ngModelCtrl.$modelValue
        if angular.isDefined(date) and date != null
          element.data('DateTimePicker')?.date moment.tz(moment(+date).format(), scope.shTimezone)
])
