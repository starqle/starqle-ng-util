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
# @file_name src/factories/sh-table-params.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains ShPersistence for holding tableParams data inspired by ng-table
# =============================================================================

###*
# @ngdoc object
# @name ShPersistence
#
# @description
# ShPersistence factory
#
###

shPersistenceModule.factory(
  'ShPersistence'
  [
    '$q'
    'ShPersistenceHook'
    (
      $q
      ShPersistenceHook
    ) ->

      ShPersistence = (params) ->

        # Variables
        self = this

        self.entity = {}

        #
        self.id = params.id ? null
        self.localLookup = {}
        self.optParams = params.optParams ? {}
        self.resource = params.resource ? null
        self.sorting = params.sorting ? {id: "desc"}

        #
        shPersistenceHook = new ShPersistenceHook(
          shPersistence: self
        )


        #
        # Return this/self
        #
        this

      #
      # Return ShPersistence
      #
      ShPersistence
  ]
)
