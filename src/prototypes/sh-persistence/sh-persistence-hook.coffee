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

shPersistenceModule.run ['$rootScope', ($rootScope) ->


  ###*
  # @ngdoc factory
  # @name shTableHook
  #
  # @description
  # ShTableRest
  ###
  $rootScope.shPersistenceHook = [
    '$q'
    '$injector'
    (
      $q
      $injector
    ) ->

      self = this

      @id = null unless @id?
      @resource = null unless @resource?
      @entity = {} unless @entity?
      @lookup = {} unless @lookup?
      @optParams = {} unless @optParams?


      @shApi =
        resource: self.resource


      $injector.invoke $rootScope.shApi, @shApi


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
        (self.beforeNewEntityHook or angular.noop)()
        deferred = $q.defer()

        # Fetch blank entity
        @shApi.newEntity(
          @optParams
        ).then(
          (success) ->
            self.entity = success.data
            self.lookup = success.lookup if success.lookup?

            (self.newEntitySuccessHook or angular.noop)(success)
            deferred.resolve success

          (error) ->
            (self.newEntityErrorHook or angular.noop)(error)
            deferred.reject error

        ).finally(
          () ->
            (self.afterNewEntityHook or angular.noop)()
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
        (self.beforeCreateEntityHook or angular.noop)()
        deferred = $q.defer()

        # Persist an entity into database
        @shApi.createEntity(
          @optParams
          entity
        ).then(
          (success) ->
            self.entity = success.data
            self.lookup = success.lookup if success.lookup?

            (self.createEntitySuccessHook or angular.noop)(success)
            deferred.resolve(success)

          (error) ->
            (self.createEntityErrorHook or angular.noop)(error)
            deferred.reject(error)

        ).finally(
          () ->
            (self.afterCreateEntityHook or angular.noop)()
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
        (self.beforeEditEntityHook or angular.noop)()
        deferred = $q.defer()

        # Fetch entity for editing
        @shApi.editEntity(
          id
          @optParams
        ).then(
          (success) ->
            self.entity = success.data
            self.lookup = success.lookup if success.lookup?

            (self.editEntitySuccessHook or angular.noop)(success)
            deferred.resolve(success)

          (error) ->
            (self.editEntityErrorHook or angular.noop)(error)
            deferred.reject(error)

        ).finally(
          () ->
            (self.afterEditEntityHook or angular.noop)()
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
        (self.beforeUpdateEntityHook or angular.noop)()
        deferred = $q.defer()

        # Update entity into database
        @shApi.updateEntity(
          id
          @optParams
          entity
        ).then(
          (success) ->
            self.entity = success.data
            self.lookup = success.lookup if success.lookup?

            (self.updateEntitySuccessHook or angular.noop)(success)
            deferred.resolve(success)

          (error) ->
            (self.updateEntityErrorHook or angular.noop)(error)
            deferred.reject(error)

        ).finally(
          () ->
            (self.afterUpdateEntityHook or angular.noop)()
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
      @initEntity = () ->
        (self.beforeInitEntityHook or angular.noop)()
        deferred = $q.defer()

        $q.when(
          if self.id?
            @editEntity(self.id)
          else
            @newEntity()
        ).then(
          (success) ->
            (self.initEntitySuccessHook or angular.noop)(success)
            deferred.resolve(success)

          (error) ->
            (self.initEntityErrorHook or angular.noop)(error)
            deferred.reject(error)
        ).finally(
          () ->
            (self.afterInitEntityHook or angular.noop)()
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


  ]


]
