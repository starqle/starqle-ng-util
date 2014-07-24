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
  link: (scope, element, attrs, ctrl) ->
    elmt = jQuery(element)
    shSubmitOverlay = jQuery('<span class="sh-submit-overlay" ng-mouseover="overlayHover()" ng-mouseleave="overlayLeave()"></span>')
    $compile(shSubmitOverlay)(scope)
    scope.shHighlightRequired = {} unless scope.shHighlightRequired

    scope.overlayHover = ->
      scope.shHighlightRequired[attrs.shSubmit] = true

    scope.overlayLeave = ->
      scope.shHighlightRequired[attrs.shSubmit] = false

    if elmt.next('.sh-submit-overlay').length == 0 && elmt.parents('.sh-submit-overlay').length == 0
      shSubmitOverlay.insertAfter(elmt)
      shSubmitOverlay.tooltip
        title: 'Fill the highlighed field(s)'
      elmt.appendTo(shSubmitOverlay)

    scope.$watch "#{attrs.shSubmit}.$invalid", (newValue, oldValue) ->
      # value is a string, not boolean
      if newValue == false
        shSubmitOverlay.tooltip 'destroy'
        # shSubmitOverlay.tooltip
        #   title: 'Already filled'
      else
        shSubmitOverlay.tooltip 'destroy'
        shSubmitOverlay.tooltip
          title: 'Harap lengkapi isian yang disorot'
]
