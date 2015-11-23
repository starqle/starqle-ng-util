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

  $rootScope.modalPersistence = ['$scope', '$q', '$timeout', 'ShNotification', 'ShButtonState', ($scope, $q, $timeout, ShNotification, ShButtonState) ->
    $scope.entity = {}
    $scope.errors = []
    $scope.localLookup = {}
    $scope.modalProperties = {}

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
    $scope.beforeCreateEntity = ($event) ->
    $scope.createEntitySuccess = (response, $event) ->
    $scope.createEntitySuccessNotification = (response, $event) ->
      ShNotification.toastByResponse response,
        type: 'success'
        message: 'Successfully Created'

    $scope.createEntityFailure = (response, $event) ->
    $scope.createEntityFailureNotification = (response, $event) ->
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
    $scope.beforeEditEntity = (id) ->
    $scope.editEntitySuccess = (response, id) ->
    $scope.editEntitySuccessNotification = (response, id) ->
    $scope.editEntityFailure = (response, id) ->
    $scope.editEntityFailureNotification = (response, id) ->

    # =========================================================================
    # Update callback methods
    $scope.beforeUpdateEntity = ($event) ->
    $scope.updateEntitySuccess = (response, $event) ->
    $scope.updateEntitySuccessNotification = (response, $event) ->
      ShNotification.toastByResponse response,
        type: 'success'
        message: 'Successfully Updated'

    $scope.updateEntityFailure = (response, $event) ->
    $scope.updateEntityFailureNotification = (response, $event) ->
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
    $scope.beforeDestroyEntity = ($event) ->
    $scope.destroyEntitySuccess = (response, $event) ->
    $scope.destroyEntitySuccessNotification = (response, $event) ->
      ShNotification.toastByResponse response,
        type: 'success'
        message: 'Successfully Deleted'

    $scope.destroyEntityFailure = (response, $event) ->
    $scope.destroyEntityFailureNotification = (response, $event) ->
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
    # Additional callbacks
    $scope.beforeShowEntityModal = (elementStr, id = null) ->
    $scope.afterCloseEntityModal = (elementStr, id = null) ->
    $scope.beforeSaveEntity = (elementStr, $event) ->

    # =========================================================================
    # Save
    # =========================================================================

    $scope.showEntityModal = (elementStr, id = null) ->
      $scope.beforeShowEntityModal(elementStr, id)
      # Fetch blank entity if it's a new record
      if id is null
        $scope.showNewEntityModal(elementStr)
      else # Otherwise fetch existing entity for editing
        $scope.showEditEntityModal(id, elementStr)

    $scope.resetEntityModal = (elementStr = null) ->
      $scope.entity = {}
      $scope.errors = []
      $scope.localLookup = {}
      if elementStr
        entityForm = angular.element("##{elementStr}").find('form').eq(0)
        entityForm.removeClass('sh-highlight-required')
        entityFormName = entityForm.attr('name')
        if entityFormName? and $scope[entityFormName] isnt null
          $scope[entityFormName]?.$setPristine()

    $scope.closeEntityModal = (elementStr) ->
      angular.element("##{elementStr}").modal('hide')
      $scope.resetEntityModal(elementStr)
      $scope.afterCloseEntityModal elementStr

    $scope.saveEntity = (elementStr, $event) ->
      $scope.beforeSaveEntity(elementStr, $event)
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
        $scope.modalProperties.visible = false
      $scope.fetchNewEntity()

    $scope.fetchNewEntity = ->
      deferred = $q.defer()

      $rootScope.spinningService.spin('modal')
      $scope.beforeNewEntity()

      # Fetch blank entity
      $scope.resource.new(angular.extend({}, $scope.optParams)
      ).$promise.then((success) ->
        $rootScope.spinningService.stop('modal')
        $scope.entity = success.data
        $scope.localLookup = success.lookup
        $scope.modalProperties.visible = true
        $scope.newEntitySuccess(success)
        $scope.newEntitySuccessNotification(success)
        deferred.resolve(success)
      , (error) ->
        $rootScope.spinningService.stop('modal')
        $scope.newEntityFailure(error)
        $scope.newEntityFailureNotification(error)
        deferred.reject(error)
      )

      deferred.promise

    $scope.closeNewEntityModal = (elementStr) ->
      angular.element("##{elementStr}").modal('hide')
      $scope.resetEntityModal(elementStr)
      $scope.afterCloseEntityModal elementStr

    $scope.createEntity = (elementStr, $event) ->
      $scope.beforeCreateEntity($event)

      $event = ShButtonState.initializeEvent $event
      ShButtonState.loading $event

      # Persist entity into database
      $scope.resource.save(angular.extend({}, $scope.optParams)
      , data: $scope.entity
      ).$promise.then((success) ->
        $scope.closeNewEntityModal(elementStr)
        $scope.recentlyCreatedIds.push success.data.id if $scope.recentlyCreatedIds?
        $scope.refreshGrid() if typeof $scope.getPagedDataAsync is 'function'
        ShButtonState.enable $event
        $scope.createEntitySuccess(success, $event)
        $scope.createEntitySuccessNotification(success, $event)
      , (error) ->
        $scope.errors = error.data.error.errors
        ShButtonState.enable $event
        $scope.createEntityFailure(error, $event)
        $scope.createEntityFailureNotification(error, $event)
      )

    # =========================================================================
    # Update
    # =========================================================================

    $scope.showEditEntityModal = (id, elementStr) ->
      angular.element("##{elementStr}").modal('show')
      angular.element("##{elementStr}").on 'hidden.bs.modal', () ->
        $scope.closeEditEntityModal elementStr, id
        $scope.modalProperties.visible = false
      $scope.fetchEditEntity(id)

    $scope.fetchEditEntity = (id) ->
      deferred = $q.defer()
      $rootScope.spinningService.spin('modal')
      $scope.beforeEditEntity(id)

      # Fetch entity for editing
      $scope.resource.edit(angular.extend({id: id}, $scope.optParams)
      ).$promise.then((success) ->
        $rootScope.spinningService.stop('modal')
        $scope.entity = success.data
        $scope.localLookup = success.lookup
        $scope.modalProperties.visible = true
        $scope.editEntitySuccess(success, id)
        $scope.editEntitySuccessNotification(success, id)
        deferred.resolve(success)
      , (error) ->
        $rootScope.spinningService.stop('modal')
        $scope.editEntityFailure(error, id)
        $scope.editEntityFailureNotification(error, id)
        deferred.reject(error)
      )
      deferred.promise

    $scope.closeEditEntityModal = (elementStr, id) ->
      angular.element("##{elementStr}").modal('hide')
      $scope.resetEntityModal(elementStr)
      $scope.afterCloseEntityModal elementStr, id

    $scope.updateEntity = (elementStr, $event) ->
      $scope.beforeUpdateEntity($event)

      $event = ShButtonState.initializeEvent $event
      ShButtonState.loading $event

      # Update entity into database
      $scope.resource.update(angular.extend({id: $scope.entity.id}, $scope.optParams)
      , data: $scope.entity
      ).$promise.then((success) ->
        $scope.closeEditEntityModal(elementStr, $scope.entity.id)
        $scope.recentlyUpdatedIds.push success.data.id if $scope.recentlyUpdatedIds?
        $scope.refreshGrid() if typeof $scope.getPagedDataAsync is 'function'
        ShButtonState.enable $event
        $scope.updateEntitySuccess(success, $event)
        $scope.updateEntitySuccessNotification(success, $event)
      , (error) ->
        $scope.errors = error.data.error.errors
        ShButtonState.enable $event
        $scope.updateEntityFailure(error, $event)
        $scope.updateEntityFailureNotification(error, $event)
      )

    # =========================================================================
    # Destroy
    # =========================================================================

    $scope.destroyEntity = (id, $event) ->
      deferred = $q.defer()

      $event = ShButtonState.initializeEvent $event
      ShButtonState.loading $event

      $scope.beforeDestroyEntity($event)

      # Delete entity from database
      $scope.resource.delete(angular.extend({id: id}, $scope.optParams)
      ).$promise.then((success) ->
        $scope.recentlyDeletedIds.push success.data.id if $scope.recentlyDeletedIds?
        $scope.refreshGrid() if typeof $scope.getPagedDataAsync is 'function'
        $scope.destroyEntitySuccess(success, $event)
        $scope.destroyEntitySuccessNotification(success, $event)
        angular.element('.modal').modal('hide')
        deferred.resolve success
      , (error) ->
        $scope.destroyEntityFailure(error, $event)
        $scope.destroyEntityFailureNotification(error, $event)
        ShButtonState.enable $event
        deferred.reject error
      )

      deferred.promise

    $scope.deleteEntity = (id, $event) ->
      $scope.destroyEntity(id, $event)

    $scope.multipleDestroyEntity = (ids) ->
      $scope.beforeMultipleDestroyEntity()

      # Delete entity from database
      $scope.resource.multiple_delete(angular.extend({'ids[]': ids}, $scope.optParams)
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
