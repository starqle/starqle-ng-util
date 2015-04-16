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
# @file_name src/prototypes/sh-init-ng-table.coffee
# @author Giovanni Sakti
# @email giosakti@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for controllers that utilize ng-table.
# =============================================================================

"use strict"

angular.module('sh.init.ng.table', []).run ['$rootScope', '$templateCache', 'ngTableParams', ($rootScope, $templateCache, ngTableParams) ->

  # ===========================================================================
  # initNgTable Prototype
  # ===========================================================================

  $rootScope.initNgTable = ['$scope', '$timeout', '$filter', ($scope, $timeout, $filter) ->

    $scope.recentlyCreatedIds = []
    $scope.recentlyUpdatedIds = []
    $scope.recentlyDeletedIds = []

    $scope.asyncBlock = false unless $scope.asyncBlock?

    $scope.pagingOptions =
      currentPage: 1
      pageSize: 10
      pageSizes: [10, 25, 50, 100]

    unless $scope.sorting?
      # Default sorting is descending id
      $scope.sorting =
        id: "desc"

    $scope.tableParams = new ngTableParams(
      page: $scope.pagingOptions.currentPage
      count: $scope.pagingOptions.pageSize
      sorting: $scope.sorting
    ,
      total: 0 # length of data
      getData: ($defer, params) ->
        $scope.tableParamsGetData =
          defer: $defer
          params: params
        $scope.refreshGrid()
    )

    $scope.refreshGrid = (currentPage = null) ->
      # TODO: @ralibi should be able to set page & per_page
      $scope.getPagedDataAsync()

    $scope.generateGridParams = ->
      $defer = $scope.tableParamsGetData.defer
      params = $scope.tableParamsGetData.params

      fields = []
      directions = []
      for property of params.$params.sorting
        fields.push property
        directions.push params.$params.sorting[property]

      gridParams =
        column_defs: JSON.stringify $scope.getProcessedColumnDefs($scope.columnDefs)
        page: params.$params.page
        per_page: params.$params.count
        sort_info: JSON.stringify
          fields: fields
          directions: directions
        filter_params: {}

      if $scope.filterParams
        $.extend gridParams.filter_params, $scope.filterParams

      return gridParams

    $scope.getPagedDataAsync = ->
      if $scope.asyncBlock is false
        $scope.asyncBlock = true

        $timeout (->
          $defer = $scope.tableParamsGetData.defer
          params = $scope.tableParamsGetData.params
          gridParams = $scope.generateGridParams()

          $scope.resource.get(
            $.extend gridParams, $scope.optParams
          ).$promise.then((success) ->

            # Update table params
            params.total success.data.total_server_items

            # Set new data
            $defer.resolve success.data.items
            $scope.tableParams.reload()

            # Callback after getPagedDataAsync
            $scope.getPagedDataAsyncSuccess(success) if $scope.getPagedDataAsyncSuccess? && typeof($scope.getPagedDataAsyncSuccess) == 'function'

            $scope.asyncBlock = false
            return
          , (error) ->
            $scope.asyncBlock = false
          )
        ), 100

    $scope.getProcessedColumnDefs = (columnDefs) ->
      processedColumnDefs = []
      for columnDef in columnDefs
        if columnDef.field isnt ''
          processedColumnDefs.push
            field: columnDef.field

      return processedColumnDefs

    # =========================================================================
    # Callbacks
    # =========================================================================

    $scope.getPagedDataAsyncSuccess = (response) ->
      # Overide in children controller

    # =========================================================================
    # Additional Methods
    # =========================================================================

    # Called from ng-class as <th> attributes within ng-table
    # Returns either '', 'sort-asc', or 'sort-desc'
    $scope.sortableClass = (fieldName) ->
      if $scope.tableParams.isSortBy(fieldName, 'asc')
        'sort-asc'
      else if $scope.tableParams.isSortBy(fieldName, 'desc')
        'sort-desc'

    # Called from ng-click as <th> attributes within ng-table
    # Call ng-table tableParams sorting
    $scope.sortableClick = (fieldName) ->
      newDirection = 'asc'
      newDirection = 'desc' if $scope.tableParams.isSortBy(fieldName, 'asc')
      $scope.tableParams.sorting(fieldName, newDirection)

    $scope.exportToXls = ->
      if $scope.xlsPath
        $defer = $scope.tableParamsGetData.defer
        params = $scope.tableParamsGetData.params
        gridParams = $scope.generateGridParams()

        $.extend gridParams, $scope.optParams
        $.extend gridParams,
          username: $rootScope.currentUser.username
          authn_token: $rootScope.authToken

        elementId = 'xls' + moment()
        xlsFullpath = "#{$scope.xlsPath}?#{$.param gridParams}"
        $('body').append("<iframe id='" + elementId + "' style='display: none;' src='" + xlsFullpath + "'></iframe>")
        $("#" + elementId).load () ->
          setTimeout () ->
            $("#" + elementId).remove()
          , 50

      return

    # Method related to ng-table for generating pagination
    $scope.getGeneratedPagesArray = ->
      $scope.tableParams.generatePagesArray($scope.tableParams.page(), $scope.tableParams.total(), $scope.tableParams.count())

    $scope.pages = $scope.getGeneratedPagesArray()

    # Explicitely assign pages when ng-table reloaded
    $scope.$on('ngTableAfterReloadData', () ->
      $scope.pages = $scope.getGeneratedPagesArray()
    , true)
  ]
]
