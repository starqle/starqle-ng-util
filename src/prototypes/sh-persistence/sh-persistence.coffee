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
# @file_name src/prototypes/sh-table/sh-table.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for controlling api request on table-like data.
# =============================================================================

"use strict"

shPersistenceModule.run ['$rootScope', ($rootScope) ->


  ###*
  # @ngdoc factory
  # @name shTable
  #
  # @description
  # shTable
  ###
  $rootScope.shPersistence = [
    '$injector'
    '$q'
    (
      $injector
      $q
    ) ->

      #
      self = this

      #
      @entity = {}

      #
      @id = null unless @id?
      @resource = null unless @resource?
      @localLookup = {}
      @sorting = id: "desc" unless @sorting?
      @autoload = false unless @autoload?

      #
      $injector.invoke $rootScope.shPersistenceHook, this

      #
      # Initialization
      #

      @initEntity() if @autoload
  ]


]
