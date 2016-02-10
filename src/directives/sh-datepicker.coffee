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


shDatepickerModule.directive("shDatepicker", [ ->
  #
  #
  #
  restrict: 'A'
  scope:
    shDisplayFormat: '@?'
    shFromDate: '=?'
    shIcons: '=?'
    shThruDate: '=?'
    widgetVerticalPosition: '@?'
  require: '?ngModel'
  link: (scope, element, attrs, ngModelCtrl) ->

    valueFormat = 'YYYY-MM-DD' # millisecond from epoch
    displayFormat = scope.shDisplayFormat ? 'DD-MM-YYYY'


    #
    # ngModelCtrl: Formatter
    #
    formatter = (value) ->
      if value?
        moment(value).format(displayFormat)
      else
        null

    ngModelCtrl.$formatters.push formatter


    #
    # ngModelCtrl: Parser
    #
    parser = (value) ->
      if moment(value, displayFormat).isValid()
        moment(value, displayFormat).format(valueFormat)
      else
        value = null
        undefined

    ngModelCtrl.$parsers.push parser


    #
    # SETUP
    #
    setupDatepicker = (value) ->
      element.unbind 'dp.change', dpChange
      element.data('DateTimePicker')?.destroy()

      element.datetimepicker
        format: displayFormat
        showClear: true
        showClose: true
        showTodayButton: false
        useCurrent: false
        useStrict: true
        widgetPositioning:
          vertical: scope.widgetVerticalPosition or 'auto'

      updateDate(value)
      updateIcon(scope.shIcons)
      updateMinDate(scope.shFromDate)
      updateMaxDate(scope.shThruDate)

      element.bind 'dp.change', dpChange

      return


    updateDate = (value) ->
      if value?
        element.data('DateTimePicker').date(moment(value))
      else
        element.data('DateTimePicker').clear()
      return


    updateMinDate = (value)  ->
      if value?
        element.data('DateTimePicker')?.minDate(moment(value))
      else
        element.data('DateTimePicker')?.minDate(false)
      return


    updateMaxDate = (value)  ->
      if value?
        element.data('DateTimePicker')?.maxDate(moment(value))
      else
        element.data('DateTimePicker')?.maxDate(false)
      return


    updateIcon = (obj) ->
      element.data('DateTimePicker').icons(obj) if obj?
      return


    #
    # BINDING
    #

    dpChange = (data) ->
      if data.date
        ngModelCtrl.$setViewValue(data.date.format(displayFormat))
      else
        ngModelCtrl.$setViewValue(null)
      return


    #
    # WATCHERS
    #
    scope.$watch 'shFromDate', (newVal, oldVal) ->
      updateMinDate(newVal)
      return

    scope.$watch 'shThruDate', (newVal, oldVal) ->
      updateMaxDate(newVal)
      return

    #
    # INITIALIZATION
    #
    scope.$watch(
      () ->
        moment.defaultZone.name
      (newVal, oldVal) ->
        if newVal?
          setupDatepicker(ngModelCtrl.$modelValue)
        return
    )


    return

])



shDatepickerModule.directive("shDatetimepicker", ['dateFilter', (dateFilter) ->
  #
  #
  #
  restrict: 'A'
  scope:
    shDisplayFormat: '@?'
    shFromTime: '=?'
    shIcons: '=?'
    shThruTime: '=?'
    widgetVerticalPosition: '@?'
  require: '?ngModel'
  link: (scope, element, attrs, ngModelCtrl) ->

    valueFormat = 'x' # millisecond from epoch
    displayFormat = scope.shDisplayFormat ? 'DD-MM-YYYY, HH:mm (z)'


    #
    # ngModelCtrl: Formatter
    #
    formatter = (value) ->
      if value?
        moment(value * 1).tz(moment.defaultZone.name).format(displayFormat)
      else
        null

    ngModelCtrl.$formatters.push formatter


    #
    # ngModelCtrl: Parser
    #
    parser = (value) ->
      if moment.tz(value, displayFormat, moment.defaultZone.name).isValid()
        moment.tz(value, displayFormat, moment.defaultZone.name).format(valueFormat)
      else
        value = null
        undefined

    ngModelCtrl.$parsers.push parser


    #
    # SETUP
    #
    setupDatepicker = (value) ->
      element.unbind 'dp.change', dpChange
      element.data('DateTimePicker')?.destroy()

      element.datetimepicker
        format: displayFormat
        showClear: true
        showClose: true
        showTodayButton: false
        timeZone: moment.defaultZone.name
        useStrict: true
        widgetPositioning:
          vertical: scope.widgetVerticalPosition or 'auto'

      updateDate(value)
      updateIcon(scope.shIcons)
      updateMinDate(scope.shFromTime)
      updateMaxDate(scope.shThruTime)

      element.bind 'dp.change', dpChange

      return


    updateDate = (value) ->
      if value?
        element.data('DateTimePicker').date(moment(value * 1).tz(moment.defaultZone.name))
      else
        element.data('DateTimePicker').clear()

      return


    updateMinDate = (value)  ->
      if value?
        element.data('DateTimePicker')?.minDate(moment(value * 1).tz(moment.defaultZone.name))
      else
        element.data('DateTimePicker')?.minDate(false)
      return


    updateMaxDate = (value)  ->
      if value?
        element.data('DateTimePicker')?.maxDate(moment(value * 1).tz(moment.defaultZone.name))
      else
        element.data('DateTimePicker')?.maxDate(false)
      return


    updateIcon = (obj) ->
      element.data('DateTimePicker').icons(obj) if obj?
      return


    #
    # BINDING
    #

    dpChange = (data) ->
      if data.date
        ngModelCtrl.$setViewValue(data.date.tz(moment.defaultZone.name).format(displayFormat))
      else
        ngModelCtrl.$setViewValue(null)
      return


    #
    # WATCHERS
    #
    scope.$watch 'shFromTime', (newVal, oldVal) ->
      updateMinDate(newVal)
      return

    scope.$watch 'shThruTime', (newVal, oldVal) ->
      updateMaxDate(newVal)
      return

    scope.$watch(
      () ->
        moment.defaultZone.name
      (newVal, oldVal) ->
        if newVal?
          setupDatepicker(ngModelCtrl.$modelValue)
        return
    )


    return

])
