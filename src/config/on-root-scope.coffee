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
# @file_name src/config/on-root-scope.coffee
# @author Giovanni Sakti
# @email giosakti@starqle.com
# @company PT. Starqle Indonesia
# @note application-wide method for monitoring event in rootScope.
# =============================================================================

"use strict"

angular.module('on.root.scope', []).config ["$provide", ($provide) ->
  $provide.decorator "$rootScope", ["$delegate", ($delegate) ->
    Object.defineProperty $delegate.constructor::, "$onRootScope",
      value: (name, listener) ->
        unsubscribe = $delegate.$on(name, listener)
        @$on "$destroy", unsubscribe

      enumerable: false

    return $delegate
  ]
]
