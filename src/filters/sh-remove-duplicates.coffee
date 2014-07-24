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
# @file_name src/filters/sh-remove-duplicates.coffee
# @author Bimo Horizon
# @email bimo@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shRemoveDuplicates filter.
# =============================================================================

"use strict"

angular.module('sh.remove.duplicates', []).filter "shRemoveDuplicates", [ ->
  (collection, fieldName, callback) ->
    if collection
      newArray = []
      newCollection = {}
      aggregateItems = {}

      for item in collection
        newCollection[item[fieldName]] = $.extend({}, item)
        newItem = newCollection[item[fieldName]]
        callback(newItem, newItem[fieldName], aggregateItems) if typeof callback is 'function'

      for key, value of newCollection
        value[fieldName] = key
        newArray.push value

      return newArray
]
