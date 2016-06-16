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
# @note This file contains ShTableFilterStorage for holding tableParams data inspired by ng-table
# =============================================================================

###*
# @ngdoc object
# @name ShTableFilterStorage
#
# @description
# ShTableFilterStorage factory
#
###

shTableModule.factory(
  'ShTableFilterStorage'
  [
    '$location'
    'localStorageService'
    (
      $location
      localStorageService
    ) ->

      ShTableFilterStorage = (params) ->

        # Variables
        self = this

        self.shTable = params.shTable

        storageKey = [self.shTable.name, $location.path()].join('')

        #
        # Push a method on beforeRefreshGridHooks
        #
        self.shTable.beforeRefreshGridHooks.push () ->
          # get Current filterParams and Ger Current LocalStorage
          currentFilterParams = getCurrentFilterParams() ? {}
          currentLocalStorage = if getCurrentLocalStorage() is 'undefined' then self.shTable.filterParams else getCurrentLocalStorage()

          # merge
          # angular.merge(currentLocalStorage, currentFilterParams)
          resultFilterParams = if self.shTable.filterParams.fromShFilter? then currentFilterParams else currentLocalStorage

          resultFilterLabel = {}
          resultFilterCollection = {}

          if resultFilterParams?
            keysCollections = Object.keys(resultFilterParams)
            for key in keysCollections
              lastUnderscore = key.lastIndexOf("_")
              new_key = key.substring(0, lastUnderscore)
              collectionKey = key.substring(lastUnderscore)

              if new_key
                if collectionKey is "_in"
                  resultFilterCollection[new_key] = []
                  for obj in resultFilterParams[key]
                    resultFilterCollection[new_key].push
                      value: obj
                  resultFilterLabel[new_key] = resultFilterParams[key].join(", ")
                else
                  resultFilterLabel[new_key] = resultFilterParams[key]
              else
                resultFilterLabel[key] = resultFilterParams[key]

            # set Current filterParams and Ger Current LocalStorage
            setFilterParams(resultFilterParams)
            setLocalStorage(resultFilterParams)
            setFilterLabel(resultFilterLabel)
            setFilterCollection(resultFilterCollection)

          return

        getCurrentFilterParams = () ->
          self.shTable.filterParams

        getCurrentLocalStorage = () ->
          localStorageService.get(storageKey)

        setFilterParams = (currentLocalStorage) ->
          self.shTable.filterParams = currentLocalStorage
          return

        setLocalStorage = (currentLocalStorage) ->
          localStorageService.set storageKey, currentLocalStorage

        setFilterLabel = (resultFilterLabel) ->
          self.shTable.filterLabel = resultFilterLabel
          return

        setFilterCollection = (resultFilterCollection) ->
          self.shTable.filterCollection = resultFilterCollection
          return


        #
        # Return this/self
        #
        this



      #
      # Return ShTableFilterStorage
      #
      ShTableFilterStorage
  ]
)
