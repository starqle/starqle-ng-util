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
# @note This file contains ShTableHelper for holding tableParams data inspired by ng-table
# =============================================================================

###*
# @ngdoc object
# @name ShTableHelper
#
# @description
# ShTableHelper factory
#
###

shTableModule.factory(
  'ShTableHelper'
  [
    '$q'
    (
      $q
    ) ->

      ShTableHelper = (params) ->

        # Variables
        self = this

        self.shTable = params.shTable

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
        self.shTable.sortableClass = (fieldName) ->
          if self.shTable.tableParams.isSortBy(fieldName, 'asc')
            'sortable sort-asc'
          else if self.shTable.tableParams.isSortBy(fieldName, 'desc')
            'sortable sort-desc'
          else
            'sortable'


        ###*
        # @ngdoc method
        # @name sortableClick
        #
        # @description
        # Called from ng-click as <th> attributes within ng-table
        # Call ng-table tableParams sorting
        #
        # @param {String} fieldName Field/column name
        #
        # @returns {String} class for CSS usage
        ###
        self.shTable.sortableClick = (fieldName) ->
          newDirection = if self.shTable.tableParams.isSortBy(fieldName, 'asc') then 'desc' else 'asc'
          self.shTable.tableParams.sortData(fieldName, newDirection)
          self.shTable.refreshGrid()
          return


        ###*
        # @ngdoc method
        # @name rowRestEventClass
        #
        # @description
        # Get CSS class based on state
        # Priority is important. `'recently-deleted'` must come first, then `'recently-updated'` and `'recently-created'`
        #
        # @param {Object} entity Entity object or string `UUID`
        #
        # @returns {String} class for CSS usage
        ###
        self.shTable.rowRestEventClass = (obj) ->
          return 'recently-deleted' if self.shTable.isRecentlyDeleted(obj)
          return 'recently-updated' if self.shTable.isRecentlyUpdated(obj)
          return 'recently-created' if self.shTable.isRecentlyCreated(obj)
          return ''


        ###*
        # @ngdoc method
        # @name isRecentlyCreated
        #
        # @description
        # Return true if given object/entity/entity-id is recently created (found in createdIds)
        #
        # @param {Object} entity Entity object or string `UUID`
        #
        # @returns {Boolean}
        ###
        self.shTable.isRecentlyCreated = (obj) ->
          self.shTable.createdIds.indexOf(obj?.id or obj) >= 0



        ###*
        # @ngdoc method
        # @name isRecentlyUpdated
        #
        # @description
        # Return true if given object/entity/entity-id is recently updated (found in updatedIds)
        #
        # @param {Object} entity Entity object or string `UUID`
        #
        # @returns {Boolean}
        ###
        self.shTable.isRecentlyUpdated = (obj) ->
          self.shTable.updatedIds.indexOf(obj?.id or obj) >= 0



        ###*
        # @ngdoc method
        # @name isRecentlyDeleted
        #
        # @description
        # Return true if given object/entity/entity-id is recently deleted (found in deletedIds)
        #
        # @param {Object} entity Entity object or string `UUID`
        #
        # @returns {Boolean}
        ###
        self.shTable.isRecentlyDeleted = (obj) ->
          self.shTable.deletedIds.indexOf(obj?.id or obj) >= 0

        #
        # Return this/self
        #
        this



      #
      # Return ShTableHelper
      #
      ShTableHelper
  ]
)
