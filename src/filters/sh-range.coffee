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
# @file_name app/scripts/filters/sh-range.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains range filter.
# =============================================================================

angular.module('sh.range', []).filter "shRange", () ->
  (input, min, max, interval) ->
    if interval
      interval = parseInt(interval)
    else
      interval = 1
    min = parseInt(min) #Make string input int
    max = parseInt(max)
    i = min

    while i < max
      input.push i
      i+=interval
    input
