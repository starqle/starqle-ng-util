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


angular.module('sh.submit',[]).directive 'shSubmit', ['$compile', '$filter', ($compile, $filter) ->
  restrict: 'A'
  scope: true
  link: (scope, element, attrs) ->

    #
    # Prepare element
    #

    # Overlay element
    shSubmitOverlay = angular.element '''
      <segment
        class="sh-submit-overlay"
        ng-mouseover="overlayHover()"
      >
      </segment>
      '''

    shSubmitOverlay.css
      position: 'relative'
      float: element.css('float')

    # Overlay element inner
    shSubmitOverlayInner = angular.element '''
      <div
        class="sh-submit-overlay-inner"
        ng-mouseover="overlayInnerHover()"
      >
      </div>
      '''
    shSubmitOverlayInner.css
      position: 'absolute'

    # Append shSubmitOverlayInner to shSubmitOverlay
    shSubmitOverlayInner.appendTo shSubmitOverlay

    # Compile it
    $compile(shSubmitOverlay)(scope)

    shSubmitInvalid = attrs.shSubmitInvalid or $filter('translate')('INFO_FIELD_CORRECTION')

    if element.next('.sh-submit-overlay').length == 0 && element.parents('.sh-submit-overlay').length == 0
      # Place shSubmitOverlay after the element
      shSubmitOverlay.insertAfter(element)

      # Then prepend the element to shSubmitOverlay
      element.prependTo(shSubmitOverlay)

      #
      shSubmitOverlayInner.tooltip(
        title: shSubmitInvalid
      )



    #
    # Scope methods/variables
    #

    # Workaround for dotted string
    # http://stackoverflow.com/a/8052100
    getDescendantProp = (obj, desc) ->
      arr = desc.split('.')
      result = null
      while arr.length
        result = (result or obj)[arr.shift()]

      result

    scope.overlayInnerHover = ->
      if getDescendantProp(scope, attrs.shSubmit)?.$invalid
        form = element.parents('form').eq(0)
        if form.length > 0
          form.addClass('sh-highlight-required')
        else
          angular.element("form[name='#{attrs.shSubmit}']").addClass('sh-highlight-required')
      return

    scope.overlayHover = ->
      if getDescendantProp(scope, attrs.shSubmit)?.$invalid
        shSubmitOverlayInner.css
          left: element.position().left
          top: element.position().top
          width: element.outerWidth()
          height: element.outerHeight()
          marginLeft: element.css('margin-left')
          marginRight: element.css('margin-right')
      return

    scope.$watch(
      () ->
        getDescendantProp(scope, attrs.shSubmit)?.$invalid
      (newVal, oldVal) ->
        if newVal?
          if newVal
            shSubmitOverlayInner.show()
          else
            shSubmitOverlayInner.hide()

    )


    return

]
