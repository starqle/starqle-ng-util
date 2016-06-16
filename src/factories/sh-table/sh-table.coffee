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
# @note This file contains ShTableParams for holding tableParams data inspired by ng-table
# =============================================================================

###*
# @ngdoc object
# @name ShTableParams
#
# @description
# ShTableParams factory
#
###

shTableModule.factory(
  'ShTable'
  [
    '$q'
    'ShTableFilter'
    'ShTableHelper'
    'ShTableHook'
    'ShTableParamsHook'
    'ShTableProcessor'
    'ShTableFilterStorage'
    'ShTableParams'
    (
      $q
      ShTableFilter
      ShTableHelper
      ShTableHook
      ShTableParamsHook
      ShTableProcessor
      ShTableFilterStorage
      ShTableParams
    ) ->


      ###*
      # @ngdoc method
      # @name ShTableParams
      #
      # @param {}
      #
      # @returns ShTableParams
      #
      # @description
      # ShTableParams self object
      #
      ###

      ShTable = (params) ->
        self = this

        self.entity = {}

        #
        self.columnDefs = params.columnDefs ? []
        self.filterParams = params.filterParams ? {}
        self.localLookup = {}
        self.name = params.name ? ''
        self.optParams = params.optParams ? {}
        self.perPage = params.perPage ? 10
        self.resource = params.resource ? null
        self.sorting = params.sorting ? {}

        #
        #
        shTableFilter = new ShTableFilter(
          shTable: self
        )

        shTableHelper = new ShTableHelper(
          shTable: self
        )

        shTableHook = new ShTableHook(
          shTable: self
        )

        shTableParamsHook = new ShTableParamsHook(
          shTable: self
        )

        shTableProcessor = new ShTableProcessor()

        shTableFilterStorage = new ShTableFilterStorage(
          shTable: self
        )


        #
        self.tableParams = new ShTableParams(
          pageNumber: 1
          perPage: self.perPage
          sortInfo: 'this is sort info'
          sorting: self.sorting
          getData: () ->
            gridParams = shTableProcessor.generateGridParams
              params: self.tableParams.$params
              columnDefs: self.columnDefs
              filterParams: self.filterParams

            # Merge gridParams to self.optParams
            angular.extend(self.optParams, gridParams)

            self.getPagedDataAsync()
        )


        #
        # Return this/self
        #
        this



      #
      # Return ShTable
      #
      ShTable
  ]
)
