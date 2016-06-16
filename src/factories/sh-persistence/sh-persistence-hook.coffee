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
# @note This file contains ShPersistenceHook for holding tableParams data inspired by ng-table
# =============================================================================

###*
# @ngdoc object
# @name ShPersistenceHook
#
# @description
# ShPersistenceHook factory
#
###

shPersistenceModule.factory(
  'ShPersistenceHook'
  [
    '$q'
    'ShApi'
    'ShApiHook'
    'ShPersistenceHookNotification'
    (
      $q
      ShApi
      ShApiHook
      ShPersistenceHookNotification
    ) ->

      ShPersistenceHook = (params) ->

        # Variables
        self = this

        self.shPersistence = params.shPersistence


        self.shPersistence.id ?= null
        self.shPersistence.resource ?= null
        self.shPersistence.entity ?= {}
        self.shPersistence.lookup ?= {}
        self.shPersistence.optParams ?= {}


        # Hooks Variables

        self.shPersistence.beforeNewEntityHooks = []
        self.shPersistence.newEntitySuccessHooks = []
        self.shPersistence.newEntityErrorHooks = []
        self.shPersistence.afterNewEntityHooks = []

        self.shPersistence.beforeCreateEntityHooks = []
        self.shPersistence.createEntitySuccessHooks = []
        self.shPersistence.createEntityErrorHooks = []
        self.shPersistence.afterCreateEntityHooks = []

        self.shPersistence.beforeEditEntityHooks = []
        self.shPersistence.editEntitySuccessHooks = []
        self.shPersistence.editEntityErrorHooks = []
        self.shPersistence.afterEditEntityHooks = []

        self.shPersistence.beforeUpdateEntityHooks = []
        self.shPersistence.updateEntitySuccessHooks = []
        self.shPersistence.updateEntityErrorHooks = []
        self.shPersistence.afterUpdateEntityHooks = []

        self.shPersistence.beforeDeleteEntityHooks = []
        self.shPersistence.deleteEntitySuccessHooks = []
        self.shPersistence.deleteEntityErrorHooks = []
        self.shPersistence.afterDeleteEntityHooks = []

        self.shPersistence.beforeInitEntityHooks = []
        self.shPersistence.initEntitySuccessHooks = []
        self.shPersistence.initEntityErrorHooks = []
        self.shPersistence.afterInitEntityHooks = []


        # Invokes
        shApi = new ShApi(
          resource: self.shPersistence.resource
        )

        shApiHook = new ShApiHook(
          shApiInstance: self.shPersistence
        )

        shPersistenceHookNotification = new ShPersistenceHookNotification(
          shPersistence: self.shPersistence
        )


        ###*
        # @ngdoc method
        # @name newEntity
        #
        # @description
        # New an entity
        #
        # @returns {promise}
        ###
        self.shPersistence.newEntity = () ->
          hook() for hook in self.shPersistence.beforeNewEntityHooks
          deferred = $q.defer()

          # Fetch blank entity
          shApi.new(
            self.shPersistence.optParams
          ).then(
            (success) ->
              self.shPersistence.entity = success.data
              self.shPersistence.lookup = success.lookup if success.lookup?

              hook(success) for hook in self.shPersistence.newEntitySuccessHooks
              deferred.resolve success

            (error) ->
              hook(error) for hook in self.shPersistence.newEntityErrorHooks
              deferred.reject error

          ).finally(
            () ->
              hook() for hook in self.shPersistence.afterNewEntityHooks
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
        self.shPersistence.createEntity = (entity) ->
          hook() for hook in self.shPersistence.beforeCreateEntityHooks
          deferred = $q.defer()

          # Check if the entity is a FormData (Useful for file uploaded form)
          data = {data: entity}
          if Object.prototype.toString.call(entity).slice(8, -1) is 'FormData'
            data = entity

          # Persist an entity into database
          shApi.create(
            self.shPersistence.optParams
            data
          ).then(
            (success) ->
              self.shPersistence.entity = success.data
              self.shPersistence.lookup = success.lookup if success.lookup?

              hook(success) for hook in self.shPersistence.createEntitySuccessHooks
              deferred.resolve(success)

            (error) ->
              hook(error) for hook in self.shPersistence.createEntityErrorHooks
              deferred.reject(error)

          ).finally(
            () ->
              hook() for hook in self.shPersistence.afterCreateEntityHooks
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
        self.shPersistence.editEntity = (id) ->
          hook() for hook in self.shPersistence.beforeEditEntityHooks
          deferred = $q.defer()

          # Allow edit without providing parameter id. (self.shPersistence.edit)
          id = self.shPersistence.id unless id

          # Fetch entity for editing
          shApi.edit(
            id
            self.shPersistence.optParams
          ).then(
            (success) ->
              self.shPersistence.entity = success.data
              self.shPersistence.lookup = success.lookup if success.lookup?

              hook(success) for hook in self.shPersistence.editEntitySuccessHooks
              deferred.resolve(success)

            (error) ->
              hook(error) for hook in self.shPersistence.editEntityErrorHooks
              deferred.reject(error)

          ).finally(
            () ->
              hook() for hook in self.shPersistence.afterEditEntityHooks
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
        self.shPersistence.updateEntity = (id, entity) ->
          hook() for hook in self.shPersistence.beforeUpdateEntityHooks
          deferred = $q.defer()

          # Allow edit without providing parameter id. (self.shPersistence.update)
          if angular.isObject(id)
            entity = id
            id = self.shPersistence.id

          # Check if the entity is a FormData (Useful for file uploaded form)
          data = {data: entity}
          if Object.prototype.toString.call(entity).slice(8, -1) is 'FormData'
            data = entity

          # Update entity into database
          shApi.update(
            id
            self.shPersistence.optParams
            data
          ).then(
            (success) ->
              self.shPersistence.entity = success.data
              self.shPersistence.lookup = success.lookup if success.lookup?

              hook(success) for hook in self.shPersistence.updateEntitySuccessHooks
              deferred.resolve(success)

            (error) ->
              hook(error) for hook in self.shPersistence.updateEntityErrorHooks
              deferred.reject(error)

          ).finally(
            () ->
              hook() for hook in self.shPersistence.afterUpdateEntityHooks
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
        self.shPersistence.deleteEntity = (id) ->
          hook() for hook in self.shPersistence.beforeDeleteEntityHooks
          deferred = $q.defer()

          # Allow delete without providing parameter id. (self.shPersistence.delete)
          id = self.shPersistence.id unless id

          # Delete entity from database
          shApi.delete(
            id
            self.shPersistence.optParams
          ).then(
            (success) ->
              hook(success) for hook in self.shPersistence.deleteEntitySuccessHooks
              deferred.resolve(success)

            (error) ->
              hook(error) for hook in self.shPersistence.deleteEntityErrorHooks
              deferred.reject(error)

          ).finally(
            () ->
              hook() for hook in self.shPersistence.afterDeleteEntityHooks
          )
          deferred.promise



        ###*
        # @ngdoc method
        # @name initEntity
        #
        # @description
        # Update an entity
        #
        # @param {String} id Entity id in string or UUID
        # @param {Object} entity Entity object which should contain an id
        #
        # @returns {promise}
        ###
        self.shPersistence.initEntity = () ->
          hook() for hook in self.shPersistence.beforeInitEntityHooks
          deferred = $q.defer()

          $q.when(
            if self.shPersistence.id?
              self.shPersistence.editEntity(self.shPersistence.id)
            else
              self.shPersistence.newEntity()
          ).then(
            (success) ->
              hook(success) for hook in self.shPersistence.initEntitySuccessHooks
              deferred.resolve(success)

            (error) ->
              hook(error) for hook in self.shPersistence.initEntityErrorHooks
              deferred.reject(error)
          ).finally(
            () ->
              hook() for hook in self.shPersistence.afterInitEntityHooks
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
        self.shPersistence.getLookup = (key) ->
          self.shPersistence.lookup?[key]




        #
        # Return this/self
        #
        this

      #
      # Return ShPersistenceHook
      #
      ShPersistenceHook
  ]
)
