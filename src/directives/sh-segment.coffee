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



).directive("shSegmentHead", ->
  #
  #
  #
  restrict: 'C'
  scope: {}
  link: (scope, elem, attrs) ->
    scope.height = 0

    scope.$watch ->
      scope.height = elem.outerHeight()

    scope.$watch 'height', (newVal, oldVal) ->
      elem.next().css( 'top', newVal + 'px' )



).directive("shSegmentFoot", ->
  #
  #
  #
  restrict: 'C'
  scope: {}
  link: (scope, elem, attrs) ->
    scope.height = 0

    scope.$watch ->
      scope.height = elem.outerHeight()

    scope.$watch 'height', (newVal, oldVal) ->
      elem.prev().css( 'bottom', newVal + 'px' )



).directive("tableScrollBody", ['$timeout', ($timeout) ->
  #
  #
  #
  restrict: 'C'
  scope: {}
  link: (scope, element, attrs) ->

    assignBaseCss = (elmt, left) ->
      parent = $(elmt).parent()

      paddingTop = parent.css('padding-top')
      paddingLeft = parent.css('padding-left')
      paddingRight = parent.css('padding-right')
      paddingBottom = parent.css('padding-bottom')
      outerHeight = parent.outerHeight()

      $(elmt).css
        top: 0
        left: left
        marginTop: '-' + paddingTop
        marginLeft: '-' + paddingLeft
        marginRight: '-' + paddingRight
        marginBottom: '-' + paddingBottom
        paddingTop: paddingTop
        paddingLeft: paddingLeft
        paddingRight: paddingRight
        paddingBottom: paddingBottom
        minHeight: outerHeight-2


    assignShadowCss = (elmt, scrollSize, shadowDirection) ->
      parent = $(elmt).parent()
      paddingRight = parent.css('padding-right')
      if shadowDirection > 0
        # Left freeze
        unless parent.next().hasClass('td-fixed')
          if scrollSize > 0
            $(elmt).css
              boxShadow: '1px 0 0 rgba(0, 0, 0, 0.05), -1px 0 0 rgba(0, 0, 0, 0.1), ' + (shadowDirection * 5) + 'px 0px 0px 0px rgba(0, 0, 0, 0.03)'
              borderColor: 'rgba(0, 0, 0, 0.1)'
          else
            $(elmt).css
              boxShadow: '1px 0 0 rgba(0, 0, 0, 0.05), -1px 0 0 rgba(0, 0, 0, 0.05)'
              borderColor: 'rgba(0, 0, 0, 0.05)'

      else
        # right freeze
        unless parent.prev().hasClass('td-fixed')
          if scrollSize > 0
            $(elmt).css
              boxShadow: '-1px 0 0 rgba(0, 0, 0, 0.1), ' + (shadowDirection * 5) + 'px 0px 0px 0px rgba(0, 0, 0, 0.03)'
              borderColor: 'rgba(0, 0, 0, 0.1)'
          else
            $(elmt).css
              boxShadow: 'none'
              borderColor: 'rgba(0, 0, 0, 0.05)'


    refreshFreezedPane = () ->
      elementParent = $(element).parent()
      scrollLeft = $(element).scrollLeft()

      width = $(element)[0].clientWidth
      tableWidth = $(element).find('table.table').width()
      left = (width - tableWidth) + scrollLeft

      # TH & TD for lefty freeze
      elementParent.find('.td-fixed > .td-fixed-body.td-fixed-body-left').each ->
        assignBaseCss(this, scrollLeft)
        assignShadowCss(this, scrollLeft, 1)

      # TH & TD for righty freeze
      elementParent.find('.td-fixed > .td-fixed-body.td-fixed-body-right').each ->
        assignBaseCss(this, left)
        assignShadowCss(this, -left, -1)


    $(element).on('scroll', ->
      refreshFreezedPane()
      return
    )

    $(window).on('resize', ->
      refreshFreezedPane()
      return
    )

    scope.$watch ->
      refreshFreezedPane()
      return
  ]
)
