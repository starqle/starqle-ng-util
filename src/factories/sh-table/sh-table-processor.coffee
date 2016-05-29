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
# @note This file contains ShTableProcessor for holding tableParams data inspired by ng-table
# =============================================================================

###*
# @ngdoc object
# @name ShTableProcessor
#
# @description
# ShTableProcessor factory
#
###

shTableModule.factory(
  'ShTableProcessor'
  [
    () ->

      ShTableProcessor = () ->

        # Variables
        self = this

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
        self.generateGridParams = (opts) ->
          params = opts.params

          fields = []
          directions = []
          for property of params.sorting
            fields.push property
            directions.push params.sorting[property]

          gridParams =
            page: params.pageNumber
            per_page: params.perPage
            sort_info: JSON.stringify
              fields: fields
              directions: directions
            filter_params: {}
            column_defs: JSON.stringify self.getProcessedColumnDefs(opts.columnDefs)

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
        self.getProcessedColumnDefs = (columnDefs) ->
          processedColumnDefs = []
          for columnDef in columnDefs
            if columnDef.field isnt ''
              processedColumnDefs.push
                field: columnDef.field

          return processedColumnDefs


        #
        # Return this/self
        #
        this

      #
      # Return ShTableProcessor
      #
      ShTableProcessor
  ]
)
