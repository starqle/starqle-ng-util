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
# @file_name src/services/sh-helper/sh-element-finder.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shElementFinder service
# =============================================================================


shHelperModule.service "shElementFinder", ->

  # find within array of hash (object)
  # by id
  @findById = (source, id) ->
    obj = undefined
    obj = source.filter((obj) ->
      +obj.id is +id
    )

  @findFirstById = (source, id) ->
    obj = undefined
    obj = source.filter((obj) ->
      +obj.id is +id
    )[0]
    (if obj? then obj else obj = {})

  # find within array of hash (object)
  # by field
  @findByField = (source, value) ->
    obj = undefined
    obj = source.filter((obj) ->
      obj.field is value
    )

  # find within array of element
  # by element
  @findByElmt = (source, elmt) ->
    obj = undefined
    obj = source.filter((obj) ->
      +obj is +elmt
    )

  return this
