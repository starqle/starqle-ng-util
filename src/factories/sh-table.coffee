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
# @file_name src/factories/sh-table.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains ShTableParams for holding tableParams data inspired by ng-table
# =============================================================================

"use strict"

###*
# @ngdoc module
# @name shTable
#
# @description
# shTable module
###

shTableModule = angular.module('sh.table', [])


###*
# @ngdoc object
# @name ShTableParams
#
# @description
# ShTableParams factory
#
###

shTableModule.factory(
  'ShTableParams'
  ['$q', ($q) ->

    ###*
    # @ngdoc method
    # @name reload
    #
    # @param {}
    #
    # @returns ShTableParams
    #
    # @description
    # ShTableParams self object
    #
    ###

    ShTableParams = (params) ->
      @$params =
        pageNumber: params.pageNumber ? 1
        perPage: params.perPage ? 10
        sortInfo :params.sortInfo
        sorting :params.sorting # Backward compatibility
        autoload: params.autoload ? true


      @$initialized = false

      @$totalCount = 0
      @$loading = false
      @getData = params.getData

      @$data = []

      @$pagination = []


      ###*
      # @ngdoc method
      # @name initialize
      #
      # @param {}
      #
      # @returns promise
      #
      # @description
      # ShTableParams factory
      #
      ###

      @initialize = ->
        @reload()
        @$initialized = true

      ###*
      # @ngdoc method
      # @name reload
      #
      # @param {}
      #
      # @returns promise
      #
      # @description
      # ShTableParams factory
      #
      ###

      @reload = ->
        deferred = $q.defer()

        self = this
        self.$loading = true
        self.getData().then(
          (success) ->
            # Assign returned items to $data
            self.$data = success.items
            self.$totalCount = success.totalCount

            # Call pages generator
            self.$pagination = self.generatePagination(self.$params.pageNumber, self.$params.perPage, self.$totalCount)

            # Disable loading
            self.$loading = false

            # resolve defer
            deferred.resolve success
          (error) ->
            # Disable loading
            self.$loading = false

            # reject defer
            deferred.reject error
        )
        deferred.promise


      ###*
      # @ngdoc method
      # @name isSortBy
      #
      # @param {}
      #
      # @returns promise
      #
      # @description
      # ShTableParams factory
      #
      ###

      @isSortBy = (field, direction) ->
        angular.isDefined(@$params.sorting[field]) && @$params.sorting[field] == direction;


      ###*
      # @ngdoc method
      # @name sortData
      #
      # @param {}
      #
      # @returns promise
      #
      # @description
      # ShTableParams factory
      #
      ###

      @sortData = (field, direction) ->
        @$params.sorting = {}
        @$params.sorting[field] = direction
        @reload()


      ###*
      # @ngdoc method
      # @name generatePagination
      #
      # @param {}
      #
      # @description
      # ShTableParams factory
      #
      ###

      @generatePagination = (pageNumber, perPage, totalCount) ->
        # currentPage
        # pageCount
        # perPage
        # totalCount
        # currentPageCount

        pages = []
        currentPage = pageNumber
        perPage = perPage
        totalCount = totalCount
        pageCount = Math.ceil(totalCount / perPage)
        currentPageCount = if pageCount in [0, currentPage] then (totalCount - perPage * (currentPage - 1)) else perPage

        maxPagesDisplayed = if pageCount > 5 then 5 else pageCount

        deltaCurrent = currentPage - Math.ceil(maxPagesDisplayed/2)
        if deltaCurrent < 0
          deltaCurrent = 0
        else if (deltaCurrent + maxPagesDisplayed) > pageCount
          deltaCurrent = pageCount - maxPagesDisplayed

        # Only generate pagination if there is more than one page exist
        if pageCount > 1
          # Assign PAGE
          fromNumber = deltaCurrent + 1
          thruNumber = deltaCurrent + maxPagesDisplayed
          for number in [fromNumber..thruNumber]
            pages.push
              type: 'PAGE'
              disabled: number is currentPage
              number: number

          # Assign left MORE
          if fromNumber > 1
            pages.unshift
              type: 'MORE'
              disabled: true

          # Assign right MORE
          if thruNumber < pageCount
            pages.push
              type: 'MORE'
              disabled: true

          # Assign PREV
          pages.unshift
            type: 'PREV'
            disabled: currentPage is 1
            number: currentPage - 1

          # Assign NEXT
          pages.push
            type: 'NEXT'
            disabled: currentPage is pageCount
            number: currentPage + 1


          # Assign FIRST
          pages.unshift
            type: 'FIRST'
            disabled: currentPage is 1
            number: 1

          # Assign LAST
          pages.push
            type: 'LAST'
            disabled: currentPage is pageCount
            number: pageCount

        # Return pagination object
        pages: pages
        currentPage: currentPage
        perPage: perPage
        totalCount: totalCount
        pageCount: pageCount
        currentPageCount: currentPageCount


      #
      # Return this
      #
      this

    ShTableParams
  ]
)

