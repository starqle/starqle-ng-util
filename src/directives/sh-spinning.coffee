# =============================================================================
# Copyright (c) 2014 All Right Reserved, http://starqle.com/
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
# @file_name src/directives/sh-spinning.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shSpinning directive
# =============================================================================

"use strict"

angular.module('sh.spinning', []).directive "shSpinning", ['ShSpinningService', (ShSpinningService) ->
  restrict: 'A'
  scope:
    shSpinning: '@'
    shSpinningLines: '@?'
    shSpinningLength: '@?'
    shSpinningWidth: '@?'
    shSpinningRadius: '@?'
    shSpinningCorners: '@?'
    shSpinningRotate: '@?'
    shSpinningDirection: '@?'
    shSpinningColor: '@?'
    shSpinningSpeed: '@?'
    shSpinningTrail: '@?'
    shSpinningShadow: '@?'
    shSpinningHwaccel: '@?'
    shSpinningClassName: '@?'
    shSpinningZIndex: '@?'
    shSpinningTop: '@?'
    shSpinningLeft: '@?'
  link: (scope, element, attrs) ->
    scope.shSpinningLines = +scope.shSpinningLines or 13 # The number of lines to draw
    scope.shSpinningLength = +scope.shSpinningLength or 30 # The length of each line
    scope.shSpinningWidth = +scope.shSpinningWidth or 10 # The line thickness
    scope.shSpinningRadius = +scope.shSpinningRadius or 38 # The radius of the inner circle
    scope.shSpinningCorners = +scope.shSpinningCorners or 1 # Corner roundness (0..1)
    scope.shSpinningRotate = +scope.shSpinningRotate or 0 # The rotation offset
    scope.shSpinningDirection = +scope.shSpinningDirection or 1 # 1: clockwise, -1: counterclockwise
    scope.shSpinningColor = scope.shSpinningColor or '#000' # #rgb or #rrggbb or array of colors
    scope.shSpinningSpeed = +scope.shSpinningSpeed or 2.2 # Rounds per second
    scope.shSpinningTrail = +scope.shSpinningTrail or 100 # Afterglow percentage
    scope.shSpinningShadow = scope.shSpinningShadow or false # Whether to render a shadow
    scope.shSpinningHwaccel = scope.shSpinningHwaccel or false # Whether to use hardware acceleration
    scope.shSpinningClassName = scope.shSpinningClassName or 'spinner' # The CSS class to assign to the spinner
    scope.shSpinningZIndex = +scope.shSpinningZIndex or 2e9 # The z-index (defaults to 2000000000)
    scope.shSpinningTop = scope.shSpinningTop or '45%' # Top position relative to parent
    scope.shSpinningLeft = scope.shSpinningLeft or '50%' # Left position relative to parent

    opts =
      lines: scope.shSpinningLines
      length: scope.shSpinningLength
      width: scope.shSpinningWidth
      radius: scope.shSpinningRadius
      corners: scope.shSpinningCorners
      rotate: scope.shSpinningRotate
      direction: scope.shSpinningDirection
      color: scope.shSpinningColor
      speed: scope.shSpinningSpeed
      trail: scope.shSpinningTrail
      shadow: scope.shSpinningShadow
      hwaccel: scope.shSpinningHwaccel
      className: scope.shSpinningClassName
      zIndex: scope.shSpinningZIndex
      top: scope.shSpinningTop
      left: scope.shSpinningLeft

    scope.spinner = new Spinner(opts)

    scope.$watch (->
      ShSpinningService.isSpinning(scope.shSpinning)
    ), (newVal) ->
      if ShSpinningService.isSpinning(scope.shSpinning)
        scope.spinner.spin(element[0])
      else
        scope.spinner.stop()
      return

    return
]
