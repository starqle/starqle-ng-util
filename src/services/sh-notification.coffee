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
# @file_name src/services/sh-notification.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shNotification service.
# =============================================================================

"use strict";

angular.module('sh.notification',[]).service "ShNotification", ['$timeout', '$interval', ($timeout, $interval) ->

  defaultLifetime = 4000
  defaultDuration = 500

  @toasts = []
  @notifications = []

  #
  # Adding toast
  #
  # @param options [Object] {type: ..., message: ...}
  # @param lifetimeOpt(optional) [Integer]
  # @param durationOpt(optional) [Integer]
  @addToast = (options, lifetimeOpt, durationOpt) ->
    # Default options
    opts =
      index: 0
      lifetime: defaultLifetime
      duration: defaultDuration
      # beforeAdd event callback
      beforeAdd: ->
      # afterAdd event callback
      afterAdd: ->
      # beforeRemove event callback
      beforeRemove: ->
      # afterRemove event callback
      afterRemove: ->

    # Init options
    if options.type? and options.message?
      opts.toast = options
      opts.lifetime = lifetimeOpt if lifetimeOpt?
      opts.duration = durationOpt if durationOpt?
      opts.toast.deathtime = Date.now() + opts.lifetime
      opts.toast.alive = true
    else
      angular.extend(opts, options)

    opts.beforeAdd.call this
    @toasts.unshift opts.toast
    opts.afterAdd.call this

  #
  # Removing oldest toast
  #
  @removeOldestToast = () ->
    @removeToast(@toasts.length - 1)

  #
  # Removing toast
  #
  # @param options [Object] {type: ..., message: ...}
  # @param lifetimeOpt(optional) [Integer]
  # @param durationOpt(optional) [Integer]
  @removeToast = (options, lifetimeOpt, durationOpt) ->
    # Default options
    opts =
      index: 0
      lifetime: defaultLifetime
      duration: defaultDuration
      # beforeRemove event callback
      beforeRemove: ->
      # afterRemove event callback
      afterRemove: ->

    if typeof (options * 1) is "number" and isFinite(options * 1)
      opts.index = options * 1
      opts.lifetime = lifetimeOpt if lifetimeOpt?
      opts.duration = durationOpt if durationOpt?
    else
      angular.extend(opts, options)

    # Setup local variable for toast
    toasts = @toasts

    # $timeout ->
    opts.beforeRemove.call this

    angular.element("#toast-group-item-#{opts.index}").animate
      height: 0
      opacity: 0
    , opts.duration

    $timeout ->
      toasts.splice opts.index, 1
      opts.afterRemove.call this
    , opts.duration + 1
    # , opts.lifetime

  #
  # Periodic checking
  #
  @runInterval = (self) ->
    $interval ->
      for toast, i in self.toasts
        if toast.alive and toast.deathtime < Date.now()
          toast.alive = false
          self.removeToast(i, 1) unless toast.type in ['error', 'danger']
    , 500
    , 0
    , false

  #
  # Adding notification
  #
  # @param options [Object] {type: ..., message: ...}
  # @param lifetimeOpt(optional) [Integer]
  # @param durationOpt(optional) [Integer]
  @addNotification = (options) ->
    # Default options
    opts =
      index: 0
      # beforeAdd event callback
      beforeAdd: ->
      # afterAdd event callback
      afterAdd: ->
      # beforeRemove event callback
      beforeRemove: ->
      # afterRemove event callback
      afterRemove: ->

    # Init options
    if options.type? and options.message?
      opts.notification = options
    else
      angular.extend(opts, options)

    opts.beforeAdd.call this
    @notifications.unshift opts.notification
    opts.afterAdd.call this

  #
  # Removing notification
  #
  # @param options [Object] {type: ..., message: ...}
  # @param lifetimeOpt(optional) [Integer]
  # @param durationOpt(optional) [Integer]
  @removeNotification = (options, durationOpt) ->
    # Default options
    opts =
      index: 0
      duration: defaultDuration
      # beforeRemove event callback
      beforeRemove: ->
      # afterRemove event callback
      afterRemove: ->

    if typeof (options * 1) is "number" and isFinite(options * 1)
      opts.index = options * 1
      opts.duration = durationOpt if durationOpt?
    else
      angular.extend(opts, options)

    # Setup local variable for notification
    notifications = @notifications

    opts.beforeRemove.call this

    angular.element("#notification-group-item-#{opts.index}").animate
      height: 0
      opacity: 0
    , opts.duration

    $timeout ->
      notifications.splice opts.index, 1
      opts.afterRemove.call this
    , opts.duration

  #
  #
  #
  @toastByResponse = (response, defaultToast) ->
    if response.notification
      for n in response.notification.notifications
        do (n) =>
          @addToast
            type: n.type
            data: response
            message: n.message
    else if response.data and response.data.error
      for n in response.data.error.errors
        do (n) =>
          @addToast
            type: 'danger'
            data: response
            message: n.message
    else if defaultToast
      @addToast
        type: defaultToast.type
        data: response
        message: defaultToast.message
    else
      @addToast
        type: 'danger'
        data: response
        message: response.data

  #
  #
  #
  @runInterval(this)

  return this
]
