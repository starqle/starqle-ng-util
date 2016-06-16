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
# @note This file contains ShTableHook for holding tableParams data inspired by ng-table
# =============================================================================

###*
# @ngdoc object
# @name ShTableHook
#
# @description
# ShTableHook factory
#
###

shTableModule.factory(
  'ShTableHook'
  [
    '$q'
    'localStorageService'
    'ShApi'
    'ShApiHook'
    'ShTableHookNotification'
    (
      $q
      localStorageService
      ShApi
      ShApiHook
      ShTableHookNotification
    ) ->

      ShTableHook = (params) ->

        # Variables
        self = this

        self.shTable = params.shTable


        self.shTable.resource ?= null
        self.shTable.entity ?= {}
        self.shTable.lookup ?= {}
        self.shTable.optParams ?= {}

        self.shTable.createdIds = []
        self.shTable.updatedIds = []
        self.shTable.deletedIds = []


        # Hooks Variables
        self.shTable.beforeGetEntitiesHooks = []
        self.shTable.getEntitiesSuccessHooks = []
        self.shTable.getEntitiesErrorHooks = []
        self.shTable.afterGetEntitiesHooks = []

        self.shTable.beforeNewEntityHooks = []
        self.shTable.newEntitySuccessHooks = []
        self.shTable.newEntityErrorHooks = []
        self.shTable.afterNewEntityHooks = []

        self.shTable.beforeCreateEntityHooks = []
        self.shTable.createEntitySuccessHooks = []
        self.shTable.createEntityErrorHooks = []
        self.shTable.afterCreateEntityHooks = []

        self.shTable.beforeEditEntityHooks = []
        self.shTable.editEntitySuccessHooks = []
        self.shTable.editEntityErrorHooks = []
        self.shTable.afterEditEntityHooks = []

        self.shTable.beforeUpdateEntityHooks = []
        self.shTable.updateEntitySuccessHooks = []
        self.shTable.updateEntityErrorHooks = []
        self.shTable.afterUpdateEntityHooks = []

        self.shTable.beforeDeleteEntityHooks = []
        self.shTable.deleteEntitySuccessHooks = []
        self.shTable.deleteEntityErrorHooks = []
        self.shTable.afterDeleteEntityHooks = []


        # Invokes
        shApi = new ShApi(
          resource: self.shTable.resource
        )

        shApiHook = new ShApiHook(
          shApiInstance: self.shTable
        )

        shTableHookNotification = new ShTableHookNotification(
          shTable: self.shTable
        )


        ###*
        # @ngdoc method
        # @name getEntities
        #
        # @description
        # Get list of entities based on `optParams`
        #
        # @returns {promise}
        ###
        self.shTable.getEntities = () ->
          hook() for hook in self.shTable.beforeGetEntitiesHooks
          deferred = $q.defer()

          # GEt the entities
          shApi.index(
            self.shTable.optParams
          ).then(
            (success) ->
              hook(success) for hook in self.shTable.getEntitiesSuccessHooks
              deferred.resolve success

            (error) ->
              hook(error) for hook in self.shTable.getEntitiesErrorHooks
              deferred.reject error

          ).finally(
            () ->
              hook() for hook in self.shTable.afterGetEntitiesHooks
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
        self.shTable.newEntity = () ->
          hook() for hook in self.shTable.beforeNewEntityHooks
          deferred = $q.defer()

          # Fetch blank entity
          shApi.new(
            self.shTable.optParams
          ).then(
            (success) ->
              self.shTable.entity = success.data
              self.shTable.lookup = success.lookup if success.lookup?

              hook(success) for hook in self.shTable.newEntitySuccessHooks
              deferred.resolve success

            (error) ->
              hook(error) for hook in self.shTable.newEntityErrorHooks
              deferred.reject error

          ).finally(
            () ->
              hook() for hook in self.shTable.afterNewEntityHooks
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
        self.shTable.createEntity = (entity) ->
          hook() for hook in self.shTable.beforeCreateEntityHooks
          deferred = $q.defer()

          # Check if the entity is a FormData (Useful for file uploaded form)
          data = {data: entity}
          if Object.prototype.toString.call(entity).slice(8, -1) is 'FormData'
            data = entity

          # Persist an entity into database
          shApi.create(
            self.shTable.optParams
            data
          ).then(
            (success) ->
              self.shTable.createdIds.push success.data.id
              self.shTable.entity = success.data
              self.shTable.lookup = success.lookup if success.lookup?
              self.shTable.refreshGrid()

              hook(success) for hook in self.shTable.createEntitySuccessHooks
              deferred.resolve(success)

            (error) ->
              hook(error) for hook in self.shTable.createEntityErrorHooks
              deferred.reject(error)

          ).finally(
            () ->
              hook() for hook in self.shTable.afterCreateEntityHooks
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
        self.shTable.editEntity = (id) ->
          hook() for hook in self.shTable.beforeEditEntityHooks
          deferred = $q.defer()

          # Fetch entity for editing
          shApi.edit(
            id
            self.shTable.optParams
          ).then(
            (success) ->
              self.shTable.entity = success.data
              self.shTable.lookup = success.lookup if success.lookup?

              hook(success) for hook in self.shTable.editEntitySuccessHooks
              deferred.resolve(success)

            (error) ->
              hook(error) for hook in self.shTable.editEntityErrorHooks
              deferred.reject(error)

          ).finally(
            () ->
              hook() for hook in self.shTable.afterEditEntityHooks
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
        self.shTable.updateEntity = (id, entity) ->
          hook() for hook in self.shTable.beforeUpdateEntityHooks
          deferred = $q.defer()

          # Check if the entity is a FormData (Useful for file uploaded form)
          data = {data: entity}
          if Object.prototype.toString.call(entity).slice(8, -1) is 'FormData'
            data = entity

          # Update entity into database
          shApi.update(
            id
            self.shTable.optParams
            data
          ).then(
            (success) ->
              self.shTable.updatedIds.push success.data.id
              self.shTable.entity = success.data
              self.shTable.lookup = success.lookup if success.lookup?
              self.shTable.refreshGrid()

              hook(success) for hook in self.shTable.updateEntitySuccessHooks
              deferred.resolve(success)

            (error) ->
              hook(error) for hook in self.shTable.updateEntityErrorHooks
              deferred.reject(error)

          ).finally(
            () ->
              hook() for hook in self.shTable.afterUpdateEntityHooks
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
        self.shTable.deleteEntity = (id) ->
          hook() for hook in self.shTable.beforeDeleteEntityHooks
          deferred = $q.defer()

          # Delete entity from database
          shApi.delete(
            id
            self.shTable.optParams
          ).then(
            (success) ->
              self.shTable.deletedIds.push id
              self.shTable.refreshGrid()

              hook(success) for hook in self.shTable.deleteEntitySuccessHooks
              deferred.resolve(success)

            (error) ->
              hook(error) for hook in self.shTable.deleteEntityErrorHooks
              deferred.reject(error)

          ).finally(
            () ->
              hook() for hook in self.shTable.afterDeleteEntityHooks
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
        self.shTable.getLookup = (key) ->
          self.shTable.lookup?[key]



        #
        # Return this/self
        #
        this

      #
      # Return ShTableHook
      #
      ShTableHook
  ]
)
