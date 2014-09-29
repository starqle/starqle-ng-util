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
# @file_name src/directives/sh-nicescroll.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shNicescroll directive
# =============================================================================

"use strict"

angular.module('sh.nicescroll', []).directive "shNicescroll", ->
  restrict: 'C'
  link: (scope, elem, attrs) ->
    nS = elem.niceScroll
      autohidemode: false
      cursoropacitymax: 0.4
      cursorwidth: 8
      cursorborderradius: 0
      horizrailenabled: false

    elem.addClass(nS.id)
    return
