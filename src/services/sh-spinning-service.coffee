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
# @file_name src/services/sh-spinning-service.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains ShSpinningService service.
# =============================================================================

"use strict";

angular.module('sh.spinning.service',[]).service "ShSpinningService", ->
  spinningStates = {}

  @spin = (key, action) ->
    action = true unless action?
    if action
      spinningStates[key] = true
    else
      @stop(key)

  @stop = (key) ->
    delete spinningStates[key]

  @isSpinning = (key) ->
    spinningStates[key] == true

  return this
