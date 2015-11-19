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

      @сreatedIds = []
      @updatedIds = []
      @deletedIds = []


      @shTableRest =
        resource: self.resource



      @shTableRest =
        resource: self.resource

      $injector.invoke $rootScope.shTableRest, @shTableRest

      ###*
      # @ngdoc method
      # @name getEntities
      #
      # @description
      # Get list of entities based on params
      #
      # @param {Object} params Parameter objects
      #
      # @returns {promise}
      ###
      @getEntities = (params) ->
        (self.beforeGetEntitiesHook or angular.noop)()
        deferred = $q.defer()

        # GEt the entities
        @resource.get(
          params
        ).$promise.then(
          (success) ->
            (self.getEntitiesSuccessHook or angular.noop)(success)
            deferred.resolve success

          (error) ->
            (self.getEntitiesErrorHook or angular.noop)(error)
            deferred.reject error

        ).finally(
          () ->
            (self.afterGetEntitiesHook or angular.noop)()
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
        (self.beforeDeleteEntityHook or angular.noop)()
        deferred = $q.defer()

        # Fetch blank entity
        @resource.new(
          @optParams
        ).$promise.then(
          (success) ->
            self.entity = success.data

            (self.newEntitySuccessHook or angular.noop)(success)
            deferred.resolve success

          (error) ->
            (self.newEntityErrorHook or angular.noop)(error)
            deferred.reject error

        ).finally(
          () ->
            (self.afterDeleteEntityHook or angular.noop)()
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
        (self.beforeDeleteEntityHook or angular.noop)()
        deferred = $q.defer()

        # Persist an entity into database
        @resource.save(
          @optParams
          data: entity
        ).$promise.then(
          (success) ->
            self.сreatedIds.push success.data.id
            self.entity = success.data
            self.refreshGrid()

            (self.createEntitySuccessHook or angular.noop)(success)
            deferred.resolve(success)

          (error) ->
            (self.createEntityErrorHook or angular.noop)(error)
            deferred.reject(error)

        ).finally(
          () ->
            (self.afterDeleteEntityHook or angular.noop)()
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
      # @param {Object} params Parameter objects
      #
      # @returns {promise}
      ###
      @editEntity = (id, params) ->
        (self.beforeDeleteEntityHook or angular.noop)()
        deferred = $q.defer()

        # Fetch entity for editing
        @resource.edit(
          angular.extend({id: id}, params)
        ).$promise.then(
          (success) ->
            self.entity = success.data

            (self.editEntitySuccessHook or angular.noop)(success)
            deferred.resolve(success)

          (error) ->
            (self.editEntityErrorHook or angular.noop)(error)
            deferred.reject(error)

        ).finally(
          () ->
            (self.afterDeleteEntityHook or angular.noop)()
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
      # @param {Object} params Parameter objects
      # @param {Object} entity Entity object which should contain an id
      #
      # @returns {promise}
      ###
      @updateEntity = (id, params, entity) ->
        (self.beforeDeleteEntityHook or angular.noop)()
        deferred = $q.defer()

        # Update entity into database
        @resource.update(
          angular.extend({id: id}, params)
          data: entity
        ).$promise.then(
          (success) ->
            self.updatedIds.push success.data.id
            self.entity = success.data
            self.refreshGrid()

            (self.updateEntitySuccessHook or angular.noop)(success)
            deferred.resolve(success)

          (error) ->
            (self.updateEntityErrorHook or angular.noop)(error)
            deferred.reject(error)

        ).finally(
          () ->
            (self.afterDeleteEntityHook or angular.noop)()
        )
        deferred.promise



      ###*
      # @ngdoc method
      # @name deleteEntity
      #
      # @description
      # Delete an entity
      #
      # @param {String} name Entity id in string or UUID
      # @param {Object} params Parameter objects
      #
      # @returns {promise}
      ###
      @deleteEntity = (id, params) ->
        (self.beforeDeleteEntityHook or angular.noop)()
        deferred = $q.defer()

        # Delete entity from database
        @shTableRest.deleteEntity(
          angular.extend({id: id}, params)
        ).$promise.then(
          (success) ->
            self.deletedIds.push id
            self.refreshGrid()

            (self.deleteEntitySuccessHook or angular.noop)(success)
            deferred.resolve(success)

          (error) ->
            (self.deleteEntityErrorHook or angular.noop)(error)
            deferred.reject(error)

        ).finally(
          () ->
            (self.afterDeleteEntityHook or angular.noop)()
        )
        deferred.promise
  ]


]
