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
# @file_name app/scripts/directives/sh-table/sh-table-pagination.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains sh-table-pagination directive
# =============================================================================

"use strict"

###*
# @ngdoc directive
# @name shTablePagination
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
        <li ng-repeat="page in shTablePagination.pages" ng-switch="page.type">
          <a ng-switch-when="FIRST" ng-disabled="page.disabled" ng-click="shTablePaginationAction({pageNumber: page.number})">«</a>
          <a ng-switch-when="PREV" ng-disabled="page.disabled" ng-click="shTablePaginationAction({pageNumber: page.number})">&lt;</a>
          <a ng-switch-when="PAGE" ng-disabled="page.disabled" ng-click="shTablePaginationAction({pageNumber: page.number})">
            <span ng-bind="page.number"></span>
          </a>
          <a ng-switch-when="MORE" ng-disabled="page.disabled">…</a>
          <a ng-switch-when="NEXT" ng-disabled="page.disabled" ng-click="shTablePaginationAction({pageNumber: page.number})">&gt;</a>
          <a ng-switch-when="LAST" ng-disabled="page.disabled" ng-click="shTablePaginationAction({pageNumber: page.number})">»</a>
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
