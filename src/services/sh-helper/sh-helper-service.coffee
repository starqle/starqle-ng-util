# =============================================================================
# Copyright (c) 2015 All Right Reserved, http://starqle.com/
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
# @file_name src/services/sh-helper/sh-helper-service.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains Lookup Service service.
# =============================================================================

"use strict"

shHelperModule.service "HelperService", [ ->
  # Select Deselect
  @rowSelect = (obj, collections, key) ->
    if key?
      idx = collections.map( (o) -> o[key + ''] ).indexOf( obj[key + ''] )
    else
      idx = collections.indexOf( obj )

    if idx < 0
      collections.push obj

  @rowDeselect = (obj, collections, key) ->
    if key?
      idx = collections.map( (o) -> o[key + ''] ).indexOf( obj[key + ''] )
    else
      idx = collections.indexOf( obj )

    if idx >= 0
      collections.splice(idx, 1)

  @clearRowSelection = (collections) ->
    collections.splice(0)

  #
  @rowToggle = (obj, collections, key) ->
    if @isRowSelected(obj, collections, key)
      @rowDeselect(obj, collections, key)
    else
      @rowSelect(obj, collections, key)

  #
  @isRowSelected = (obj, collections, key) ->
    if key?
      collections.map( (o) -> o[key + ''] ).indexOf( obj[key + ''] ) >= 0
    else
      collections.indexOf( obj ) >= 0

  @getRowSelection = (collections, key) ->
    if key?
      collections.map( (o) -> o[key + ''] )
    else
      collections

  #
  @totalRowSelection = (collections) ->
    collections.length

  @isRowSelectionEmpty = (collections) ->
    @totalRowSelection(collections) == 0


  #
  # Return object with only necessary attributes
  #
  @selectAttributes = (object) ->
    if object?
      args = Array.prototype.slice.call(arguments, 1)
      result = {}
      for key in args
        result[key] = object[key]
      result
    else
      object

  return this
]
