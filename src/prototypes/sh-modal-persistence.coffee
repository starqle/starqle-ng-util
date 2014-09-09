# =============================================================================
# Copyright (c) 2013 All Right Reserved, http://starqle.com/
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
# @file_name src/prototypes/sh-modal-persistence.coffee
# @author Giovanni Sakti
# @email giosakti@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for controllers that utilize modal-based CRUD persistence
# =============================================================================

"use strict"

angular.module('sh.modal.persistence', []).run ['$rootScope', ($rootScope) ->

  # ===========================================================================
  # modalPersistence Prototype
  # ===========================================================================

  $rootScope.modalPersistence = ['$scope', '$timeout', 'ShNotification', 'ShButtonState', ($scope, $timeout, ShNotification, ShButtonState) ->
    $scope.entity = {}
    $scope.errors = []
    $scope.localLookup = {}

    $scope.refreshGrid ?= (currentPage = null) ->
      if currentPage is null
        currentPage = $scope.pagingOptions.currentPage

      # TODO: @giosakti should be able to go to the page specified in parameter
      $scope.getPagedDataAsync()

    $scope.toggleSelection = (obj, arr) ->
      idx = arr.indexOf(obj)
      if idx > -1
        arr.splice(idx, 1)
      else
        arr.push(obj)

    # =========================================================================
    # Default Callbacks
    # =========================================================================

    # =========================================================================
    # New callback methods
    $scope.beforeNewEntity = () ->
    $scope.newEntitySuccess = (response) ->
    $scope.newEntitySuccessNotification = (response) ->
    $scope.newEntityFailure = (response) ->
    $scope.newEntityFailureNotification = (response) ->

    # =========================================================================
    # Create callback methods
    $scope.beforeCreateEntity = () ->
    $scope.createEntitySuccess = (response) ->
    $scope.createEntitySuccessNotification = (response) ->
      ShNotification.toastByResponse response,
        type: 'success'
        message: 'Successfully Created'

    $scope.createEntityFailure = (response) ->
    $scope.createEntityFailureNotification = (response) ->
      if response and response.data and response.data.error
        ShNotification.toastByResponse response,
          type: 'danger'
          message: response.data.error.message
      else
        ShNotification.toastByResponse response,
          type: 'danger'
          message: 'Failed to Create'

    # =========================================================================
    # Edit callback methods
    $scope.beforeEditEntity = () ->
    $scope.editEntitySuccess = (response) ->
    $scope.editEntitySuccessNotification = (response) ->
    $scope.editEntityFailure = (response) ->
    $scope.editEntityFailureNotification = (response) ->

    # =========================================================================
    # Update callback methods
    $scope.beforeUpdateEntity = () ->
    $scope.updateEntitySuccess = (response) ->
    $scope.updateEntitySuccessNotification = (response) ->
      ShNotification.toastByResponse response,
        type: 'success'
        message: 'Successfully Updated'

    $scope.updateEntityFailure = (response) ->
    $scope.updateEntityFailureNotification = (response) ->
      if response and response.data and response.data.error
        ShNotification.toastByResponse response,
          type: 'danger'
          message: response.data.error.message
      else
        ShNotification.toastByResponse response,
          type: 'danger'
          message: 'Failed to Update'

    # =========================================================================
    # Destroy callbacks
    $scope.beforeDestroyEntity = () ->
    $scope.destroyEntitySuccess = (response) ->
    $scope.destroyEntitySuccessNotification = (response) ->
      ShNotification.toastByResponse response,
        type: 'success'
        message: 'Successfully Deleted'

    $scope.destroyEntityFailure = (response) ->
    $scope.destroyEntityFailureNotification = (response) ->
      if response.data.error.message != null
        ShNotification.toastByResponse response,
          type: 'danger'
          message: response.data.error.message
      else
        ShNotification.toastByResponse response,
          type: 'danger'
          message: 'Failed to Delete'

    $scope.beforeMultipleDestroyEntity = () ->
    $scope.multipleDestroyEntitySuccess = (response) ->
    $scope.multipleDestroyEntitySuccessNotification = (response) ->
      ShNotification.toastByResponse response,
        type: 'success'
        message: 'Successfully Deleted'

    $scope.multipleDestroyEntityFailure = (response) ->
    $scope.multipleDestroyEntityFailureNotification = (response) ->
      if response.data.error.message != null
        ShNotification.toastByResponse response,
          type: 'danger'
          message: response.data.error.message
      else
        ShNotification.toastByResponse response,
          type: 'danger'
          message: 'Failed to Delete'

    # =========================================================================
    # Save
    # =========================================================================

    $scope.showEntityModal = (elementStr, id = null) ->
      # Fetch blank entity if it's a new record
      if id is null
        $scope.showNewEntityModal(elementStr)
      else # Otherwise fetch existing entity for editing
        $scope.showEditEntityModal(id, elementStr)

    $scope.resetEntityModal = ->
      $scope.entity = {}
      $scope.errors = []
      $scope.localLookup = {}

    $scope.closeEntityModal = (elementStr) ->
      angular.element("##{elementStr}").modal('hide')
      $scope.resetEntityModal()

    $scope.saveEntity = (elementStr, $event) ->
      # Update entity in database
      if $scope.entity.id?
        $scope.updateEntity(elementStr, $event)
      else # Persist entity into database
        $scope.createEntity(elementStr, $event)

    # =========================================================================
    # Create
    # =========================================================================

    $scope.showNewEntityModal = (elementStr) ->
      angular.element("##{elementStr}").modal('show')
      angular.element("##{elementStr}").on 'hidden.bs.modal', () ->
        $scope.closeNewEntityModal elementStr
      $scope.fetchNewEntity()

    $scope.fetchNewEntity = ->
      $scope.beforeNewEntity()

      # Fetch blank entity
      $scope.resource.new($.extend({}, $scope.optParams)
      ).$promise.then((success) ->
        $scope.entity = success.data
        $scope.localLookup = success.lookup
        $scope.newEntitySuccess(success)
        $scope.newEntitySuccessNotification(success)
      , (error) ->
        $scope.newEntityFailure(error)
        $scope.newEntityFailureNotification(error)
      )

    $scope.closeNewEntityModal = (elementStr) ->
      angular.element("##{elementStr}").modal('hide')
      $scope.resetEntityModal()

    $scope.createEntity = (elementStr, $event) ->
      $scope.beforeCreateEntity()

      $event = ShButtonState.initializeEvent $event
      ShButtonState.loading $event

      # Persist entity into database
      $scope.resource.save($.extend({}, $scope.optParams)
      , data: $scope.entity
      ).$promise.then((success) ->
        $scope.closeNewEntityModal(elementStr)
        $scope.recentlyCreatedIds.push success.data.id if $scope.recentlyCreatedIds?
        $scope.refreshGrid() if typeof $scope.getPagedDataAsync is 'function'
        ShButtonState.enable $event
        $scope.createEntitySuccess(success)
        $scope.createEntitySuccessNotification(success)
      , (error) ->
        $scope.errors = error.data.error.errors
        ShButtonState.enable $event
        $scope.createEntityFailure(error)
        $scope.createEntityFailureNotification(error)
      )

    # =========================================================================
    # Update
    # =========================================================================

    $scope.showEditEntityModal = (id, elementStr) ->
      angular.element("##{elementStr}").modal('show')
      angular.element("##{elementStr}").on 'hidden.bs.modal', () ->
        $scope.closeEditEntityModal elementStr
      $scope.fetchEditEntity(id)

    $scope.fetchEditEntity = (id) ->
      $scope.beforeEditEntity()

      # Fetch entity for editing
      $scope.resource.edit($.extend({id: id}, $scope.optParams)
      ).$promise.then((success) ->
        $scope.entity = success.data
        $scope.localLookup = success.lookup
        $scope.editEntitySuccess(success)
        $scope.editEntitySuccessNotification(success)
      , (error) ->
        $scope.editEntityFailure(error)
        $scope.editEntityFailureNotification(error)
      )

    $scope.closeEditEntityModal = (elementStr) ->
      angular.element("##{elementStr}").modal('hide')
      $scope.resetEntityModal()

    $scope.updateEntity = (elementStr, $event) ->
      $scope.beforeUpdateEntity()

      $event = ShButtonState.initializeEvent $event
      ShButtonState.loading $event

      # Update entity into database
      $scope.resource.update($.extend({id: $scope.entity.id}, $scope.optParams)
      , data: $scope.entity
      ).$promise.then((success) ->
        $scope.closeEditEntityModal(elementStr)
        $scope.recentlyUpdatedIds.push success.data.id if $scope.recentlyUpdatedIds?
        $scope.refreshGrid() if typeof $scope.getPagedDataAsync is 'function'
        ShButtonState.enable $event
        $scope.updateEntitySuccess(success)
        $scope.updateEntitySuccessNotification(success)
      , (error) ->
        $scope.errors = error.data.error.errors
        ShButtonState.enable $event
        $scope.updateEntityFailure(error)
        $scope.updateEntityFailureNotification(error)
      )

    # =========================================================================
    # Destroy
    # =========================================================================

    $scope.destroyEntity = (id, name='this entry', $event) ->
      if (typeof name isnt "String")
        $event = ShButtonState.initializeEvent name
        name = 'this entry'
      else
        $event = ShButtonState.initializeEvent $event

      if !confirm("Are you sure you want to delete #{name}?")
        return false

      ShButtonState.loading $event

      $scope.beforeDestroyEntity()

      # Delete entity from database
      $scope.resource.delete($.extend({id: id}, $scope.optParams)
      ).$promise.then((success) ->
        $scope.recentlyDeletedIds.push success.data.id if $scope.recentlyDeletedIds?
        # $scope.refreshGrid() if typeof $scope.getPagedDataAsync is 'function'
        $scope.destroyEntitySuccess(success)
        $scope.destroyEntitySuccessNotification(success)
      , (error) ->
        $scope.destroyEntityFailure(error)
        $scope.destroyEntityFailureNotification(error)
        ShButtonState.enable $event
      )

    $scope.deleteEntity = (id, name='this entry', $event) ->
      $scope.destroyEntity(id, name, $event)

    $scope.multipleDestroyEntity = (ids, name='these entries') ->
      if !confirm("Are you sure you want to delete #{name}?")
        return false

      $scope.beforeMultipleDestroyEntity()

      # Delete entity from database
      $scope.resource.multiple_delete($.extend({'ids[]': ids}, $scope.optParams)
      ).$promise.then((success) ->
        $scope.recentlyDeletedIds = ids if $scope.recentlyDeletedIds?
        $scope.selectedEntities = []
        # $scope.refreshGrid() if typeof $scope.getPagedDataAsync is 'function'
        $scope.multipleDestroyEntitySuccess(success)
        $scope.multipleDestroyEntitySuccessNotification(success)
      , (error) ->
        $scope.multipleDestroyEntityFailure(error)
        $scope.multipleDestroyEntityFailureNotification(error)
      )

    $scope.multipleDeleteEntity = (ids) ->
      $scope.multipleDestroyEntity(ids)

    # Recently Row Event Class
    $scope.rowEvent = (entity) ->
      if $scope.recentlyDeletedIds.indexOf(entity.id) >= 0  
        'recently-deleted'
      else if $scope.recentlyUpdatedIds.indexOf(entity.id) >= 0  
        'recently-updated'
      else if $scope.recentlyCreatedIds.indexOf(entity.id) >= 0  
        'recently-created'
      else
        'else'
  ]
]
