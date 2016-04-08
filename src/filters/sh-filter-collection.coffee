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
# @file_name src/filters/sh-filter-collection.coffee
# @author Bimo Horizon
# @email bimo@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shFilterCollection filter.
# =============================================================================


angular.module(
  'sh.filter.collection'
  []
).filter(

  "shFilterCollection"
  () ->
    (collection, callback, entity) ->
      if collection && entity
        collection.filter (item) ->
          return callback(item, entity)

).filter(

  'searchAnyIn'
  [
    '$filter'
    ($filter) ->
      (collection, fields, query) ->
        unless query
          collection
        else
          collection.filter (item) ->
            result = false
            for field in fields
              result = result or item[field].toLowerCase().indexOf(query.toLowerCase()) >= 0 unless result
            result
  ]

)
