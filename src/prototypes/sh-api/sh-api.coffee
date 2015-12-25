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
# @file_name src/prototypes/sh-api/sh-api.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for controlling api request on table-like data.
# =============================================================================

"use strict"


shApiModule.run ['$rootScope', ($rootScope) ->


  ###*
  # @ngdoc factory
  # @name shApi
  #
  # @description
  # ShTableRest
  ###
  $rootScope.shApi = [
    '$q'
    (
      $q
    ) ->

      @resource = null unless @resource?

      ###*
      # @ngdoc method
      # @name index
      #
      # @description
      # Get list of records based on params. `GET`
      #
      # @param {Object} params Parameter objects
      #
      # @returns {promise}
      ###
      @index = (params) ->
        deferred = $q.defer()

        # GEt the records
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
      # @name new
      #
      # @description
      # Get a new Record. `GET`
      #
      # @returns {promise}
      ###
      @new = (params) ->
        deferred = $q.defer()

        # Fetch blank record
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
      # @name create
      #
      # @description
      # Create/persist an record to database. `POST`
      #
      # @param {Object} params Parameter objects
      # @param {Object} data Data object. Usualy it's formed `{data: entity}`
      #
      # @returns {promise}
      ###
      @create = (params, data) ->
        deferred = $q.defer()

        # Persist an record into database
        @resource.save(
          params
          data
        ).$promise.then(
          (success) ->
            deferred.resolve(success)

          (error) ->
            deferred.reject(error)
        )
        deferred.promise



      ###*
      # @ngdoc method
      # @name edit
      #
      # @description
      # Get a record, equals with show. `GET`
      #
      # @param {String} id Record id in string or UUID
      # @param {Object} params Parameter objects
      #
      # @returns {promise}
      ###
      @edit = (id, params) ->
        deferred = $q.defer()

        # Fetch a record for editing
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
      # @name update
      #
      # @description
      # Update a record
      #
      # @param {String} id Record id in string or UUID. `PUT`
      # @param {Object} params Parameter objects
      # @param {Object} data Data object. Usualy it's formed `{data: entity}`
      #
      # @returns {promise}
      ###
      @update = (id, params, data) ->
        deferred = $q.defer()

        # Update a record into database
        @resource.update(
          angular.extend({id: id}, params)
          data
        ).$promise.then(
          (success) ->
            deferred.resolve(success)

          (error) ->
            deferred.reject(error)
        )
        deferred.promise



      ###*
      # @ngdoc method
      # @name delete
      #
      # @description
      # Delete a record. `DELETE`
      #
      # @param {String} id Record id in string or UUID
      # @param {Object} params Parameter objects
      #
      # @returns {promise}
      ###
      @delete = (id, params) ->
        deferred = $q.defer()

        # Delete record from database
        @resource.delete(
          angular.extend({id: id}, params)
        ).$promise.then(
          (success) ->
            deferred.resolve(success)

          (error) ->
            deferred.reject(error)
        )
        deferred.promise


      # @index = (params) ->
      # @new = (params) ->
      # @create = (params, data) ->
      # @edit = (id, params) ->
      # @update = (id, params, data) ->
      # @delete = (id, params) ->

      ###*
      # @ngdoc method
      # @name apiCall
      #
      # @description
      # apiCall `GET`
      # apiCall `POST`
      # apiCall `PUT`
      # apiCall `DELETE`
      #
      # @param {String} id Record id in string or UUID
      # @param {Object} params Parameter objects
      #
      # @returns {promise}
      ###
      @apiCall = (opts) ->
        deferred = $q.defer()

        switch opts.method
          when 'GET', 'DELETE'
            # Fetch a record for editing
            @resource[opts.name](
              angular.extend({id: opts.id}, opts.params)
            ).$promise.then(
              (success) ->
                deferred.resolve(success)

              (error) ->
                deferred.reject(error)
            )

          when 'POST', 'PUT'
            @resource[opts.name](
              angular.extend({id: opts.id}, opts.params)
              opts.data
            ).$promise.then(
              (success) ->
                deferred.resolve(success)

              (error) ->
                deferred.reject(error)
            )
          else
            console.log 'STARQLE_NG_UTIL: Unknown Method'
            deferred.reject({})

        deferred.promise


  ]


]
