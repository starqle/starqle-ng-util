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
# @file_name src/services/sh-button-state.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shButtonState service.
# =============================================================================


angular.module('sh.button.state',[]).service "ShButtonState", ['$timeout', ($timeout) ->

  @initializeEvent = ($event, defaultValue) ->
    defaultValue = (if (typeof defaultValue is "undefined") then null else defaultValue)
    return (if (typeof $event is "undefined") then defaultValue else $event) # http://stackoverflow.com/questions/148901/is-there-a-better-way-to-do-optional-function-parameters-in-javascript

  @setEnable = ($event, enabled) ->
    if $event?
      target = jQuery($event.target)
      target.prop('disabled', !enabled)

      if target.is 'form'
        btn = target.find('button[type="submit"]')
        btn.prop('disabled', !enabled)
      else if target.is 'a'
        if enabled
          target.removeClass 'disabled'
        else
          target.addClass 'disabled'
      else if target.is 'span'
        target = target.parent()
        if enabled
          target.removeClass 'disabled'
        else
          target.addClass 'disabled'
    return

  @disable = ($event) ->
    @setEnable $event, false

  @loading = ($event) ->
    @disable($event)

  @enable = ($event) ->
    @setEnable $event, true

  return
]
