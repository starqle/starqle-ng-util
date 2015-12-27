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
# @file_name src/directives/sh-number-format.coffee
# @author Bimo Horizon
# @email bimo@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shNumberFormat directive
# =============================================================================

"use strict"

angular.module('sh.number.format',[]).directive "shNumberFormat", ['$filter', ($filter) ->
  restrict: 'A'
  scope:
    shAllowZero: '@?'
    shMin: '=?'
    shMax: '=?'
    shLowerThan: '=?'
    shGreaterThan: '=?'
    shNumberInvalidMessage: '@?'
    shNumberHint: '@?'
    ngModel: '='
  require: '?ngModel'
  link: (scope, element, attributes, ngModel) ->
    classId = 'sh-number-' + Math.random().toString().slice(2)

    shAllowZero = if scope.shAllowZero is 'false' then false else true

    updatePopover = ->
      popoverContent = element.attr('data-content')
      if ngModel.$invalid
        popoverContent = scope.shNumberInvalidMessage ? 'Invalid Number'
      else
        popoverContent = (scope.shNumberHint ? 'Insert valid number') unless ngModel.$modelValue?
      angular.element('.' + classId).find('.popover-content').html(popoverContent)
      scope.applyValidity()

    ngModel.$formatters.push (value) ->
      return $filter('number') parseFloat(value)

    ngModel.$parsers.push (value) ->
      number = String(value).replace(/\,/g, '')
      number = parseFloat number
      if !number
        return null

      if scope.shMin? and number < parseFloat(scope.shMin)
        return parseFloat(scope.shMin)
      else if scope.shMax? and number > parseFloat(scope.shMax)
        return parseFloat(scope.shMax)
      number

    ngModel.$viewChangeListeners.push () ->
      ngModel.$invalid

    scope.applyValidity = ->
      if attributes.required?
        valid = true
        valid = valid && +scope.ngModel >= scope.shMin if scope.shMin?
        valid = valid && +scope.ngModel <= scope.shMax if scope.shMax?
        unless shAllowZero
          valid = +scope.ngModel isnt 0

        if scope.shLowerThan?
          valid = +scope.ngModel < scope.shLowerThan

        if scope.shGreaterThan?
          valid = +scope.ngModel > scope.shGreaterThan

        valid = false unless scope.ngModel?
        ngModel.$setValidity 'required', valid

    element.on 'focusout', ->
      ngModel.$viewValue = if ngModel.$modelValue? then String($filter('number') ngModel.$modelValue) else ''
      ngModel.$render()

    element.on 'focusin', ->
      ngModel.$viewValue = ngModel.$modelValue
      ngModel.$render()
      element.select()

    element.on 'keyup', ->
      updatePopover()

    element.on 'keydown', (e) ->
      if $.inArray(e.keyCode, [
        16, 17, 18, 46, 8, 9, 27, 13, 110, 173, 190, 189
        ]) != -1 or (e.keyCode >= 112 and e.keyCode <= 123) or e.keyCode in [65, 67, 86] and (e.ctrlKey == true or e.metaKey == true) or e.keyCode >= 35 and e.keyCode <= 40
        # let it happen, don't do anything
      else if (e.shiftKey or e.keyCode < 48 or e.keyCode > 57) and (e.keyCode < 96 or e.keyCode > 105)
        e.preventDefault()

    scope.$watch 'ngModel', (newValue, oldValue) ->
      # Always apply validity eventhough newVal equals oldVal
      scope.applyValidity()

    #
    # Initialize
    #
    element.popover(
      trigger: 'focus'
      container: 'body'
      placement: 'top'
      template:
        '<div class="popover ' + classId + '" role="tooltip">' +
        '  <div class="arrow"></div>' +
        '  <h3 class="popover-title"></h3>' +
        '  <div class="popover-content"></div>' +
        '</div>'

    )

    element.on 'shown.bs.popover', ->
      updatePopover()
]
