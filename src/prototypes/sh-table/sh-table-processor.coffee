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


shTableModule.run ['$rootScope', ($rootScope) ->


  ###*
  # @ngdoc factory
  # @name shTableProcessor
  #
  # @description
  # shTableProcessor
  #
  ###
  $rootScope.shTableProcessor = [
    '$injector'
    (
      $injector
    ) ->


      ###*
      # @ngdoc method
      # @name generateGridParams
      #
      # @description
      # Generate appropriate GET parameters from `tableParams.$params`.
      # Providing `column_defs`, `page`, `per_page`, `sort_info`, and `filter_params`
      #
      # @returns {Object} Grid params object
      ###
      @generateGridParams = (opts) ->
        params = opts.params

        fields = []
        directions = []
        for property of params.sorting
          fields.push property
          directions.push params.sorting[property]

        gridParams =
          column_defs: JSON.stringify @getProcessedColumnDefs(opts.columnDefs)
          page: params.pageNumber
          per_page: params.perPage
          sort_info: JSON.stringify
            fields: fields
            directions: directions
          filter_params: {}

        if opts.filterParams
          angular.extend gridParams.filter_params, opts.filterParams

        return gridParams


      ###*
      # @ngdoc method
      # @name getProcessedColumnDefs
      #
      # @description
      # Returns processedColumnDefs
      #
      # @param Array columnDefs
      #
      # @returns Array class for CSS usage
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
