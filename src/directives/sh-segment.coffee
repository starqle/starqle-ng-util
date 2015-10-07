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
# @file_name app/scripts/directives/sh-segment.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains wideTableContainer, tableScrollHead, tableScrollFoot, shSegmentHead, shSegmentFoot directive
# =============================================================================

#
# sh-collapsible
#
angular.module('sh.segment', []

).directive("wideTableContainer", ->
  #
  #
  #
  scrollSlave = (body, head) ->
    if !head or !head[0]
      return
    head[0].scrollLeft = body[0].scrollLeft
    return

  restrict: 'C'
  replace: false
  compile: (element, attrs) ->
    body = element.find('.table-scroll-body')
    head = element.find('.table-scroll-head')
    foot = element.find('.table-scroll-foot')
    body.on 'scroll', ->
      scrollSlave body, head
      scrollSlave body, foot
      return
    return




).directive("tableScrollHead", ->
  #
  #
  #
  restrict: 'C'
  link: (scope, elem, attrs) ->
    scope.__scrollHeadHeight = 0

    scope.$watch '__scrollHeadHeight', (newVal, oldVal) ->
      elem.next().css( 'top', newVal + 'px' )

    $(window).resize ->
      scope.$apply ->
        scope.__scrollHeadHeight = elem.outerHeight()



).directive("tableScrollFoot", ->
  #
  #
  #
  restrict: 'C'
  link: (scope, elem, attrs) ->
    scope.__scrollFootHeight = 0

    scope.$watch '__scrollFootHeight', (newVal, oldVal) ->
      elem.prev().css( 'bottom', newVal + 'px' )

    $(window).resize ->
      scope.$apply ->
        scope.__scrollFootHeight = elem.outerHeight()



).directive("shSegmentHead", ->
  #
  #
  #
  restrict: 'C'
  scope: {}
  link: (scope, elem, attrs) ->
    scope.height = 0

    scope.$watch 'height', (newVal, oldVal) ->
      elem.next().css( 'top', newVal + 'px' )

    $(window).resize ->
      scope.$apply ->
        scope.height = elem.outerHeight()



).directive("shSegmentFoot", ->
  #
  #
  #
  restrict: 'C'
  scope: {}
  link: (scope, elem, attrs) ->
    scope.height = 0

    scope.$watch 'height', (newVal, oldVal) ->
      elem.prev().css( 'bottom', newVal + 'px' )

    $(window).resize ->
      scope.$apply ->
        scope.height = elem.outerHeight()



)
