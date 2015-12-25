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
# @file_name src/prototypes/sh-table/sh-table-params-hook.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for controlling stTableParam feature data.
# =============================================================================

"use strict"

shTableModule.run ['$rootScope', ($rootScope) ->


  ###*
  # @ngdoc factory
  # @name shTableParamsHook
  #
  # @description
  # ShTableRest
  ###
  $rootScope.shTableParamsHook = [
    '$injector'
    '$q'
    (
      $injector
      $q
    ) ->

      self = this

      @beforeRefreshGridHooks = []
      @refreshGridSuccessHooks = []
      @refreshGridErrorHooks = []
      @afterRefreshGridHooks = []


      ###*
      # @ngdoc method
      # @name goToPage
      #
      # @description
      # Assign page number to `this.tableParams.$params.pageNumber`, then calling `this.refreshGrid()` in appropriate format
      #
      # @returns {*}
      ###
      @goToPage = (pageNumber, perPage) ->
        if pageNumber?
          @tableParams.$params.perPage = perPage or @tableParams.$params.perPage
          @tableParams.$params.pageNumber = pageNumber

        # Manually refresh with current page
        @refreshGrid()


      ###*
      # @ngdoc method
      # @name refreshGrid
      #
      # @description
      # Calling `tableParams.reload()`
      #
      # @returns {*}
      ###
      @refreshGrid = () ->
        hook() for hook in self.beforeRefreshGridHooks
        deferred = $q.defer()

        # GEt the entities
        @tableParams.reload().then(
          (success) ->
            hook(success) for hook in self.refreshGridSuccessHooks
            deferred.resolve success

          (error) ->
            hook(error) for hook in self.refreshGridErrorHooks
            deferred.reject error

        ).finally(
          () ->
            hook() for hook in self.afterRefreshGridHooks
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
      @getPagedDataAsync = () ->
        deferred = $q.defer()

        @getEntities().then(
          (success) ->
            deferred.resolve
              items: success.data.items
              totalCount: success.data.total_server_items
        )

        deferred.promise


  ]


]
