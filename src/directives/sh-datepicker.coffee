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

angular.module('sh.datepicker', []).directive "shDatepicker", ['dateFilter', (dateFilter) ->
  restrict: 'A'
  scope:
    shStartDate: '='
    shEndDate:  '='
  require: '?ngModel'
  link: ($scope, $element, $attrs, ngModel) ->
    datepickerOptions =
      format: 'dd-mm-yyyy'
      autoclose: true
      todayBtn: 'linked'
      todayHighlight: true
      weekStart: 1

    onChangeDateEvent = (event) ->
      ngModel.$setViewValue event.date
      $($element).datepicker("update")

    onShowEvent = ->
      $attrs.value = $attrs.value || ''
      if $attrs.value != dateFilter $element.datepicker('getDate'), 'dd-MM-yyyy'
        $element.datepicker('setDate', $attrs.value)

    # Initialize datepicker
    init = ->
      $element.datepicker(datepickerOptions)
        .on('changeDate', onChangeDateEvent)
        .on('show', onShowEvent)

    init()

    ngModel.$formatters.push (data) ->
      dateFilter data, 'dd-MM-yyyy'

    # When i18n language is changed
    $scope.$watch 'shStartDate', (newVal, oldVal) ->
      newVal = newVal || -Infinity
      $element.datepicker('setStartDate', newVal)

    $scope.$watch 'shEndDate', (newVal, oldVal) ->
      newVal = newVal || 0
      $element.datepicker('setEndDate', newVal)
]
