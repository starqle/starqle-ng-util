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
# @file_name src/prototypes/sh-persistence.coffee
# @author Giovanni Sakti
# @email giosakti@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains prototype for controllers that utilize CRUD persistence
# =============================================================================

"use strict"

angular.module('sh.persistence', []).run ['$rootScope', ($rootScope) ->

  # ===========================================================================
  # persistence Prototype
  # ===========================================================================

  $rootScope.persistence = ['$scope', '$timeout', '$state', 'ShNotification', 'ShButtonState', ($scope, $timeout, $state, ShNotification, ShButtonState) ->

    $scope.entity = {}
    $scope.localLookup = {}
    $scope.privileges = {}
    $scope.saved = false

    $scope.toggleSelection = (obj, arr) ->
      idx = arr.indexOf(obj)
      if idx > -1
        arr.splice(idx, 1)
      else
        arr.push(obj)

    # =========================================================================
    # Methods for adding/removing nested attributes
    # =========================================================================

    $scope.addNestedAttributes = (objName) ->
      $scope.entity[objName].push {}

    $scope.removeNestedAttributes = (objName, obj) ->
      if obj['id']
        obj['_destroy'] = true
      else
        index = $scope.entity[objName].indexOf(obj)
        $scope.entity[objName].splice(index, 1)

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
      ShNotification.toastByResponse response,
        type: 'danger'
        message: 'Failed to Update'

    # =========================================================================
    # Save
    # =========================================================================

    $scope.saveEntity = ($event) ->
      # Update entity in database
      if $scope.entity.id?
        $scope.updateEntity($event)
      else # Persist entity into database
        $scope.createEntity($event)

    # =========================================================================
    # Create
    # =========================================================================

    $scope.createEntity = ($event) ->
      $scope.beforeCreateEntity()

      $event = ShButtonState.initializeEvent $event
      ShButtonState.loading $event

      # Persist entity into database
      $scope.resource.save($.extend({}, $scope.optParams)
      , data: $scope.entity
      ).$promise.then((success) ->

        # Generate params parameter
        params = {}
        params['id'] = success.data.id

        # Change state
        $state.transitionTo $scope.showPath, params

        # Callback
        $scope.createEntitySuccess(success)
        $scope.createEntitySuccessNotification(success)
        ShButtonState.enable $event
      , (error) ->
        # Callback
        $scope.createEntityFailure(error)
        $scope.createEntityFailureNotification(error)
        ShButtonState.enable $event
      )

    # =========================================================================
    # Update
    # =========================================================================

    $scope.updateEntity = ($event) ->
      $scope.beforeUpdateEntity()

      $event = ShButtonState.initializeEvent $event
      ShButtonState.loading $event

      # Set 'saved' flag
      $scope.saved = false

      # Update entity into database
      $scope.resource.update($.extend({id: $scope.entity.id}, $scope.optParams)
      , data: $scope.entity
      ).$promise.then((success) ->

        # Set 'saved' flag
        $scope.saved = true
        $timeout (->
          $scope.saved = false
        ), 5000

        # Callback
        $scope.updateEntitySuccess(success)
        $scope.updateEntitySuccessNotification(success)
        ShButtonState.enable $event

      , (error) ->
        # Callback
        $scope.updateEntityFailure(error)
        $scope.updateEntityFailureNotification(error)
        ShButtonState.enable $event
      )

    # =========================================================================
    # Initializer
    # =========================================================================

    $scope.init = () ->
      if $scope.id is undefined
        $scope.beforeNewEntity()

        # Fetch blank entity
        $scope.resource.new({}).$promise.then((success) ->
          $scope.entity = success.data
          $scope.localLookup = success.lookup
          $scope.privileges = success.privileges
          $scope.newEntitySuccess(success)
          $scope.newEntitySuccessNotification(success)
        , (error) ->
          $scope.newEntityFailure(error)
          $scope.newEntityFailureNotification(error)
        )
      else
        $scope.beforeEditEntity()

        # Fetch entity for editing
        $scope.resource.edit($.extend({id: $scope.id}, $scope.optParams)
        ).$promise.then((success) ->
          $scope.entity = success.data
          $scope.localLookup = success.lookup
          $scope.privileges = success.privileges
          $scope.editEntitySuccess(success)
          $scope.editEntitySuccessNotification(success)
        , (error) ->
          $scope.editEntityFailure(error)
          $scope.editEntityFailureNotification(error)
        )

    # Call the initializer function
    $scope.init() if !($scope.skipInit)
  ]
]
