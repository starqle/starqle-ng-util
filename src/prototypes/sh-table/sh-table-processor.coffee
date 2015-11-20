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
# @file_name src/prototypes/sh-table/sh-table-processor.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for controlling api request on table-like data.
# =============================================================================

"use strict"

shTableModule.run ['$rootScope', ($rootScope) ->


  ###*
  # @ngdoc factory
  # @name shTableProcessor
  #
  # @description
  # shTableProcessor
  ###
  $rootScope.shTableProcessor = [
    '$injector'
    '$q'
    (
      $injector
      $q
    ) ->

      #
      self = this

      #
      $injector.invoke $rootScope.shTableFilter, this
      $injector.invoke $rootScope.shTableHelper, this
      $injector.invoke $rootScope.shTableHook, this

      ###*
      # @ngdoc method
      # @name goToPage
      #
      # @description
      #
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
      #
      #
      # @returns {*}
      ###
      @refreshGrid = () ->
        @tableParams.reload()


      ###*
      # @ngdoc method
      # @name generateGridParams
      #
      # @description
      #
      #
      # @returns {Object} Grid params object
      ###
      @generateGridParams = ->
        params = @tableParams.$params

        fields = []
        directions = []
        for property of params.sorting
          fields.push property
          directions.push params.sorting[property]

        gridParams =
          column_defs: JSON.stringify @getProcessedColumnDefs(@columnDefs)
          page: params.pageNumber
          per_page: params.perPage
          sort_info: JSON.stringify
            fields: fields
            directions: directions
          filter_params: {}

        if @filterParams
          angular.extend gridParams.filter_params, @filterParams

        return gridParams


      ###*
      # @ngdoc method
      # @name getPagedDataAsync
      #
      # @description
      #
      #
      # @returns {promise}
      ###
      @getPagedDataAsync = ->
        deferred = $q.defer()

        params = @tableParams.$params
        gridParams = @generateGridParams()

        # Merge gridParams to @optParams
        angular.merge(@optParams, gridParams)

        @getEntities().then(
          (success) ->
            deferred.resolve
              items: success.data.items
              totalCount: success.data.total_server_items
        )

        deferred.promise


      ###*
      # @ngdoc method
      # @name sortableClass
      #
      # @description
      # Get CSS class based on sortable state
      #
      # @param {String} fieldName Field/column name
      #
      # @returns {String} class for CSS usage
      ###
      @getProcessedColumnDefs = (columnDefs) ->
        processedColumnDefs = []
        for columnDef in columnDefs
          if columnDef.field isnt ''
            processedColumnDefs.push
              field: columnDef.field

        return processedColumnDefs
  ]


]
