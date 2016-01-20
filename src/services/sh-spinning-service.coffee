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


shSpinningModule.service "ShSpinningService", ->

  spinningStates = {}


  ###*
  # @ngdoc method
  # @name spin
  #
  # @description
  # Get CSS class based on sortable state
  #
  # @param {String} key shSpinning directive value that used as a key
  # @param {Boolean=} spinning `true` to spin or `false` to stop. default is `true`
  #
  # @returns {*}
  ###
  @spin = (key, spinning) ->
    spinning = true unless spinning?
    if spinning
      spinningStates[key] = true
    else
      @stop(key)
    return


  ###*
  # @ngdoc method
  # @name stop
  #
  # @description
  # Stopping spinner.
  # Call `ShSpinningService.stop('some-key')` is equals to `ShSpinningService.spin('some-key', false)`.
  #
  # @param {String} key shSpinning directive value that used as a key
  #
  # @returns {*} class for CSS usage
  ###
  @stop = (key) ->
    delete spinningStates[key]
    return


  ###*
  # @ngdoc method
  # @name isSpinning
  #
  # @description
  # Check whether a loading spinner is on spinning state
  #
  # @param {String} key shSpinning directive value that used as a key
  #
  # @returns {Boolean}
  ###
  @isSpinning = (key) ->
    spinningStates[key] == true

  return this
