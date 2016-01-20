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
# @file_name src/filters/sh-truncate.coffee
# @author Giovanni Sakti
# @email giosakti@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shTruncate filter.
# =============================================================================


angular.module('sh.truncate', []).filter "shTruncate", [ ->
  (text, wordwise, max, tail) ->
    if !text
      return ''

    max = parseInt(max, 10)
    if !max
      return text
    if text.length <= max
      return text

    text = text.substr(0, max)
    if wordwise
      lastspace = text.lastIndexOf(' ')
      if lastspace != -1
        text = text.substr(0, lastspace)

    return text + (tail || ' ...')
]
