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
# @file_name src/prototypes/sh-api/sh-api-hook.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for controlling api hook.
# =============================================================================

"use strict"

shApiModule.run ['$rootScope', ($rootScope) ->


  ###*
  # @ngdoc factory
  # @name shApiHook
  #
  # @description
  # ShTableRest
  ###
  $rootScope.shApiHook = [
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


      shApi =
        resource: self.resource

      @beforeApiCallEntityHooks = {}
      @аpiCallEntitySuccessHooks = {}
      @аpiCallEntityErrorHooks = {}
      @afterApiCallEntityHooks = {}


      ###*
      # @ngdoc method
      # @name apiCall
      #
      # @description
      # Call api by name
      #
      # @param {Object} opts Parameter objects method, name, id, entity
      #
      # @returns {promise}
      ###
      @apiCallEntity = (opts) ->
        deferred = $q.defer()

        unless opts.method? and opts.method in ['GET', 'POST', 'PUT', 'DELETE']
          console.log 'STARQLE_NG_UTIL: Unknown Method'
          deferred.reject({})

        else unless opts.name?
          console.log 'STARQLE_NG_UTIL: Options name is required'
          deferred.reject({})

        else
          apiParameters =
            name: opts.name
            method: opts.method
            params: @optParams

          apiParameters.id = opts.id if opts.id

          switch opts.method
            when 'GET', 'DELETE'
              if opts.entity?
                console.log 'STARQLE_NG_UTIL: Options entity should not be provided'
                deferred.reject({})

            when 'POST', 'PUT'
              unless opts.entity?
                console.log 'STARQLE_NG_UTIL: Options entity is required'
                deferred.reject({})

              else
                # Check if the entity is a FormData (Useful for file uploaded form)
                data = {data: opts.entity}
                if Object.prototype.toString.call(opts.entity).slice(8, -1) is 'FormData'
                  data = opts.entity

                apiParameters.data = data


          # Call shApi apiCall

          hook() for hook in (self.beforeApiCallEntityHooks[opts.name] ? [])

          shApi.apiCall(
            apiParameters
          ).then(
            (success) ->
              self.updatedIds.push id if opts.method in ['POST', 'PUT']
              self.deletedIds.push id if opts.method in ['DELETE']
              self.refreshGrid() if opts.method in ['DELETE', 'POST', 'PUT']

              hook(success) for hook in (self.аpiCallEntitySuccessHooks[opts.name] ? [])
              deferred.resolve(success)

            (error) ->
              hook(error) for hook in (self.аpiCallEntityErrorHooks[opts.name] ? [])
              deferred.reject(error)

          ).finally(
            () ->
              hook() for hook in (self.afterApiCallEntityHooks[opts.name] ? [])
          )

        deferred.promise


      # Invokes

      $injector.invoke $rootScope.shApi, shApi


  ]


]
