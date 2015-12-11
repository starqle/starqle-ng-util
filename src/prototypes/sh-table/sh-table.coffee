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

shTableModule.run ['$rootScope', ($rootScope) ->


  ###*
  # @ngdoc factory
  # @name shTable
  #
  # @description
  # shTable
  ###
  $rootScope.shTable = [
    '$injector'
    '$q'
    'ShTableParams'
    (
      $injector
      $q
      ShTableParams
    ) ->

      #
      self = this

      #
      @entity = {}

      #
      @resource = null unless @resource?
      @columnDefs = [] unless @columnDefs?
      @localLookup = {}
      @sorting = id: "desc" unless @sorting?
      @autoload = true unless @autoload?

      #
      $injector.invoke $rootScope.shTableProcessor, this

      #
      @tableParams = new ShTableParams(
        pageNumber: 1
        perPage: 10
        sortInfo: 'this is sort info'
        sorting: @sorting
        getData: () ->
          self.getPagedDataAsync()
      )


      #
      # Initialization
      #

      @tableParams.initialize() if @autoload
  ]


]
