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
# @file_name src/prototypes/sh-table/sh-table.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for controlling api request on table-like data.
# =============================================================================


shTableModule.run ['$rootScope', ($rootScope) ->


  ###*
  # @ngdoc factory
  # @name shTable
  #
  # @description
  # shTable
  ###
  $rootScope.shTable = [
    '$injector'
    '$q'
    'ShTableParams'
    (
      $injector
      $q
      ShTableParams
    ) ->

      #
      self = this

      #
      @entity = {}

      #
      @resource = null unless @resource?
      @columnDefs = [] unless @columnDefs?
      @localLookup = {}
      @sorting = {} unless @sorting?

      shTableProcessor = {}

      #
      #
      $injector.invoke $rootScope.shTableFilter, this
      $injector.invoke $rootScope.shTableHelper, this
      $injector.invoke $rootScope.shTableHook, this
      $injector.invoke $rootScope.shTableParamsHook, this

      $injector.invoke $rootScope.shTableProcessor, shTableProcessor

      #
      @tableParams = new ShTableParams(
        pageNumber: 1
        perPage: 10
        sortInfo: 'this is sort info'
        sorting: @sorting
        getData: () ->
          gridParams = shTableProcessor.generateGridParams
            params: self.tableParams.$params
            columnDefs: self.columnDefs
            filterParams: self.filterParams

          # Merge gridParams to @optParams
          angular.extend(self.optParams, gridParams)

          self.getPagedDataAsync()
      )


      return


  ]


  return


]
