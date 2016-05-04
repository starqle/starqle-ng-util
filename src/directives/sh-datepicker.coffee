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
        valueFormatted = moment(value, displayFormat).format(valueFormat)
        if isValid(valueFormatted)
          updateDate(valueFormatted)
          valueFormatted
        else
          updateDate(null)
          ngModelCtrl.$setViewValue(null)
          value = null
          undefined
      else
        value = null
        undefined

    ngModelCtrl.$parsers.push parser

    #
    #
    #
    isValid = (value) ->
      if element.data('DateTimePicker')?.maxDate()? and element.data('DateTimePicker')?.maxDate()
        maxValue = element.data('DateTimePicker').maxDate().format(valueFormat)
        return false if moment(value).isAfter(maxValue)

      if element.data('DateTimePicker')?.minDate()? and element.data('DateTimePicker')?.minDate()
        minValue = element.data('DateTimePicker').minDate().format(valueFormat)
        return false if moment(value).isBefore(minValue)

      return true

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
        if element.data('DateTimePicker')?.maxDate()? and element.data('DateTimePicker')?.maxDate()
          maxValue = element.data('DateTimePicker').maxDate().format(valueFormat)
          value = maxValue if moment(value).isAfter(maxValue)

        element.data('DateTimePicker')?.minDate(moment(value))
      else
        element.data('DateTimePicker')?.minDate(false)
      return


    updateMaxDate = (value)  ->
      if value?
        if element.data('DateTimePicker')?.minDate()? and element.data('DateTimePicker')?.minDate()
          minValue = element.data('DateTimePicker').minDate().format(valueFormat)
          value = minValue if moment(value).isBefore(minValue)

        element.data('DateTimePicker')?.maxDate(new Date(value))
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
        unless (isNaN(value) and moment(value, moment.ISO_8601).isValid())
          # should be millisecond from epoch
          value *= 1

        moment(value).tz(moment.defaultZone.name).format(displayFormat)
      else
        null

    ngModelCtrl.$formatters.push formatter


    #
    # ngModelCtrl: Parser
    #
    parser = (value) ->
      if moment.tz(value, displayFormat, moment.defaultZone.name).isValid()
        valueFormatted = moment.tz(value, displayFormat, moment.defaultZone.name).format(valueFormat)
        if isValid(valueFormatted)
          updateDate(valueFormatted)
          valueFormatted
        else
          updateDate(null)
          ngModelCtrl.$setViewValue(null)
          value = null
          undefined


      else
        value = null
        undefined

    ngModelCtrl.$parsers.push parser

    #
    #
    #
    isValid = (value) ->
      if element.data('DateTimePicker')?.maxDate()? and element.data('DateTimePicker')?.maxDate()
        maxValue = element.data('DateTimePicker').maxDate().valueOf()
        return false if maxValue < value

      if element.data('DateTimePicker')?.minDate()? and element.data('DateTimePicker')?.minDate()
        minValue = element.data('DateTimePicker').minDate().valueOf()
        return false if minValue > value

      return true


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
        useCurrent: false
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
        unless (isNaN(value) and moment(value, moment.ISO_8601).isValid())
          # should be millisecond from epoch
          value *= 1
        element.data('DateTimePicker').date(moment(value).tz(moment.defaultZone.name))
      else
        element.data('DateTimePicker').clear()

      return


    updateMinDate = (value)  ->
      if value?
        unless (isNaN(value) and moment(value, moment.ISO_8601).isValid())
          # should be millisecond from epoch
          value *= 1

        if element.data('DateTimePicker')?.maxDate()? and element.data('DateTimePicker')?.maxDate()
          maxValue = element.data('DateTimePicker').maxDate().valueOf()
          value = maxValue if maxValue < value

        element.data('DateTimePicker')?.minDate(moment(value).tz(moment.defaultZone.name))
      else
        element.data('DateTimePicker')?.minDate(false)
      return


    updateMaxDate = (value)  ->
      if value?
        unless (isNaN(value) and moment(value, moment.ISO_8601).isValid())
          # should be millisecond from epoch
          value *= 1

        if element.data('DateTimePicker')?.minDate()? and element.data('DateTimePicker')?.minDate()
          minValue = element.data('DateTimePicker').minDate().valueOf()
          value = minValue if minValue > value

        element.data('DateTimePicker')?.maxDate(moment(value).tz(moment.defaultZone.name))
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



shDatepickerModule.directive("shDatetime", [ ->
  restrict: 'A'
  scope:
    shDatetime: '='
    shDatetimeFormat: '@?'
    shDateFormat: '@?'
  template:
    '<span title="{{getFormattedShDatetime()}}">{{getFormattedShDatetime()}}</span>'
  link: (scope, element, attrs) ->
    scope.getFormattedShDatetime = ->
      if scope.shDatetime?
        if moment(scope.shDatetime, 'YYYY-MM-DD', true).isValid()
          # Date
          shDateFormat = scope.shDateFormat ? 'DD-MM-YYYY'
          moment(scope.shDatetime).format(shDateFormat)
        else
          # TODO
          # Time or Millisecond (Assumption only)
          shDatetimeFormat = scope.shDatetimeFormat ? 'DD MMM YYYY, HH:mm (z)'
          moment(scope.shDatetime).tz(moment.defaultZone.name).format(shDatetimeFormat)
      else
        '-'

    return

])



shDatepickerModule.directive("shTimepicker", [ ->
  restrict: 'A'
  scope:
    shTimepicker: '='
  template:
    '''
    <select name="duration-hour" ng-model="duration.hour" ng-options="n as n for n in ([] | shRange:0:24)" class="form-control">
      <option value="0">0</option>
    </select>&colon;
    <select name="duration-minute" ng-model="duration.minute" ng-options="n as n for n in ([] | shRange:0:60:5)" class="form-control">
      <option value="0">0</option>
    </select>
    '''
  require: '?ngModel'
  link: (scope, element, attrs, ngModelCtrl) ->

    scope.duration =
      hour: Math.floor(scope.shTimepicker / (60 * 60))
      minute: scope.shTimepicker % (60 * 60)

    #
    # ngModelCtrl: Formatter
    #
    formatter = (value) ->
      if value?
        scope.duration.hour = Math.floor(value / (60 * 60))
        scope.duration.minute = Math.floor(value / 60) % 60
      else
        scope.duration.hour = 0
        scope.duration.minute = 5

      value

    ngModelCtrl.$formatters.push formatter


    scope.$watchCollection(
      'duration'
      (newVal, oldVal) ->
        if newVal?
          ngModelCtrl.$setViewValue((scope.duration.hour * 60 * 60) + (scope.duration.minute * 60))
        return
    )


    return

])
