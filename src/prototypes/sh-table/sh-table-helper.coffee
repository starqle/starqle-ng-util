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
# @file_name src/prototypes/sh-table/sh-table-helper.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for controlling api request on table-like data.
# =============================================================================

"use strict"

shTableModule.run ['$rootScope', ($rootScope) ->


  ###*
  # @ngdoc factory
  # @name shTableHelper
  #
  # @description
  # shTableHelper
  ###
  $rootScope.shTableHelper = [
    '$q'
    (
      $q
    ) ->

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
      @sortableClass = (fieldName) ->
        if @tableParams.isSortBy(fieldName, 'asc')
          'sortable sort-asc'
        else if @tableParams.isSortBy(fieldName, 'desc')
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
      @sortableClick = (fieldName) ->
        newDirection = if @tableParams.isSortBy(fieldName, 'asc') then 'desc' else 'asc'
        @tableParams.sortData(fieldName, newDirection)


      ###*
      # @ngdoc method
      # @name rowEventClass
      #
      # @description
      # Get CSS class based on state
      #
      # @param {Object} entity Entity object
      #
      # @returns {String} class for CSS usage
      ###
      @rowRestEventClass = (entity) ->
        if @deletedIds.indexOf(entity.id) >= 0
          'recently-deleted'
        else if @updatedIds.indexOf(entity.id) >= 0
          'recently-updated'
        else if @сreatedIds.indexOf(entity.id) >= 0
          'recently-created'
        else
          ''
  ]


]
