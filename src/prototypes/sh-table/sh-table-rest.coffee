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
# @file_name src/prototypes/sh-table/sh-table-rest.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for controlling api request on table-like data.
# =============================================================================

"use strict"

shTableModule.run ['$rootScope', ($rootScope) ->


  ###*
  # @ngdoc factory
  # @name shTableRest
  #
  # @description
  # ShTableRest
  ###
  $rootScope.shTableRest = [
    '$q'
    (
      $q
    ) ->

      self = this

      @resource = null unless @resource?

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
        deferred = $q.defer()

        # GEt the entities
        @resource.get(
          params
        ).$promise.then(
          (success) ->
            deferred.resolve success

          (error) ->
            deferred.reject error
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
      @newEntity = (params) ->
        deferred = $q.defer()

        # Fetch blank entity
        @resource.new(
          params
        ).$promise.then(
          (success) ->
            deferred.resolve success

          (error) ->
            deferred.reject error
        )
        deferred.promise


      ###*
      # @ngdoc method
      # @name createEntity
      #
      # @description
      # Create/persist an entity to database
      #
      # @param {Object} params Parameter objects
      # @param {Object} entity Entity object which should not contain an id
      #
      # @returns {promise}
      ###
      @createEntity = (params, entity) ->
        deferred = $q.defer()

        # Persist an entity into database
        @resource.save(
          params
          data: entity
        ).$promise.then(
          (success) ->
            deferred.resolve(success)

          (error) ->
            deferred.reject(error)
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
        deferred = $q.defer()

        # Fetch entity for editing
        @resource.edit(
          angular.extend({id: id}, params)
        ).$promise.then(
          (success) ->
            deferred.resolve(success)

          (error) ->
            deferred.reject(error)
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
        deferred = $q.defer()

        # Update entity into database
        @resource.update(
          angular.extend({id: id}, params)
          data: entity
        ).$promise.then(
          (success) ->
            deferred.resolve(success)

          (error) ->
            deferred.reject(error)
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
        deferred = $q.defer()

        # Delete entity from database
        @resource.delete(
          angular.extend({id: id}, params)
        ).$promise.then(
          (success) ->
            deferred.resolve(success)

          (error) ->
            deferred.reject(error)
        )
        deferred.promise
  ]


]
