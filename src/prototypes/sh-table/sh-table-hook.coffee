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
# @file_name src/prototypes/sh-table/sh-table-hook.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for controlling api request on table-like data.
# =============================================================================

"use strict"

shTableModule.run ['$rootScope', ($rootScope) ->


  ###*
  # @ngdoc factory
  # @name shTableHook
  #
  # @description
  # ShTableRest
  ###
  $rootScope.shTableHook = [
    '$q'
    '$injector'
    (
      $q
      $injector
    ) ->

      self = this

      @resource = null unless @resource?
      @entity = {} unless @entity?
      @lookup = {} unless @lookup?
      @optParams = {} unless @optParams?

      @сreatedIds = []
      @updatedIds = []
      @deletedIds = []


      @shApi =
        resource: self.resource


      # Hooks Variables
      @beforeGetEntitiesHooks = []
      @getEntitiesSuccessHooks = []
      @getEntitiesErrorHooks = []
      @afterGetEntitiesHooks = []

      @beforeNewEntityHooks = []
      @newEntitySuccessHooks = []
      @newEntityErrorHooks = []
      @afterNewEntityHooks = []

      @beforeCreateEntityHooks = []
      @createEntitySuccessHooks = []
      @createEntityErrorHooks = []
      @afterCreateEntityHooks = []

      @beforeEditEntityHooks = []
      @editEntitySuccessHooks = []
      @editEntityErrorHooks = []
      @afterEditEntityHooks = []

      @beforeUpdateEntityHooks = []
      @updateEntitySuccessHooks = []
      @updateEntityErrorHooks = []
      @afterUpdateEntityHooks = []

      @beforeDeleteEntityHooks = []
      @deleteEntitySuccessHooks = []
      @deleteEntityErrorHooks = []
      @afterDeleteEntityHooks = []


      ###*
      # @ngdoc method
      # @name getEntities
      #
      # @description
      # Get list of entities based on `optParams`
      #
      # @returns {promise}
      ###
      @getEntities = () ->
        hook() for hook in self.beforeGetEntitiesHooks
        deferred = $q.defer()

        # GEt the entities
        @shApi.index(
          @optParams
        ).then(
          (success) ->
            hook(success) for hook in self.getEntitiesSuccessHooks
            deferred.resolve success

          (error) ->
            hook(error) for hook in self.getEntitiesErrorHooks
            deferred.reject error

        ).finally(
          () ->
            hook() for hook in self.afterGetEntitiesHooks
        )
        deferred.promise



      ###*
      # @ngdoc method
      # @name newEntity
      #
      # @description
      # New an entity
      #
      # @returns {promise}
      ###
      @newEntity = () ->
        hook() for hook in self.beforeNewEntityHooks
        deferred = $q.defer()

        # Fetch blank entity
        @shApi.new(
          @optParams
        ).then(
          (success) ->
            self.entity = success.data
            self.lookup = success.lookup if success.lookup?

            hook(success) for hook in self.newEntitySuccessHooks
            deferred.resolve success

          (error) ->
            hook(error) for hook in self.newEntityErrorHooks
            deferred.reject error

        ).finally(
          () ->
            hook() for hook in self.afterNewEntityHooks
        )
        deferred.promise


      ###*
      # @ngdoc method
      # @name createEntity
      #
      # @description
      # Create/persist an entity to database
      #
      # @param {Object} entity Entity object which should not contain an id
      #
      # @returns {promise}
      ###
      @createEntity = (entity) ->
        hook() for hook in self.beforeCreateEntityHooks
        deferred = $q.defer()

        # Check if the entity is a FormData (Useful for file uploaded form)
        data = {data: entity}
        if Object.prototype.toString.call(entity).slice(8, -1) is 'FormData'
          data = entity

        # Persist an entity into database
        @shApi.create(
          @optParams
          data
        ).then(
          (success) ->
            self.сreatedIds.push success.data.id
            self.entity = success.data
            self.lookup = success.lookup if success.lookup?
            self.refreshGrid()

            hook(success) for hook in self.createEntitySuccessHooks
            deferred.resolve(success)

          (error) ->
            hook(error) for hook in self.createEntityErrorHooks
            deferred.reject(error)

        ).finally(
          () ->
            hook() for hook in self.afterCreateEntityHooks
        )
        deferred.promise



      ###*
      # @ngdoc method
      # @name editEntity
      #
      # @description
      # Edit an entity
      #
      # @param {String} id Entity id in string or UUID
      #
      # @returns {promise}
      ###
      @editEntity = (id) ->
        hook() for hook in self.beforeEditEntityHooks
        deferred = $q.defer()

        # Fetch entity for editing
        @shApi.edit(
          id
          @optParams
        ).then(
          (success) ->
            self.entity = success.data
            self.lookup = success.lookup if success.lookup?

            hook(success) for hook in self.editEntitySuccessHooks
            deferred.resolve(success)

          (error) ->
            hook(error) for hook in self.editEntityErrorHooks
            deferred.reject(error)

        ).finally(
          () ->
            hook() for hook in self.afterEditEntityHooks
        )
        deferred.promise



      ###*
      # @ngdoc method
      # @name updateEntity
      #
      # @description
      # Update an entity
      #
      # @param {String} id Entity id in string or UUID
      # @param {Object} entity Entity object which should contain an id
      #
      # @returns {promise}
      ###
      @updateEntity = (id, entity) ->
        hook() for hook in self.beforeUpdateEntityHooks
        deferred = $q.defer()

        # Check if the entity is a FormData (Useful for file uploaded form)
        data = {data: entity}
        if Object.prototype.toString.call(entity).slice(8, -1) is 'FormData'
          data = entity

        # Update entity into database
        @shApi.update(
          id
          @optParams
          data
        ).then(
          (success) ->
            self.updatedIds.push success.data.id
            self.entity = success.data
            self.lookup = success.lookup if success.lookup?
            self.refreshGrid()

            hook(success) for hook in self.updateEntitySuccessHooks
            deferred.resolve(success)

          (error) ->
            hook(error) for hook in self.updateEntityErrorHooks
            deferred.reject(error)

        ).finally(
          () ->
            hook() for hook in self.afterUpdateEntityHooks
        )
        deferred.promise



      ###*
      # @ngdoc method
      # @name deleteEntity
      #
      # @description
      # Delete an entity
      #
      # @param {String} id Entity id in string or UUID
      #
      # @returns {promise}
      ###
      @deleteEntity = (id) ->
        hook() for hook in self.beforeDeleteEntityHooks
        deferred = $q.defer()

        # Delete entity from database
        @shApi.delete(
          id
          @optParams
        ).then(
          (success) ->
            self.deletedIds.push id
            self.refreshGrid()

            hook(success) for hook in self.deleteEntitySuccessHooks
            deferred.resolve(success)

          (error) ->
            hook(error) for hook in self.deleteEntityErrorHooks
            deferred.reject(error)

        ).finally(
          () ->
            hook() for hook in self.afterDeleteEntityHooks
        )
        deferred.promise



      ###*
      # @ngdoc method
      # @name getLookup
      #
      # @description
      # Return an array of objects
      #
      # @param {String} key The expected local lookups key
      #
      # @returns {Object|Array} Reference to `obj`.
      ###
      @getLookup = (key) ->
        self.lookup?[key]



      # Invokes

      $injector.invoke $rootScope.shApi, @shApi
      $injector.invoke $rootScope.shTableHookNotification, self



      return


  ]


]
