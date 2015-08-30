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
# @file_name src/prototypes/sh-ng-table-filter.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for controllers that utilize ng-table-filter
# =============================================================================

"use strict"

angular.module('sh.ng.table.filter', []).run ['$rootScope', '$filter', ($rootScope, $filter) ->

  $rootScope.ngTableFilter = ['$scope', ($scope) ->
    $scope.filterParams = {}
    $scope.filterRegion =
      visible: true # show filter by default

    # =========================================================================
    # Date filters
    # =========================================================================

    # $scope.filterDateAnyday = (navbarFilter) ->
    #   angular.extend $scope.filterParams,
    #     navbarFilter

    dateParams = {}
    $scope.filterLabel = {}

    $scope.prepareFilterDate = (navbarFilter) ->
      dateParams = {}
      delete $scope.filterParams[navbarFilter+"_eqdate"]
      delete $scope.filterParams[navbarFilter+"_lteqdate"]
      delete $scope.filterParams[navbarFilter+"_gteqdate"]

    $scope.executeFilterDate = () ->
      angular.extend $scope.filterParams, dateParams
      $scope.tableParamsGetData.params.$params.page = 1
      $scope.refreshGrid()

    $scope.filterDateAny = (navbarFilter) ->
      $scope.prepareFilterDate(navbarFilter)
      $scope.executeFilterDate()

    $scope.filterDateToday = (navbarFilter) ->
      $scope.prepareFilterDate(navbarFilter)
      dateParams[navbarFilter+"_eqdate"] = moment().format('YYYY-MM-DD')
      $scope.executeFilterDate()

    $scope.filterDatePastNDays = (navbarFilter, n) ->
      $scope.prepareFilterDate(navbarFilter)
      dateParams[navbarFilter+"_lteqdate"] = moment().format('YYYY-MM-DD')
      dateParams[navbarFilter+"_gteqdate"] = moment().subtract('days', n).format('YYYY-MM-DD')
      $scope.executeFilterDate()

    $scope.filterDatePastNWeeks = (navbarFilter, n) ->
      $scope.prepareFilterDate(navbarFilter)
      dateParams[navbarFilter+"_lteqdate"] = moment().format('YYYY-MM-DD')
      dateParams[navbarFilter+"_gteqdate"] = moment().subtract('weeks', n).format('YYYY-MM-DD')
      $scope.executeFilterDate()

    $scope.filterDatePastNMonths = (navbarFilter, n) ->
      $scope.prepareFilterDate(navbarFilter)
      dateParams[navbarFilter+"_lteqdate"] = moment().format('YYYY-MM-DD')
      dateParams[navbarFilter+"_gteqdate"] = moment().subtract('months', n).format('YYYY-MM-DD')
      $scope.executeFilterDate()

    $scope.filterDatePastNYears = (navbarFilter, n) ->
      $scope.prepareFilterDate(navbarFilter)
      dateParams[navbarFilter+"_lteqdate"] = moment().format('YYYY-MM-DD')
      dateParams[navbarFilter+"_gteqdate"] = moment().subtract('years', n).format('YYYY-MM-DD')
      $scope.executeFilterDate()

    $scope.filterDateRange = (navbarFilter) ->
      fromDate = $scope.filterParams[navbarFilter+"_gteqdate"]
      thruDate = $scope.filterParams[navbarFilter+"_lteqdate"]
      $scope.prepareFilterDate(navbarFilter)

      $scope.filterLabel[navbarFilter] = fromDate + ' - ' + thruDate
      dateParams[navbarFilter+"_gteqdate"] = fromDate
      dateParams[navbarFilter+"_lteqdate"] = thruDate
      $scope.executeFilterDate()
      angular.element("#date-filter-#{navbarFilter}-modal").modal('hide')
      return

    $scope.openDateFilterModal = (navbarFilter) ->
      angular.element("#date-filter-#{navbarFilter}-modal").modal('show')
      return

    # =========================================================================
    # Number filters
    # =========================================================================

    numberParams = {}

    $scope.prepareFilterNumber = (navbarFilter) ->
      numberParams = {}
      delete $scope.filterParams[navbarFilter+"_eq"]
      delete $scope.filterParams[navbarFilter+"_tleq"]
      delete $scope.filterParams[navbarFilter+"_gteq"]

    $scope.executeFilterNumber = () ->
      angular.extend $scope.filterParams, numberParams
      $scope.tableParamsGetData.params.$params.page = 1
      $scope.refreshGrid()

    $scope.filterNumberAny = (navbarFilter) ->
      $scope.prepareFilterNumber(navbarFilter)
      $scope.executeFilterNumber()

    $scope.filterNumberRange = (navbarFilter, leftNumber, rightNumber) ->
      if leftNumber
        $scope.prepareFilterNumber(navbarFilter)
        numberParams[navbarFilter+"_tleq"] = rightNumber
        numberParams[navbarFilter+"_gteq"] = leftNumber
        $scope.executeFilterNumber()
      else
        # From modal
        fromNumber = $scope.filterParams[navbarFilter+"_gteq"]
        thruNumber = $scope.filterParams[navbarFilter+"_tleq"]
        $scope.prepareFilterDate(navbarFilter)
        $scope.filterLabel[navbarFilter] = $filter('number')(parseInt(fromNumber), 0) + ' - ' + $filter('number')(parseInt(thruNumber), 0)
        dateParams[navbarFilter+"_gteq"] = fromNumber
        dateParams[navbarFilter+"_tleq"] = thruNumber
        $scope.executeFilterDate()
        angular.element("#number-filter-#{navbarFilter}-modal").modal('hide')
        return

    $scope.openNumberFilterModal = (navbarFilter) ->
      angular.element("#number-filter-#{navbarFilter}-modal").modal('show')
      return

    # =========================================================================
    # Text filters
    # =========================================================================

    $scope.filterTextCont = (navbarFilter) ->
      $scope.tableParamsGetData.params.$params.page = 1
      $scope.refreshGrid()

    # =========================================================================
    # Helpers
    # =========================================================================

    $scope.toggleFilterRegion = ->
      $scope.filterRegion.visible = !$scope.filterRegion.visible

    $scope.resetFilter = () ->
      $scope.filterParams = {}
      $scope.refreshGrid()

    # Return true if there's no filter
    $scope.isNoFilter = () ->
      $.isEmptyObject $scope.filterParams

    return
  ]
]
