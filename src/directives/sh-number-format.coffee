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
    shMin: '@'
    shMax: '@'
    ngModel: '='
  require: '?ngModel'
  link: (scope, element, attributes, ngModel) ->
    element.popover({trigger: 'focus', placement: 'top'})

    ngModel.$formatters.push (value) ->
      return $filter('number')(parseInt(value), 0)

    ngModel.$parsers.push (value) ->
      number = String(value).replace('/\./g', '')
      number = parseInt number
      if !number
        return 0

      if scope.shMin? and number < parseInt(scope.shMin)
        return parseInt(scope.shMin)
      else if scope.shMax? and number > parseInt(scope.shMax)
        return parseInt(scope.shMax)

      number

    scope.applyValidity = ->
      if attributes.required
        valid = scope.ngModel && +scope.ngModel > 0
        valid = valid && +scope.ngModel >= scope.shMin if scope.shMin
        valid = valid && +scope.ngModel <= scope.shMax if scope.shMax
        ngModel.$setValidity 'required', valid

    scope.applyValidity()

    element.on 'focusout', ->
      ngModel.$viewValue = String($filter('number')(ngModel.$modelValue || 0, 0))
      ngModel.$render()

    element.on 'focusin', ->
      ngModel.$viewValue = String(ngModel.$modelValue || 0)
      ngModel.$render()
      element.select()

    element.on 'keyup', ->
      element.siblings('.popover').find('.popover-content').html(element.attr('data-content'))
      scope.applyValidity()

    scope.$watch 'ngModel', (newValue, oldValue) ->
      # Always apply validity eventhough newVal equals oldVal
      scope.applyValidity()
]
