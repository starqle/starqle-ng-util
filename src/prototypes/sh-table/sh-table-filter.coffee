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
# @file_name src/prototypes/sh-table/sh-table-filter.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for table filter
# =============================================================================


shTableModule.run ['$rootScope', ($rootScope) ->


  ###*
  # @ngdoc factory
  # @name shTableHelper
  #
  # @description
  # shTableHelper
  ###
  $rootScope.shTableFilter = [
    '$filter'
    '$injector'
    '$rootScope'
    'HelperService'
    (
      $filter
      $injector
      $rootScope
      HelperService
    ) ->

      self = this

      @filterParams = {} unless @filterParams?
      @filterRegion =
        visible: true # show filter by default


      @form = {}

      #
      # Injection
      #
      $injector.invoke $rootScope.shForm, @form

      # =========================================================================
      # Date filters
      # =========================================================================

      dateParams = {}
      @filterLabel = {}
      @filterCollection = {}

      @prepareFilterDate = (shFilter) ->
        dateParams = {}
        delete @filterParams[shFilter+"_eqdate"]
        delete @filterParams[shFilter+"_lteqdate"]
        delete @filterParams[shFilter+"_gteqdate"]

      @executeFilterDate = () ->
        jQuery.extend @filterParams, dateParams
        @tableParams.$params.pageNumber = 1
        @refreshGrid()

      @filterDateLabel = (keyword, shFilter, n) ->
        switch keyword
          when 'ANY'
            $filter('translate')('LABEL_ALL')

          when 'TODAY'
            $filter('translate')('LABEL_TODAY')

          when 'PAST_N_DAYS'
            $filter('translate')('LABEL_FROM') + ' ' +
            if n is 1
              $filter('translate')('LABEL_YESTERDAY')
            else
              moment().subtract(n, 'days').fromNow()

          when 'PAST_N_WEEKS'
            $filter('translate')('LABEL_FROM') + ' ' +
            moment().subtract(n, 'weeks').fromNow()

          when 'PAST_N_MONTHS'
            $filter('translate')('LABEL_FROM') + ' ' +
            moment().subtract(n, 'months').fromNow()

          when 'PAST_N_YEARS'
            $filter('translate')('LABEL_FROM') + ' ' +
            moment().subtract(n, 'years').fromNow()

          when 'NEXT_N_DAYS'
            if n is 1
              $filter('translate')('LABEL_THRU') + ' ' +
              $filter('translate')('LABEL_TOMORROW')
            else
              moment().add(n, 'days').fromNow() + ' ' +
              $filter('translate')('LABEL_AHEAD')

          when 'NEXT_N_WEEKS'
            moment().add(n, 'weeks').fromNow() + ' ' +
            $filter('translate')('LABEL_AHEAD')

          when 'NEXT_N_MONTHS'
            moment().add(n, 'months').fromNow() + ' ' +
            $filter('translate')('LABEL_AHEAD')

          when 'NEXT_N_YEARS'
            moment().add(n, 'years').fromNow() + ' ' +
            $filter('translate')('LABEL_AHEAD')

      @filterDate = (keyword, shFilter, n) ->
        if keyword in ['RANGE', 'CERTAIN']
          switch keyword
            when 'RANGE'
              fromDate = @filterParams[shFilter+"_gteqdate"]
              thruDate = @filterParams[shFilter+"_lteqdate"]
              @prepareFilterDate(shFilter)
              @filterDateRange(shFilter, fromDate, thruDate)
              @filterLabel[shFilter] = moment(fromDate).format('DD-MM-YYYY')+' - '+moment(thruDate).format('DD-MM-YYYY')
            when 'CERTAIN'
              fromDate = @filterParams[shFilter+"_gteqdate"]
              thruDate = fromDate
              @prepareFilterDate(shFilter)
              @filterDateRange(shFilter, fromDate, thruDate)
              @filterLabel[shFilter] = moment(fromDate).format('DD-MM-YYYY')

        else
          @prepareFilterDate(shFilter)
          switch keyword
            when 'ANY'
              @filterDateAny(shFilter)
            when 'TODAY'
              @filterDateToday(shFilter)

            when 'PAST_N_DAYS'
              @filterDatePastNDays(shFilter, n)
            when 'PAST_N_WEEKS'
              @filterDatePastNWeeks(shFilter, n)
            when 'PAST_N_MONTHS'
              @filterDatePastNMonths(shFilter, n)
            when 'PAST_N_YEARS'
              @filterDatePastNYears(shFilter, n)

            when 'NEXT_N_DAYS'
              @filterDateNextNDays(shFilter, n)
            when 'NEXT_N_WEEKS'
              @filterDateNextNWeeks(shFilter, n)
            when 'NEXT_N_MONTHS'
              @filterDateNextNMonths(shFilter, n)
            when 'NEXT_N_YEARS'
              @filterDateNextNYears(shFilter, n)

          @filterLabel[shFilter] = @filterDateLabel(keyword, shFilter, n)

        @executeFilterDate()


      @filterDateAny = (shFilter) ->
        ### ###

      @filterDateToday = (shFilter) ->
        dateParams[shFilter+"_eqdate"] = moment().format('YYYY-MM-DD')
        return


      @filterDatePastNDays = (shFilter, n) ->
        dateParams[shFilter+"_lteqdate"] = moment().format('YYYY-MM-DD')
        dateParams[shFilter+"_gteqdate"] = moment().subtract(n, 'days').format('YYYY-MM-DD')
        return

      @filterDatePastNWeeks = (shFilter, n) ->
        dateParams[shFilter+"_lteqdate"] = moment().format('YYYY-MM-DD')
        dateParams[shFilter+"_gteqdate"] = moment().subtract(n, 'weeks').format('YYYY-MM-DD')
        return

      @filterDatePastNMonths = (shFilter, n) ->
        dateParams[shFilter+"_lteqdate"] = moment().format('YYYY-MM-DD')
        dateParams[shFilter+"_gteqdate"] = moment().subtract(n, 'months').format('YYYY-MM-DD')
        return

      @filterDatePastNYears = (shFilter, n) ->
        dateParams[shFilter+"_lteqdate"] = moment().format('YYYY-MM-DD')
        dateParams[shFilter+"_gteqdate"] = moment().subtract(n, 'years').format('YYYY-MM-DD')
        return


      @filterDateNextNDays = (shFilter, n) ->
        dateParams[shFilter+"_lteqdate"] = moment().add(n, 'days').format('YYYY-MM-DD')
        dateParams[shFilter+"_gteqdate"] = moment().format('YYYY-MM-DD')
        return

      @filterDateNextNWeeks = (shFilter, n) ->
        dateParams[shFilter+"_lteqdate"] = moment().add(n, 'weeks').format('YYYY-MM-DD')
        dateParams[shFilter+"_gteqdate"] = moment().format('YYYY-MM-DD')
        return

      @filterDateNextNMonths = (shFilter, n) ->
        dateParams[shFilter+"_lteqdate"] = moment().add(n, 'months').format('YYYY-MM-DD')
        dateParams[shFilter+"_gteqdate"] = moment().format('YYYY-MM-DD')
        return

      @filterDateNextNYears = (shFilter, n) ->
        dateParams[shFilter+"_lteqdate"] = moment().add(n, 'years').format('YYYY-MM-DD')
        dateParams[shFilter+"_gteqdate"] = moment().format('YYYY-MM-DD')
        return


      @filterDateRange = (shFilter, fromDate, thruDate) ->
        dateParams[shFilter+"_gteqdate"] = fromDate
        dateParams[shFilter+"_lteqdate"] = thruDate
        return




      # =========================================================================
      # Number filters
      # =========================================================================

      numberParams = {}

      @prepareFilterNumber = (shFilter) ->
        numberParams = {}
        delete @filterParams[shFilter+"_eq"]
        delete @filterParams[shFilter+"_lteq"]
        delete @filterParams[shFilter+"_gteq"]

      @executeFilterNumber = () ->
        jQuery.extend @filterParams, numberParams
        @tableParams.$params.pageNumber = 1
        @refreshGrid()

      @filterNumberLabel = (keyword, shFilter, leftNumber, rightNumber) ->
        leftNumber = numberParams[shFilter+"_gteq"] unless leftNumber?
        rightNumber = numberParams[shFilter+"_lteq"] unless rightNumber?
        eqNumber = if numberParams[shFilter+"_eq"]? then numberParams[shFilter+"_eq"] else leftNumber

        switch keyword
          when 'ANY'
            $filter('translate')('LABEL_ALL')

          when 'BETWEEN'
            $filter('number')(leftNumber) + ' - ' + $filter('number')(rightNumber)

          when 'LOWER_THAN'
            '≤ ' + $filter('number')(rightNumber)

          when 'GREATER_THAN'
            '≥ ' + $filter('number')(leftNumber)

          when 'RANGE'
            if leftNumber? and rightNumber?
              if leftNumber is rightNumber
                $filter('number')(leftNumber)
              else
                $filter('number')(leftNumber) + ' - ' + $filter('number')(rightNumber)
            else if leftNumber?
              '≥ ' + $filter('number')(leftNumber)
            else if rightNumber?
              '≤ ' + $filter('number')(rightNumber)
            else
              $filter('translate')('LABEL_ALL')

          when 'CERTAIN'
            $filter('number')(eqNumber)


      @filterNumber = (keyword, shFilter, leftNumber, rightNumber) ->
        switch keyword
          when 'ANY'
            @prepareFilterNumber(shFilter)
            @filterNumberAny(shFilter)

          when 'BETWEEN'
            @prepareFilterNumber(shFilter)
            @filterNumberRange(shFilter, leftNumber, rightNumber)

          when 'LOWER_THAN'
            rightNumber = @filterParams[shFilter+"_lteq"]
            @prepareFilterNumber(shFilter)
            @filterNumberRange(shFilter, null, rightNumber)

          when 'GREATER_THAN'
            leftNumber = @filterParams[shFilter+"_gteq"]
            @prepareFilterNumber(shFilter)
            @filterNumberRange(shFilter, leftNumber, null)

          when 'RANGE'
            leftNumber = @filterParams[shFilter+"_gteq"]
            rightNumber = @filterParams[shFilter+"_lteq"]
            @prepareFilterNumber(shFilter)
            @filterNumberRange(shFilter, leftNumber, rightNumber)

          when 'CERTAIN'
            eqNumber = @filterParams[shFilter+"_eq"]
            @prepareFilterNumber(shFilter)
            @filterNumberSpecific(shFilter, eqNumber)

        @filterLabel[shFilter] = @filterNumberLabel(keyword, shFilter)

        @executeFilterNumber()


      @filterNumberAny = (shFilter) ->
        return

      @filterNumberSpecific = (shFilter, number) ->
        numberParams[shFilter+"_eq"] = number
        return

      @filterNumberRange = (shFilter, leftNumber, rightNumber) ->
        numberParams[shFilter+"_gteq"] = leftNumber if leftNumber?
        numberParams[shFilter+"_lteq"] = rightNumber if rightNumber?
        if leftNumber? and rightNumber? and leftNumber > rightNumber
          numberParams[shFilter+"_gteq"] = rightNumber
          numberParams[shFilter+"_lteq"] = leftNumber
        return




      # =========================================================================
      # Text filters
      # =========================================================================

      @filterTextCont = (shFilter) ->
        @tableParams.$params.pageNumber = 1
        @refreshGrid()

      @getLabelTextCont = (shFilter) ->
        # empty space ('') is not the same with null
        @filterParams[shFilter+"_cont"] or null

      # =========================================================================
      @filterYearBetween = (shFilter, year) ->
        @filterParams[shFilter + '_month'] = null
        @filterParams[shFilter + '_year'] = year
        @filterParams[shFilter + '_lteqdate'] = year + '-12-31'
        @filterParams[shFilter + '_gteqdate'] = year + '-01-01'
        @refreshGrid()

      @filterMonthBetween = (shFilter, month) ->
        if @filterParams[shFilter + '_year']
          year = @filterParams[shFilter + '_year']
          month = ('00' + month).slice(-2)
          @filterParams[shFilter + '_month'] = month
          mDate = moment(year + '-' + month + '-01')
          @filterParams[shFilter + '_lteqdate'] = mDate.endOf('month').format('YYYY-MM-DD')
          @filterParams[shFilter + '_gteqdate'] = mDate.startOf('month').format('YYYY-MM-DD')
        @refreshGrid()



      # =========================================================================
      # Collection filters
      # =========================================================================

      @filterInCollection = (shFilter, key = null) ->
        if key?
          @filterLabel[shFilter] = @filterCollection[shFilter].map(
            (o) -> $filter('translate') o[key + ''] ).join(', ')
          @filterParams[shFilter + '_in'] =
          @filterCollection[shFilter].map( (o) -> o[key + ''] )
        else
          @filterLabel[shFilter] = @filterCollection[shFilter].map(
            (o) -> $filter('translate') o
          ).join(', ')
          @filterParams[shFilter + '_in'] = @filterCollection[shFilter]
        @refreshGrid()

      @collectionNavbarFilterSelect = (shFilter, item, key = null) ->
        @filterCollection[shFilter] = [] unless @filterCollection[shFilter]?
        HelperService.rowSelect(item, @filterCollection[shFilter], key)
        @filterInCollection(shFilter, key)

      @collectionNavbarFilterDeselect = (shFilter, item, key = null) ->
        @filterCollection[shFilter] = [] unless @filterCollection[shFilter]?
        HelperService.rowDeselect(item, @filterCollection[shFilter], key)
        @filterInCollection(shFilter, key)

      @collectionNavbarFilterIsSelected = (shFilter, item, key = null) ->
        @filterCollection[shFilter] = [] unless @filterCollection[shFilter]?
        HelperService.isRowSelected(item, @filterCollection[shFilter], key)

      @collectionNavbarClearSelection = (shFilter, key = null) ->
        @filterCollection[shFilter] = [] unless @filterCollection[shFilter]?
        HelperService.clearRowSelection(@filterCollection[shFilter])
        @filterInCollection(shFilter, key)

      @collectionNavbarFilterIsSelectionEmpty = (shFilter, key = null) ->
        @filterCollection[shFilter] = [] unless @filterCollection[shFilter]?
        HelperService.isRowSelectionEmpty(@filterCollection[shFilter])


      # =========================================================================
      # Helpers
      # =========================================================================

      @toggleFilterRegion = ->
        @filterRegion.visible = !@filterRegion.visible
        return

      @resetFilter = () ->
        @filterParams = {}
        @filterLabel = {}

        # Clear filter-collections
        for k, v of @filterCollection
          HelperService.clearRowSelection(@filterCollection[k])

        @refreshGrid()

      # Return true if there's no filter
      @isNoFilter = () ->
        jQuery.isEmptyObject @filterParams


      return

  ]


  return


]
