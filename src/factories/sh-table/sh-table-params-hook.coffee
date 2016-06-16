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
# @note This file contains ShTableParamsHook for holding tableParams data inspired by ng-table
# =============================================================================

###*
# @ngdoc object
# @name ShTableParamsHook
#
# @description
# ShTableParamsHook factory
#
###

shTableModule.factory(
  'ShTableParamsHook'
  [
    '$q'
    (
      $q
    ) ->

      ShTableParamsHook = (params) ->

        # Variables
        self = this

        self.shTable = params.shTable


        self.shTable.beforeRefreshGridHooks = []
        self.shTable.refreshGridSuccessHooks = []
        self.shTable.refreshGridErrorHooks = []
        self.shTable.afterRefreshGridHooks = []


        ###*
        # @ngdoc method
        # @name goToPage
        #
        # @description
        # Assign page number to `this.tableParams.$params.pageNumber`, then calling `this.refreshGrid()` in appropriate format
        #
        # @returns {*}
        ###
        self.shTable.goToPage = (pageNumber, perPage) ->
          if pageNumber?
            self.shTable.tableParams.$params.perPage = perPage or self.shTable.tableParams.$params.perPage
            self.shTable.tableParams.$params.pageNumber = pageNumber

          # Manually refresh with current page
          self.shTable.refreshGrid()
          return


        ###*
        # @ngdoc method
        # @name refreshGrid
        #
        # @description
        # Calling `tableParams.reload()`
        #
        # @returns {*}
        ###
        self.shTable.refreshGrid = () ->
          hook() for hook in self.shTable.beforeRefreshGridHooks
          deferred = $q.defer()

          # GEt the entities
          self.shTable.tableParams.reload().then(
            (success) ->
              hook(success) for hook in self.shTable.refreshGridSuccessHooks
              deferred.resolve success

            (error) ->
              hook(error) for hook in self.shTable.refreshGridErrorHooks
              deferred.reject error

          ).finally(
            () ->
              hook() for hook in self.shTable.afterRefreshGridHooks
          )
          deferred.promise


        ###*
        # @ngdoc method
        # @name getPagedDataAsync
        #
        # @description
        # Calling `this.getEntities()` after processing `this.optParams`
        #
        # @returns {promise}
        ###
        self.shTable.getPagedDataAsync = () ->
          deferred = $q.defer()

          self.shTable.getEntities().then(
            (success) ->
              deferred.resolve
                items: success.data.items
                totalCount: success.data.total_server_items
          )

          deferred.promise


        #
        # Return this/self
        #
        this

      #
      # Return ShTableParamsHook
      #
      ShTableParamsHook
  ]
)
