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
# @note This file contains ShTableFilter for holding tableParams data inspired by ng-table
# =============================================================================

###*
# @ngdoc object
# @name ShTableFilter
#
# @description
# ShTableFilter factory
#
###

shTableModule.factory(
  'ShTableFilter'
  [
    '$filter'
    'HelperService'
    (
      $filter
      HelperService
    ) ->

      ShTableFilter = (params) ->

        self = this

        self.shTable = params.shTable

        self.shTable.filterParams ?= {}
        self.shTable.filterRegion =
          visible: true # show filter by default

        # =========================================================================
        # Date filters
        # =========================================================================

        dateParams = {}
        self.shTable.filterLabel = {}
        self.shTable.filterCollection = {}

        self.shTable.prepareFilterDate = (shFilter) ->
          dateParams = {}
          delete self.shTable.filterParams[shFilter+"_eqdate"]
          delete self.shTable.filterParams[shFilter+"_lteqdate"]
          delete self.shTable.filterParams[shFilter+"_gteqdate"]

        self.shTable.executeFilterDate = () ->
          jQuery.extend self.shTable.filterParams, dateParams
          self.shTable.tableParams.$params.pageNumber = 1
          self.shTable.refreshGrid()

        self.shTable.filterDateLabel = (keyword, shFilter, n) ->
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

        self.shTable.filterDate = (keyword, shFilter, n) ->
          if keyword in ['RANGE', 'CERTAIN']
            switch keyword
              when 'RANGE'
                fromDate = self.shTable.filterParams[shFilter+"_gteqdate"]
                thruDate = self.shTable.filterParams[shFilter+"_lteqdate"]
                self.shTable.prepareFilterDate(shFilter)
                self.shTable.filterDateRange(shFilter, fromDate, thruDate)
                self.shTable.filterLabel[shFilter] = moment(fromDate).format('DD-MM-YYYY')+' - '+moment(thruDate).format('DD-MM-YYYY')
              when 'CERTAIN'
                fromDate = self.shTable.filterParams[shFilter+"_gteqdate"]
                thruDate = fromDate
                self.shTable.prepareFilterDate(shFilter)
                self.shTable.filterDateRange(shFilter, fromDate, thruDate)
                self.shTable.filterLabel[shFilter] = moment(fromDate).format('DD-MM-YYYY')

          else
            self.shTable.prepareFilterDate(shFilter)
            switch keyword
              when 'ANY'
                self.shTable.filterDateAny(shFilter)
              when 'TODAY'
                self.shTable.filterDateToday(shFilter)

              when 'PAST_N_DAYS'
                self.shTable.filterDatePastNDays(shFilter, n)
              when 'PAST_N_WEEKS'
                self.shTable.filterDatePastNWeeks(shFilter, n)
              when 'PAST_N_MONTHS'
                self.shTable.filterDatePastNMonths(shFilter, n)
              when 'PAST_N_YEARS'
                self.shTable.filterDatePastNYears(shFilter, n)

              when 'NEXT_N_DAYS'
                self.shTable.filterDateNextNDays(shFilter, n)
              when 'NEXT_N_WEEKS'
                self.shTable.filterDateNextNWeeks(shFilter, n)
              when 'NEXT_N_MONTHS'
                self.shTable.filterDateNextNMonths(shFilter, n)
              when 'NEXT_N_YEARS'
                self.shTable.filterDateNextNYears(shFilter, n)

            self.shTable.filterLabel[shFilter] = self.shTable.filterDateLabel(keyword, shFilter, n)

          self.shTable.executeFilterDate()


        self.shTable.filterDateAny = (shFilter) ->
          ### ###

        self.shTable.filterDateToday = (shFilter) ->
          dateParams[shFilter+"_eqdate"] = moment().format('YYYY-MM-DD')
          return


        self.shTable.filterDatePastNDays = (shFilter, n) ->
          dateParams[shFilter+"_lteqdate"] = moment().format('YYYY-MM-DD')
          dateParams[shFilter+"_gteqdate"] = moment().subtract(n, 'days').format('YYYY-MM-DD')
          return

        self.shTable.filterDatePastNWeeks = (shFilter, n) ->
          dateParams[shFilter+"_lteqdate"] = moment().format('YYYY-MM-DD')
          dateParams[shFilter+"_gteqdate"] = moment().subtract(n, 'weeks').format('YYYY-MM-DD')
          return

        self.shTable.filterDatePastNMonths = (shFilter, n) ->
          dateParams[shFilter+"_lteqdate"] = moment().format('YYYY-MM-DD')
          dateParams[shFilter+"_gteqdate"] = moment().subtract(n, 'months').format('YYYY-MM-DD')
          return

        self.shTable.filterDatePastNYears = (shFilter, n) ->
          dateParams[shFilter+"_lteqdate"] = moment().format('YYYY-MM-DD')
          dateParams[shFilter+"_gteqdate"] = moment().subtract(n, 'years').format('YYYY-MM-DD')
          return


        self.shTable.filterDateNextNDays = (shFilter, n) ->
          dateParams[shFilter+"_lteqdate"] = moment().add(n, 'days').format('YYYY-MM-DD')
          dateParams[shFilter+"_gteqdate"] = moment().format('YYYY-MM-DD')
          return

        self.shTable.filterDateNextNWeeks = (shFilter, n) ->
          dateParams[shFilter+"_lteqdate"] = moment().add(n, 'weeks').format('YYYY-MM-DD')
          dateParams[shFilter+"_gteqdate"] = moment().format('YYYY-MM-DD')
          return

        self.shTable.filterDateNextNMonths = (shFilter, n) ->
          dateParams[shFilter+"_lteqdate"] = moment().add(n, 'months').format('YYYY-MM-DD')
          dateParams[shFilter+"_gteqdate"] = moment().format('YYYY-MM-DD')
          return

        self.shTable.filterDateNextNYears = (shFilter, n) ->
          dateParams[shFilter+"_lteqdate"] = moment().add(n, 'years').format('YYYY-MM-DD')
          dateParams[shFilter+"_gteqdate"] = moment().format('YYYY-MM-DD')
          return


        self.shTable.filterDateRange = (shFilter, fromDate, thruDate) ->
          dateParams[shFilter+"_gteqdate"] = fromDate
          dateParams[shFilter+"_lteqdate"] = thruDate
          return




        # =========================================================================
        # Number filters
        # =========================================================================

        numberParams = {}

        self.shTable.prepareFilterNumber = (shFilter) ->
          numberParams = {}
          delete self.shTable.filterParams[shFilter+"_eq"]
          delete self.shTable.filterParams[shFilter+"_lteq"]
          delete self.shTable.filterParams[shFilter+"_gteq"]

        self.shTable.executeFilterNumber = () ->
          jQuery.extend self.shTable.filterParams, numberParams
          self.shTable.tableParams.$params.pageNumber = 1
          self.shTable.refreshGrid()

        self.shTable.filterNumberLabel = (keyword, shFilter, leftNumber, rightNumber) ->
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


        self.shTable.filterNumber = (keyword, shFilter, leftNumber, rightNumber) ->
          switch keyword
            when 'ANY'
              self.shTable.prepareFilterNumber(shFilter)
              self.shTable.filterNumberAny(shFilter)

            when 'BETWEEN'
              self.shTable.prepareFilterNumber(shFilter)
              self.shTable.filterNumberRange(shFilter, leftNumber, rightNumber)

            when 'LOWER_THAN'
              rightNumber = self.shTable.filterParams[shFilter+"_lteq"]
              self.shTable.prepareFilterNumber(shFilter)
              self.shTable.filterNumberRange(shFilter, null, rightNumber)

            when 'GREATER_THAN'
              leftNumber = self.shTable.filterParams[shFilter+"_gteq"]
              self.shTable.prepareFilterNumber(shFilter)
              self.shTable.filterNumberRange(shFilter, leftNumber, null)

            when 'RANGE'
              leftNumber = self.shTable.filterParams[shFilter+"_gteq"]
              rightNumber = self.shTable.filterParams[shFilter+"_lteq"]
              self.shTable.prepareFilterNumber(shFilter)
              self.shTable.filterNumberRange(shFilter, leftNumber, rightNumber)

            when 'CERTAIN'
              eqNumber = self.shTable.filterParams[shFilter+"_eq"]
              self.shTable.prepareFilterNumber(shFilter)
              self.shTable.filterNumberSpecific(shFilter, eqNumber)

          self.shTable.filterLabel[shFilter] = self.shTable.filterNumberLabel(keyword, shFilter)

          self.shTable.executeFilterNumber()


        self.shTable.filterNumberAny = (shFilter) ->
          return

        self.shTable.filterNumberSpecific = (shFilter, number) ->
          numberParams[shFilter+"_eq"] = number
          return

        self.shTable.filterNumberRange = (shFilter, leftNumber, rightNumber) ->
          numberParams[shFilter+"_gteq"] = leftNumber if leftNumber?
          numberParams[shFilter+"_lteq"] = rightNumber if rightNumber?
          if leftNumber? and rightNumber? and leftNumber > rightNumber
            numberParams[shFilter+"_gteq"] = rightNumber
            numberParams[shFilter+"_lteq"] = leftNumber
          return




        # =========================================================================
        # Text filters
        # =========================================================================

        self.shTable.filterTextCont = (shFilter) ->
          self.shTable.tableParams.$params.pageNumber = 1
          self.shTable.filterParams['fromShFilter'] = true
          self.shTable.refreshGrid()

        self.shTable.getLabelTextCont = (shFilter) ->
          # empty space ('') is not the same with null
          self.shTable.filterParams[shFilter+"_cont"] or null

        # =========================================================================
        self.shTable.filterYearBetween = (shFilter, year) ->
          self.shTable.filterParams[shFilter + '_month'] = null
          self.shTable.filterParams[shFilter + '_year'] = year
          self.shTable.filterParams[shFilter + '_lteqdate'] = year + '-12-31'
          self.shTable.filterParams[shFilter + '_gteqdate'] = year + '-01-01'
          self.shTable.filterParams['fromShFilter'] = true
          self.shTable.refreshGrid()

        self.shTable.filterMonthBetween = (shFilter, month) ->
          if self.shTable.filterParams[shFilter + '_year']
            year = self.shTable.filterParams[shFilter + '_year']
            month = ('00' + month).slice(-2)
            self.shTable.filterParams[shFilter + '_month'] = month
            mDate = moment(year + '-' + month + '-01')
            self.shTable.filterParams[shFilter + '_lteqdate'] = mDate.endOf('month').format('YYYY-MM-DD')
            self.shTable.filterParams[shFilter + '_gteqdate'] = mDate.startOf('month').format('YYYY-MM-DD')
          self.shTable.filterParams['fromShFilter'] = true
          self.shTable.refreshGrid()



        # =========================================================================
        # Collection filters
        # =========================================================================

        self.shTable.filterInCollection = (shFilter, key = null) ->
          if key?
            self.shTable.filterLabel[shFilter] = self.shTable.filterCollection[shFilter].map(
              (o) -> $filter('translate') o[key + ''] ).join(', ')
            self.shTable.filterParams[shFilter + '_in'] =
            self.shTable.filterCollection[shFilter].map( (o) -> o[key + ''] )
          else
            self.shTable.filterLabel[shFilter] = self.shTable.filterCollection[shFilter].map(
              (o) -> $filter('translate') o
            ).join(', ')
            self.shTable.filterParams[shFilter + '_in'] = self.shTable.filterCollection[shFilter]
          self.shTable.filterParams['fromShFilter'] = true
          self.shTable.refreshGrid()

        self.shTable.collectionNavbarFilterSelect = (shFilter, item, key = null) ->
          self.shTable.filterCollection[shFilter] = [] unless self.shTable.filterCollection[shFilter]?
          HelperService.rowSelect(item, self.shTable.filterCollection[shFilter], key)
          self.shTable.filterInCollection(shFilter, key)

        self.shTable.collectionNavbarFilterDeselect = (shFilter, item, key = null) ->
          self.shTable.filterCollection[shFilter] = [] unless self.shTable.filterCollection[shFilter]?
          HelperService.rowDeselect(item, self.shTable.filterCollection[shFilter], key)
          self.shTable.filterInCollection(shFilter, key)

        self.shTable.collectionNavbarFilterIsSelected = (shFilter, item, key = null) ->
          self.shTable.filterCollection[shFilter] = [] unless self.shTable.filterCollection[shFilter]?
          HelperService.isRowSelected(item, self.shTable.filterCollection[shFilter], key)

        self.shTable.collectionNavbarClearSelection = (shFilter, key = null) ->
          self.shTable.filterCollection[shFilter] = [] unless self.shTable.filterCollection[shFilter]?
          HelperService.clearRowSelection(self.shTable.filterCollection[shFilter])
          self.shTable.filterInCollection(shFilter, key)

        self.shTable.collectionNavbarFilterIsSelectionEmpty = (shFilter, key = null) ->
          self.shTable.filterCollection[shFilter] = [] unless self.shTable.filterCollection[shFilter]?
          HelperService.isRowSelectionEmpty(self.shTable.filterCollection[shFilter])

        # =========================================================================
        # Radio filters
        # =========================================================================
        self.shTable.filterRadio = {}

        self.shTable.filterInRadio = (shFilter, key = null) ->
          if key?
            self.shTable.filterLabel[shFilter] =          self.shTable.filterRadio[shFilter]?[key + '']
            self.shTable.filterParams[shFilter + '_eq'] = self.shTable.filterRadio[shFilter]?[key + '']
          else
            self.shTable.filterLabel[shFilter] =          self.shTable.filterRadio[shFilter]
            self.shTable.filterParams[shFilter + '_eq'] = self.shTable.filterRadio[shFilter]

          self.shTable.tableParams.$params.pageNumber = 1
          self.shTable.filterParams['fromShFilter'] = true
          self.shTable.refreshGrid()

        self.shTable.radioNavbarFilterSelect = (shFilter, item, key = null) ->
          self.shTable.filterRadio[shFilter] = item
          self.shTable.filterInRadio(shFilter, key)

        self.shTable.radioNavbarFilterDeselect = (shFilter, item, key = null) ->
          self.shTable.filterRadio[shFilter] = null
          self.shTable.filterInRadio(shFilter, key)

        self.shTable.radioNavbarFilterIsSelected = (shFilter, item, key = null) ->
          if key?
            self.shTable.filterRadio[shFilter]?[key + ''] is item[key + '']
          else
            self.shTable.filterRadio[shFilter] is item

        self.shTable.radioNavbarClearSelection = (shFilter, key = null) ->
          self.shTable.filterRadio[shFilter] = null
          self.shTable.filterInRadio(shFilter, key)

        self.shTable.radioNavbarFilterIsSelectionEmpty = (shFilter, key = null) ->
          self.shTable.filterRadio[shFilter] is null

        # =========================================================================
        # Helpers
        # =========================================================================

        self.shTable.toggleFilterRegion = ->
          self.shTable.filterRegion.visible = !self.shTable.filterRegion.visible
          return

        self.shTable.resetFilter = () ->
          self.shTable.filterParams = {}
          self.shTable.filterLabel = {}
          self.shTable.filterRadio = {}

          # Clear filter-collections
          for k, v of self.shTable.filterCollection
            HelperService.clearRowSelection(self.shTable.filterCollection[k])

          self.shTable.filterParams['fromShFilter'] = true
          self.shTable.refreshGrid()

        # Return true if there's no filter
        self.shTable.isNoFilter = () ->
          jQuery.isEmptyObject self.shTable.filterParams



        #
        # Return this/self
        #
        this



      #
      # Return ShTableFilter
      #
      ShTableFilter
  ]
)
