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


shSpinningModule.directive "shSpinning", ['ShSpinningService', (ShSpinningService) ->
  restrict: 'A'
  scope: true # Child scope
  link: (scope, element, attrs) ->
    lines = 13
    length = 30
    width = 10
    radius = 38

    if attrs.shSpinningSize? # xs | sm | md | lg
      switch attrs.shSpinningSize
        when 'xs'
          lines = 9
          length = 4
          width = 2
          radius = 5

        when 'sm'
          lines = 9
          length = 10
          width = 4
          radius = 12

        when 'md'
          lines = 11
          length = 20
          width = 7
          radius = 25

        when 'lg'
          lines = 13
          length = 30
          width = 10
          radius = 38

    scope.shSpinningLines = +attrs.shSpinningLines or lines # The number of lines to draw
    scope.shSpinningLength = +attrs.shSpinningLength or length # The length of each line
    scope.shSpinningWidth = +attrs.shSpinningWidth or width # The line thickness
    scope.shSpinningRadius = +attrs.shSpinningRadius or radius # The radius of the inner circle

    scope.shSpinningCorners = +attrs.shSpinningCorners or 1 # Corner roundness (0..1)
    scope.shSpinningRotate = +attrs.shSpinningRotate or 0 # The rotation offset
    scope.shSpinningDirection = +attrs.shSpinningDirection or 1 # 1: clockwise, -1: counterclockwise
    scope.shSpinningColor = attrs.shSpinningColor or '#000' # #rgb or #rrggbb or array of colors
    scope.shSpinningSpeed = +attrs.shSpinningSpeed or 2.2 # Rounds per second
    scope.shSpinningTrail = +attrs.shSpinningTrail or 100 # Afterglow percentage
    scope.shSpinningShadow = attrs.shSpinningShadow or false # Whether to render a shadow
    scope.shSpinningHwaccel = attrs.shSpinningHwaccel or false # Whether to use hardware acceleration
    scope.shSpinningClassName = attrs.shSpinningClassName or 'spinner' # The CSS class to assign to the spinner
    scope.shSpinningZIndex = +attrs.shSpinningZIndex or 2e9 # The z-index (defaults to 2000000000)
    scope.shSpinningTop = attrs.shSpinningTop or '45%' # Top position relative to parent
    scope.shSpinningLeft = attrs.shSpinningLeft or '50%' # Left position relative to parent



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

    scope.$watch (
      () ->
        ShSpinningService.isSpinning(attrs.shSpinning)

      (newVal, oldVal) ->
        if ShSpinningService.isSpinning(attrs.shSpinning)
          angular.element(element).addClass('sh-spinning-spin')
          scope.spinner?.spin(element[0])
        else
          angular.element(element).removeClass('sh-spinning-spin')
          scope.spinner?.stop()
        return
    )

    return
]
