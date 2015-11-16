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
# @file_name src/prototypes/sh-init-ng-table.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for controlling api request on table-like data.
# =============================================================================

"use strict"

angular.module('sh.init.table', []).run ['$rootScope', ($rootScope) ->

  # ===========================================================================
  # initShTable Prototype
  # ===========================================================================

  $rootScope.initShTable = [
    '$q'
    '$scope'
    'ShTableParams'
    (
      $q
      $scope
      ShTableParams
    ) ->

      #
      # Variables
      #
      @errors = []
      @localLookup = {}
      @callbackOptions = {}
      @entity = {}

      @recentlyCreatedIds = []
      @recentlyUpdatedIds = []
      @recentlyDeletedIds = []

      # Default sorting is descending id
      @sorting = id: "desc" unless @sorting?

      self = this

      @tableParams = new ShTableParams(
        pageNumber: 1
        perPage: 10
        sortInfo: 'this is sort info'
        sorting: @sorting
        getData: () ->
          self.getPagedDataAsync()
      )

      @goToPage = (pageNumber, perPage) ->
        if pageNumber?
          @tableParams.$params.perPage = perPage or @tableParams.$params.perPage
          @tableParams.$params.pageNumber = pageNumber

        # Manually refresh with current page
        @refreshGrid()

      @refreshGrid = () ->
        @tableParams.reload()

      @generateGridParams = ->
        # $defer = @tableParamsGetData.defer
        params = @tableParams.$params

        fields = []
        directions = []
        for property of params.sorting
          fields.push property
          directions.push params.sorting[property]

        gridParams =
          column_defs: JSON.stringify @getProcessedColumnDefs(@columnDefs)
          page: params.pageNumber
          per_page: params.perPage
          sort_info: JSON.stringify
            fields: fields
            directions: directions
          filter_params: {}

        if @filterParams
          angular.extend gridParams.filter_params, @filterParams

        return gridParams

      @getPagedDataAsync = ->
        deferred = $q.defer()

        @beforeGetPagedData()
        # $defer = @tableParamsGetData.defer
        params = @tableParams.$params
        gridParams = @generateGridParams()

        @resource.get(
          angular.extend gridParams, @optParams
        ).$promise.then(
          (success) ->
            # Set new data
            deferred.resolve
              items: success.data.items
              totalCount: success.data.total_server_items

            # Callback after getPagedDataAsync
            self.getPagedDataAsyncSuccess(success) if self.getPagedDataAsyncSuccess? && typeof(self.getPagedDataAsyncSuccess) == 'function'

          (error) ->
            deferred.reject error
        ).finally(
          () ->
            ### ###
        )

        deferred.promise

      @getProcessedColumnDefs = (columnDefs) ->
        processedColumnDefs = []
        for columnDef in columnDefs
          if columnDef.field isnt ''
            processedColumnDefs.push
              field: columnDef.field

        return processedColumnDefs

      # =========================================================================
      # Callbacks
      # =========================================================================

      @getPagedDataAsyncSuccess = (response) ->
        # Overide in children controller

      @beforeGetPagedData = () ->
        ### Befor Get PAge Data Callback ###

      # =========================================================================
      # Additional Methods
      # =========================================================================

      # Called from ng-class as <th> attributes within ng-table
      # Returns either '', 'sort-asc', or 'sort-desc'
      @sortableClass = (fieldName) ->
        if @tableParams.isSortBy(fieldName, 'asc')
          'sortable sort-asc'
        else if @tableParams.isSortBy(fieldName, 'desc')
          'sortable sort-desc'
        else
          'sortable'

      # Called from ng-click as <th> attributes within ng-table
      # Call ng-table tableParams sorting
      @sortableClick = (fieldName) ->
        newDirection = 'asc'
        newDirection = 'desc' if @tableParams.isSortBy(fieldName, 'asc')
        @tableParams.sortData(fieldName, newDirection)


      # =========================================================================
      # Save
      # =========================================================================

      @saveEntity = (entity) ->
        (@callbackOptions.beforeSaveEntity || angular.noop)()

        # Update entity in database
        if entity.id?
          @updateEntity(entity)
        else # Persist entity into database
          @createEntity(entity)

      # =========================================================================
      # Create
      # =========================================================================

      @fetchNewEntity = ->
        deferred = $q.defer()
        (@callbackOptions.beforeNewEntity || angular.noop)()

        # Clear the entity before fetching new entity
        @clearEntity()

        # Fetch blank entity
        @resource.new(
          angular.extend({}, @optParams)
        ).$promise.then(
          (success) ->
            self.setEntity(success.data)
            self.localLookup = success.lookup
            (self.newEntitySuccess || angular.noop)(success)
            deferred.resolve(success)
          (error) ->
            deferred.reject(error)
        )
        deferred.promise


      @createEntity = (entity) ->
        deferred = $q.defer()
        (@beforeCreateEntity || angular.noop)()

        # Persist entity into database
        @resource.save(
          angular.extend({}, @optParams)
          data: entity
        ).$promise.then(
          (success) ->
            self.recentlyCreatedIds.push success.data.id
            self.setEntity(success.data)
            self.refreshGrid()
            (self.createEntitySuccess || angular.noop)(success)
            deferred.resolve(success)
          (error) ->
            @errors = error.data.error.errors
            (self.createEntityFailure || angular.noop)(error)
            deferred.reject(error)
        )
        deferred.promise

      # =========================================================================
      # Update
      # =========================================================================


      @fetchEditEntity = (id) ->
        deferred = $q.defer()
        # @beforeEditEntity(id)

        # Clear the entity before fetching existing entity
        @clearEntity()

        # Fetch entity for editing
        @resource.edit(
          angular.extend({id: id}, @optParams)
        ).$promise.then(
          (success) ->
            self.setEntity(success.data)
            self.localLookup = success.lookup
            (self.editEntitySuccess || angular.noop)(success, id)
            deferred.resolve(success)
          (error) ->
            (self.editEntityFailure || angular.noop)(error, id)
            deferred.reject(error)
        )
        deferred.promise

      @updateEntity = (entity) ->
        deferred = $q.defer()
        (@beforeUpdateEntity || angular.noop)()

        # Update entity into database
        @resource.update(
          angular.extend({id: entity.id}, @optParams)
          data: entity
        ).$promise.then(
          (success) ->
            self.recentlyUpdatedIds.push success.data.id
            self.setEntity(success.data)
            self.refreshGrid()
            (self.updateEntitySuccess || angular.noop)(success)
            deferred.resolve(success)
          (error) ->
            # @errors = error.data.error.errors
            (self.updateEntityFailure || angular.noop)(error)
            deferred.reject(error)
        )
        deferred.promise

      # =========================================================================
      # Destroy
      # =========================================================================

      @destroyEntity = (id, name='this entry') ->
        deferred = $q.defer()
        (@beforeDestroyEntity || angular.noop)()

        # Delete entity from database
        @resource.delete(
          angular.extend({id: id}, @optParams)
        ).$promise.then(
          (success) ->
            self.recentlyDeletedIds.push id
            (self.destroyEntitySuccess || angular.noop)(success)
            deferred.resolve(success)
          (error) ->
            (self.destroyEntityFailure || angular.noop)(error)
            deferred.reject(error)
        )
        deferred.promise

      @deleteEntity = (id, name='this entry') ->
        @destroyEntity(id, name)

      @setEntity = (entity) ->
        @entity = angular.copy(entity, {})

      @clearEntity = () ->
        @setEntity({})

      @rowEvent = (entity) ->
        if @recentlyDeletedIds.indexOf(entity.id) >= 0
          'recently-deleted'
        else if @recentlyUpdatedIds.indexOf(entity.id) >= 0
          'recently-updated'
        else if @recentlyCreatedIds.indexOf(entity.id) >= 0
          'recently-created'
        else
          'else'


      @tableParams.initialize()
  ]
]
