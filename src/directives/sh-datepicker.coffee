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

    lastValid = null
    changedFromPicker = false
    initial = true

    #
    # ngModelCtrl: Formatter
    #
    formatter = (modelValue) ->
      if isValidValueFormat(modelValue)
        moment(modelValue).format(displayFormat)
      else
        null

    ngModelCtrl.$formatters.push formatter


    #
    # ngModelCtrl: Parser
    #
    parser = (viewValue) ->
      if isValidDisplayFormat(viewValue)
        if isRangeValid(viewValue)
          moment(viewValue, displayFormat).format(valueFormat)
        else
          null
      else
        viewValue

    looseParser = (viewValue) ->
      if isValidDisplayFormat(viewValue)
        moment(viewValue, displayFormat).format(valueFormat)
      else
        null

    ngModelCtrl.$parsers.push parser


    #
    #
    #
    isRangeValid = (value) ->
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
    setupDatepicker = (modelValue) ->
      newValue = modelValue
      newValue = lastValid unless isValidValueFormat(modelValue)

      unless changedFromPicker
        element.unbind 'dp.change', dpChange
        element.unbind 'dp.show', dpShow
        element.unbind 'dp.hide', dpHide
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


        element.data('DateTimePicker').date(moment(newValue))
        if ngModelCtrl.$dirty and not initial
          ngModelCtrl.$setViewValue(newValue)


        updateIcon(scope.shIcons)
        updateMinDate(scope.shFromDate)
        updateMaxDate(scope.shThruDate)

        element.bind 'dp.change', dpChange
        element.bind 'dp.show', dpShow
        element.bind 'dp.hide', dpHide

      changedFromPicker = false
      initial = false
      return


    updateMinDate = (value)  ->
      if value and isValidValueFormat(value)
        if element.data('DateTimePicker')?.maxDate()? and element.data('DateTimePicker')?.maxDate()
          maxValue = looseParser(element.data('DateTimePicker').maxDate())
          value = maxValue if moment(value).isAfter(maxValue)

        element.data('DateTimePicker')?.minDate(moment(value).startOf('day'))
      else
        element.data('DateTimePicker')?.minDate(false)
      return


    updateMaxDate = (value)  ->
      if value and isValidValueFormat(value)
        if element.data('DateTimePicker')?.minDate()? and element.data('DateTimePicker')?.minDate()
          minValue = looseParser(element.data('DateTimePicker').minDate())
          value = minValue if moment(value).isBefore(minValue)

        element.data('DateTimePicker')?.maxDate(moment(value).endOf('day'))
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
      changedFromPicker = true
      if data.date
        ngModelCtrl.$setViewValue(data.date.format(displayFormat))
      else
        ngModelCtrl.$setViewValue(null)
      return


    dpShow = () ->
      setLastValid(ngModelCtrl.$modelValue)
      return

    dpHide = (data) ->
      if isValidDisplayFormat( ngModelCtrl.$viewValue )
        unless ngModelCtrl.$viewValue is data.date.format(displayFormat)
          setupDatepicker(ngModelCtrl.$modelValue)
      else
        if ngModelCtrl.$viewValue is null
          setLastValid(null)
          setupDatepicker(null)
        else
          setupDatepicker(lastValid)
      return


    isValidValueFormat = (modelValue) ->
      moment(modelValue, valueFormat, true).isValid()

    isValidDisplayFormat = (viewValue) ->
      moment(viewValue, displayFormat, true).isValid()


    setLastValid = (value) ->
      if value and isValidValueFormat(value)
        lastValid = value
      else
        lastValid = null






    #
    # WATCHERS
    #
    scope.$watch 'shFromDate', (newVal, oldVal) ->
      updateMinDate(newVal)
      return

    scope.$watch 'shThruDate', (newVal, oldVal) ->
      updateMaxDate(newVal)
      return

    scope.$watch(
      () ->
        moment.defaultZone.name
      (newVal, oldVal) ->
        if newVal? and newVal isnt oldVal
          setupDatepicker(ngModelCtrl.$modelValue)
        return
    )

    scope.$watch(
      () ->
        ngModelCtrl.$modelValue
      (newVal, oldVal) ->
        if newVal? and isValidValueFormat(newVal) and isValidDisplayFormat(ngModelCtrl.$viewValue)
          if (not oldVal?) or ( oldVal? and isValidValueFormat(oldVal) )
            setupDatepicker(newVal)
        return
    )

    setupDatepicker(null)


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

    lastValid = null
    changedFromPicker = false
    initial = true

    #
    # ngModelCtrl: Formatter
    #
    formatter = (modelValue) ->
      if modelValue and isValidValueFormat(modelValue)
        modelValue *= 1 unless isNaN(modelValue)
        moment(modelValue).tz(moment.defaultZone.name).format(displayFormat) + ''
      else
        null

    ngModelCtrl.$formatters.push formatter


    #
    # ngModelCtrl: Parser
    #
    parser = (viewValue) ->
      if isValidDisplayFormat(viewValue)
        if isRangeValid(viewValue)
          moment.tz(viewValue, displayFormat, moment.defaultZone.name).format(valueFormat)
        else
          null
      else
        viewValue

    looseParser = (viewValue) ->
      if isValidDisplayFormat(viewValue)
        moment.tz(viewValue, displayFormat, moment.defaultZone.name).format(valueFormat)
      else
        null

    ngModelCtrl.$parsers.push parser


    #
    #
    #
    isRangeValid = (value) ->
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
    setupDatepicker = (modelValue) ->
      newValue = modelValue
      newValue = lastValid unless isValidValueFormat(modelValue)

      unless changedFromPicker
        element.unbind 'dp.change', dpChange
        element.unbind 'dp.show', dpShow
        element.unbind 'dp.hide', dpHide
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


        if newValue
          newValue *= 1 unless isNaN(newValue)
          element.data('DateTimePicker').date( moment(newValue).tz(moment.defaultZone.name) )
        else
          element.data('DateTimePicker').date( null )

        if ngModelCtrl.$dirty and not initial
          ngModelCtrl.$setViewValue(newValue + '')


        updateIcon(scope.shIcons)
        updateMinDate(scope.shFromTime)
        updateMaxDate(scope.shThruTime)

        element.bind 'dp.change', dpChange
        element.bind 'dp.show', dpShow
        element.bind 'dp.hide', dpHide

      changedFromPicker = false
      initial = false
      return


    updateMinDate = (value)  ->
      if value and isValidValueFormat(value)
        value *= 1 unless isNaN(value)

        if element.data('DateTimePicker')?.maxDate()? and element.data('DateTimePicker')?.maxDate()
          maxValue = element.data('DateTimePicker').maxDate().valueOf()
          value = maxValue if maxValue < value

        element.data('DateTimePicker')?.minDate(moment(value).tz(moment.defaultZone.name))
      else
        element.data('DateTimePicker')?.minDate(false)
      return


    updateMaxDate = (value)  ->
      if value and isValidValueFormat(value)
        value *= 1 unless isNaN(value)

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
      changedFromPicker = true
      if data.date
        ngModelCtrl.$setViewValue(data.date.tz(moment.defaultZone.name).format(displayFormat))
      else
        ngModelCtrl.$setViewValue(null)
      return

    dpShow = () ->
      setLastValid(ngModelCtrl.$modelValue)
      return

    dpHide = (data) ->
      if isValidDisplayFormat( ngModelCtrl.$viewValue )
        unless ngModelCtrl.$viewValue is data.date.tz(moment.defaultZone.name).format(displayFormat)
          setupDatepicker(ngModelCtrl.$modelValue)
      else
        if ngModelCtrl.$viewValue is null
          setLastValid(null)
          setupDatepicker(null)
        else
          setupDatepicker(lastValid)
      return



    isValidValueFormat = (modelValue) ->
      isValidMillisecond(modelValue) or isValidIsoFormat(modelValue)

    isValidMillisecond = (modelValue) ->
      not isNaN(modelValue)

    isValidIsoFormat = (modelValue) ->
      isNaN(modelValue) and
      moment(modelValue, moment.ISO_8601).isValid()


    isValidDisplayFormat = (viewValue) ->
      isNaN(viewValue) and
      viewValue.length is 23 and
      viewValue[22] is ')' and
      moment.tz(viewValue.substr(0, 19), displayFormat.substr(0, 19), true, moment.defaultZone.name).isValid()


    setLastValid = (modelValue) ->
      if modelValue and isValidValueFormat(modelValue)
        lastValid = modelValue
      else
        lastValid = null



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
        if newVal? and newVal isnt oldVal
          setupDatepicker(ngModelCtrl.$modelValue)
        return
    )

    scope.$watch(
      () ->
        ngModelCtrl.$modelValue
      (newVal, oldVal) ->
        if newVal? and isValidValueFormat(newVal) and isValidDisplayFormat(ngModelCtrl.$viewValue)
          if (not oldVal?) or ( oldVal? and isValidValueFormat(oldVal) )
            setupDatepicker(newVal)

        return
    )

    setupDatepicker(null)

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
          shDatetimeTmp = scope.shDatetime

          unless (isNaN(shDatetimeTmp) and moment(shDatetimeTmp, moment.ISO_8601).isValid())
            # should be millisecond from epoch
            shDatetimeTmp = shDatetimeTmp * 1

          moment(shDatetimeTmp).tz(moment.defaultZone.name).format(shDatetimeFormat)
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
      if value
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
