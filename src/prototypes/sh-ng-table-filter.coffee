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
    #   $.extend $scope.filterParams,
    #     navbarFilter

    dateParams = {}
    $scope.filterLabel = {}

    $scope.prepareFilterDate = (navbarFilter) ->
      dateParams = {}
      delete $scope.filterParams[navbarFilter+"Eqdate"]
      delete $scope.filterParams[navbarFilter+"Lteqdate"]
      delete $scope.filterParams[navbarFilter+"Gteqdate"]

    $scope.executeFilterDate = () ->
      $.extend $scope.filterParams, dateParams
      $scope.tableParamsGetData.params.$params.page = 1
      $scope.refreshGrid()

    $scope.filterDateAny = (navbarFilter) ->
      $scope.prepareFilterDate(navbarFilter)
      $scope.executeFilterDate()

    $scope.filterDateToday = (navbarFilter) ->
      $scope.prepareFilterDate(navbarFilter)
      dateParams[navbarFilter+"Eqdate"] = moment().format('YYYY-MM-DD')
      $scope.executeFilterDate()

    $scope.filterDatePastNDays = (navbarFilter, n) ->
      $scope.prepareFilterDate(navbarFilter)
      dateParams[navbarFilter+"Lteqdate"] = moment().format('YYYY-MM-DD')
      dateParams[navbarFilter+"Gteqdate"] = moment().subtract('days', n).format('YYYY-MM-DD')
      $scope.executeFilterDate()

    $scope.filterDatePastNWeeks = (navbarFilter, n) ->
      $scope.prepareFilterDate(navbarFilter)
      dateParams[navbarFilter+"Lteqdate"] = moment().format('YYYY-MM-DD')
      dateParams[navbarFilter+"Gteqdate"] = moment().subtract('weeks', n).format('YYYY-MM-DD')
      $scope.executeFilterDate()

    $scope.filterDatePastNMonths = (navbarFilter, n) ->
      $scope.prepareFilterDate(navbarFilter)
      dateParams[navbarFilter+"Lteqdate"] = moment().format('YYYY-MM-DD')
      dateParams[navbarFilter+"Gteqdate"] = moment().subtract('months', n).format('YYYY-MM-DD')
      $scope.executeFilterDate()

    $scope.filterDatePastNYears = (navbarFilter, n) ->
      $scope.prepareFilterDate(navbarFilter)
      dateParams[navbarFilter+"Lteqdate"] = moment().format('YYYY-MM-DD')
      dateParams[navbarFilter+"Gteqdate"] = moment().subtract('years', n).format('YYYY-MM-DD')
      $scope.executeFilterDate()

    $scope.filterDateRange = (navbarFilter) ->
      fromDate = $scope.filterParams[navbarFilter+"Gteqdate"]
      thruDate = $scope.filterParams[navbarFilter+"Lteqdate"]
      $scope.prepareFilterDate(navbarFilter)
      
      $scope.filterLabel[navbarFilter] = fromDate + ' - ' + thruDate
      dateParams[navbarFilter+"Gteqdate"] = fromDate
      dateParams[navbarFilter+"Lteqdate"] = thruDate
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
      delete $scope.filterParams[navbarFilter+"Eq"]
      delete $scope.filterParams[navbarFilter+"Lteq"]
      delete $scope.filterParams[navbarFilter+"Gteq"]

    $scope.executeFilterNumber = () ->
      $.extend $scope.filterParams, numberParams
      $scope.tableParamsGetData.params.$params.page = 1
      $scope.refreshGrid()

    $scope.filterNumberAny = (navbarFilter) ->
      $scope.prepareFilterNumber(navbarFilter)
      $scope.executeFilterNumber()

    $scope.filterNumberRange = (navbarFilter, leftNumber, rightNumber) ->
      if leftNumber
        $scope.prepareFilterNumber(navbarFilter)
        numberParams[navbarFilter+"Lteq"] = rightNumber
        numberParams[navbarFilter+"Gteq"] = leftNumber
        $scope.executeFilterNumber()
      else
        # From modal
        fromNumber = $scope.filterParams[navbarFilter+"Gteq"]
        thruNumber = $scope.filterParams[navbarFilter+"Lteq"]
        $scope.prepareFilterDate(navbarFilter)
        $scope.filterLabel[navbarFilter] = $filter('number')(parseInt(fromNumber), 0) + ' - ' + $filter('number')(parseInt(thruNumber), 0)
        dateParams[navbarFilter+"Gteq"] = fromNumber
        dateParams[navbarFilter+"Lteq"] = thruNumber
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
