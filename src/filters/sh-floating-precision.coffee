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
# @file_name src/filters/floating-precision.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains Floating Precision filter
# =============================================================================

"use strict"

# TODO: Move it to ng-util
# Avoid floating-point error like 0.30000000000001
angular.module('sh.floating.precision', []).filter "shFloatingPrecision", ->
  (value, accuracy=12) ->
    parseFloat(value.toPrecision(accuracy))
