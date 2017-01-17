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
# @note This file contains ShTableHookNotification for holding tableParams data inspired by ng-table
# =============================================================================

###*
# @ngdoc object
# @name ShTableHookNotification
#
# @description
# ShTableHookNotification factory
#
###

shTableModule.factory(
  'ShTableHookNotification'
  [
    'ShNotification'
    (
      ShNotification
    ) ->

      ShTableHookNotification = (params) ->

        # Variables
        self = this

        self.shTable = params.shTable


        self.shTable.createEntitySuccessHooks.push (success) ->
          ShNotification.toastByResponse success
          return

        self.shTable.updateEntitySuccessHooks.push (success) ->
          ShNotification.toastByResponse success
          return


        self.shTable.getEntitiesErrorHooks.push (error) ->
          ShNotification.toastByResponse error
          return

        self.shTable.newEntityErrorHooks.push (error) ->
          ShNotification.toastByResponse error
          return

        self.shTable.createEntityErrorHooks.push (error) ->
          ShNotification.toastByResponse error
          return

        self.shTable.editEntityErrorHooks.push (error) ->
          ShNotification.toastByResponse error
          return

        self.shTable.updateEntityErrorHooks.push (error) ->
          ShNotification.toastByResponse error
          return

        self.shTable.deleteEntityErrorHooks.push (error) ->
          ShNotification.toastByResponse error
          return

        #
        # Return this/self
        #
        this

      #
      # Return ShTableHookNotification
      #
      ShTableHookNotification
  ]
)
