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
# @note This file contains ShApiHook for holding tableParams data inspired by ng-table
# =============================================================================

###*
# @ngdoc object
# @name ShApiHook
#
# @description
# ShApiHook factory
#
###

shApiModule.factory(
  'ShApiHook'
  [
    '$q'
    'ShApi'
    (
      $q
      ShApi
    ) ->

      ShApiHook = (params) ->

        # Variables
        self = this

        self.shApiInstance = params.shApiInstance


        self.shApiInstance.resource ?= null
        self.shApiInstance.entity ?= {}
        self.shApiInstance.optParams ?= {}

        self.shApiInstance.updatedIds = []
        self.shApiInstance.deletedIds = []


        self.shApiInstance.beforeApiCallEntityHooks = {}
        self.shApiInstance.apiCallEntitySuccessHooks = {}
        self.shApiInstance.apiCallEntityErrorHooks = {}
        self.shApiInstance.afterApiCallEntityHooks = {}

        shApi = new ShApi(
          resource: self.shApiInstance.resource
        )

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
        self.shApiInstance.apiCallEntity = (opts) ->
          deferred = $q.defer()

          unless opts.method? and opts.method in ['GET', 'POST', 'PUT', 'DELETE']
            console.error 'STARQLE_NG_UTIL: Unknown Method'
            deferred.reject({})

          else unless opts.name?
            console.error 'STARQLE_NG_UTIL: Options name is required'
            deferred.reject({})

          else
            apiParameters =
              name: opts.name
              method: opts.method
              params: self.shApiInstance.optParams

            apiParameters.id = opts.id if opts.id

            switch opts.method
              when 'GET', 'DELETE'
                if opts.entity?
                  console.error 'STARQLE_NG_UTIL: Options entity should not be provided'
                  deferred.reject({})

              when 'POST', 'PUT'
                unless opts.entity?
                  console.error 'STARQLE_NG_UTIL: Options entity is required'
                  deferred.reject({})

                else
                  # Check if the entity is a FormData (Useful for file uploaded form)
                  data = {data: opts.entity}
                  if Object.prototype.toString.call(opts.entity).slice(8, -1) is 'FormData'
                    data = opts.entity

                  apiParameters.data = data


            # Preparing hooks based-on name
            self.shApiInstance.beforeApiCallEntityHooks[opts.name] ?= []
            self.shApiInstance.apiCallEntitySuccessHooks[opts.name] ?= []
            self.shApiInstance.apiCallEntityErrorHooks[opts.name] ?= []
            self.shApiInstance.afterApiCallEntityHooks[opts.name] ?= []

            # Call shApi apiCall

            hook() for hook in self.shApiInstance.beforeApiCallEntityHooks[opts.name]

            shApi.apiCall(
              apiParameters
            ).then(
              (success) ->
                # These following 3-lines only applicable for shApiInstance
                # self.shApiInstance.updatedIds.push success.data.id if opts.method in ['POST', 'PUT']
                # self.shApiInstance.deletedIds.push success.data.id if opts.method in ['DELETE']
                # self.shApiInstance.refreshGrid() if opts.method in ['DELETE', 'POST', 'PUT']

                hook(success) for hook in self.shApiInstance.apiCallEntitySuccessHooks[opts.name]
                deferred.resolve(success)

              (error) ->
                hook(error) for hook in self.shApiInstance.apiCallEntityErrorHooks[opts.name]
                deferred.reject(error)

            ).finally(
              () ->
                hook() for hook in self.shApiInstance.afterApiCallEntityHooks[opts.name]
            )

          deferred.promise

        #
        # Return this/self
        #
        this

      #
      # Return ShApiHook
      #
      ShApiHook
  ]
)