# ###*
# # @ngdoc directive
# # @name shTable
# #
# # @description
# # directive
# ###

# shTableModule.directive("shTable", ->
#   restrict: 'A'
#   scope:
#     shTable: '='
#   controller: ['$scope', ($scope) ->
#     $scope.$watch(
#       'params'
#       (newVal) ->
#         console.log 'newVal', newVal
#         if newVal? and not newVal
#           $scope.params.initialize()
#       true
#     )
#     return
#   ]
#   controllerAs: 'shTableController'
#   compile: (element) ->
#     (scope, element, attrs) ->
#       console.log 'scope.shTable', scope.shTable
#       scope.params = scope.shTable
#       return
# )



###*
# @ngdoc directive
# @name shTable
#
# @description
# directive
###

shTableModule.directive("shTablePagination", ->
  restrict: 'A'
  transclude: true
  scope:
    shTablePagination: '='
    shTablePaginationAction: '&'
  template: '''
      <div ng-if="shTablePagination.totalCount > 10" class="pagination form-inline pull-left">
        <select ng-model='perPage' ng-change="shTablePaginationAction({pageNumber: 1, perPage: perPage})" ng-options="perPage for perPage in getPerPages()" class="form-control text-right"></select>&nbsp;
        &nbsp;
        &nbsp;
      </div>

      <ul class="pagination pull-left">
        <li ng-class="{'disabled': page.disabled}" ng-repeat="page in shTablePagination.pages" ng-switch="page.type">
          <a ng-switch-when="FIRST" ng-click="shTablePaginationAction({pageNumber: page.number})">«</a>
          <a ng-switch-when="PREV" ng-click="shTablePaginationAction({pageNumber: page.number})">&lt;</a>
          <a ng-switch-when="PAGE" ng-click="shTablePaginationAction({pageNumber: page.number})">
            <span ng-bind="page.number"></span>
          </a>
          <a ng-switch-when="MORE">…</a>
          <a ng-switch-when="NEXT" ng-click="shTablePaginationAction({pageNumber: page.number})">&gt;</a>
          <a ng-switch-when="LAST" ng-click="shTablePaginationAction({pageNumber: page.number})">»</a>
        </li>
      </ul>

      <div class="pagination pull-left">
        <div class="btn disabled">
          <span class="page-count">
            &nbsp;{{shTablePagination.currentPageCount}}&nbsp;
          </span>
          <span>
            <em translate="LABEL_OF"></em>
          </span>
          <span class="page-total">
            &nbsp;{{shTablePagination.totalCount}}&nbsp;
          </span>
        </div>
      </div>

      <div class="pagination pull-left">
        <div ng-click="shTablePaginationAction()" class="btn">
          <i class="fa fa-refresh"></i>
        </div>
      </div>
    '''
  controller: ['$scope', ($scope) ->
    $scope.perPage = 10
    $scope.getPerPages = () ->
      [10, 20, 50, 100]
    return
  ]

)
