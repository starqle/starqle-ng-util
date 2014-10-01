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
# @file_name src/directives/sh-focus.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shFocus directive (based-on http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field)
# =============================================================================

"use strict"

angular.module('sh.focus', []).directive "shFocus", ['$timeout', ($timeout) ->
  scope:
    shFocus: '='
  link: (scope, element, attrs) ->
    scope.$watch 'shFocus', (value) ->
      if value is true
        $timeout ->
          element.eq(0).select()
        return
      else
        $timeout ->
          element.eq(0).blur()
        return
      return
    return
]
