# =============================================================================
# Copyright (c) 2013 All Right Reserved, http://starqle.com/
#
# This source is subject to the Starqle Permissive License.
# Please see the License.txt file for more information.
# All other rights reserved.
#
# THIS CODE AND INFORMATION ARE PROVIDED 'AS IS' WITHOUT WARRANTY OF ANY
# KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
# PARTICULAR PURPOSE.
#
# @file_name src/directives/sh-submit.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shSubmit directive
# =============================================================================

"use strict"

# How-To
# Add ng-class attribute in corresponding form; example value: "{'sh-highlight-required': shHighlightRequired }"
# Add sh-submit attribute in form button within corresponding form; example value: "{{facilityTypeForm.$invalid}}"

angular.module('sh.submit',[]).directive 'shSubmit', ['$compile', ($compile) ->
  restrict: 'A'
  link: (scope, element, attrs) ->
    shSubmitOverlay = angular.element('<span class="sh-submit-overlay" ng-mouseover="overlayHover()" ng-mouseleave="overlayLeave()"></span>')
    $compile(shSubmitOverlay)(scope)

    shSubmitInvalid = attrs.shSubmitInvalid or 'Please correct/fill out the highlighted fields'

    if element.next('.sh-submit-overlay').length == 0 && element.parents('.sh-submit-overlay').length == 0
      shSubmitOverlay.insertAfter(element)
      shSubmitOverlay.tooltip
        title: shSubmitInvalid
      element.appendTo(shSubmitOverlay)

    scope.overlayHover = ->
      if scope["#{attrs.shSubmit}"].$invalid
        element.parents('form').eq(0).addClass('sh-highlight-required')
      return

    scope.$watch "#{attrs.shSubmit}.$invalid", (newValue, oldValue) ->
      # value is a string, not boolean
      if newValue == false
        shSubmitOverlay.tooltip 'destroy'
      else
        shSubmitOverlay.tooltip 'destroy'
        shSubmitOverlay.tooltip
          title: shSubmitInvalid
]
