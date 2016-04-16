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
# @file_name src/prototypes/sh-table/sh-table-filter-storage.coffee
# @author Fadli Nurhasan
# @email fadli@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for table filter storage
# =============================================================================


shTableModule.run ['$rootScope', ($rootScope) ->

  ###*
  # @ngdoc factory
  # @name shTableHelper
  #
  # @description
  # shTableHelper
  ###
  $rootScope.shTableFilterStorage = [
    '$location'
    'localStorageService'
    (
      $location
      localStorageService
    ) ->

      # Variables
      self = this

      storageKey = if self.name then self.name else $location.path()
      filterLabelStorageKey = storageKey + "/filterLabel"


      @beforeRefreshGridHooks.push () ->
        # get Current filterParams and Ger Current LocalStorage
        currentFilterParams = getCurrentFilterParams() ? {}
        currentLocalStorage = if getCurrentLocalStorage() is 'undefined' then self.filterParams else getCurrentLocalStorage()

        # merge
        # angular.merge(currentLocalStorage, currentFilterParams)
        resultFilterParams = if self.filterParams.fromShFilter? then currentFilterParams else currentLocalStorage

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
        self.filterParams

      getCurrentLocalStorage = () ->
        localStorageService.get(storageKey)

      setFilterParams = (currentLocalStorage) ->
        self.filterParams = currentLocalStorage
        return

      setLocalStorage = (currentLocalStorage) ->
        localStorageService.set storageKey, currentLocalStorage

      setFilterLabel = (resultFilterLabel) ->
        self.filterLabel = resultFilterLabel
        return

      setFilterCollection = (resultFilterCollection) ->
        self.filterCollection = resultFilterCollection
        return

      return

  ]


  return


]
