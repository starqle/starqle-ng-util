# =============================================================================
# Copyright (c) 2013 All Right Reserved, http://starqle.com/
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
# @file_name src/prototypes/sh-bulk-helper.coffee
# @author Bimo Horizon
# @email bimo@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains bulk helper prototype.
# =============================================================================

"use strict"

angular.module('sh.bulk.helper', []).run ['$rootScope', ($rootScope) ->
  $rootScope.bulkHelper = ['$scope', ($scope) ->

    # =========================================================================
    # Assignments
    # =========================================================================

    $scope.selectedEntities = []

    # =========================================================================
    # Scope Methods
    # =========================================================================

    $scope.selectAll = (items) ->
      activeItems = $scope.activeItems(items)

      if $scope.selectedItems(activeItems).length is activeItems.length
        activeItems.forEach (item) ->
          item.$selected = false
      else
        activeItems.forEach (item) ->
          item.$selected = true

    $scope.updateSelectedEntities = (items) ->
      activeItems = $scope.activeItems(items)
      $scope.selectedEntities = $scope.selectedItems(activeItems)

    $scope.activeItems = (items) ->
      if items instanceof Array
        items.filter (item) ->
          return $scope.recentlyDeletedIds.indexOf(item.id) < 0

    $scope.selectedItems = (items) ->
      if items instanceof Array
        activeItems = $scope.activeItems(items)
        (i.id) for i in (activeItems.filter (item) -> return !!item.$selected)
  ]
]
