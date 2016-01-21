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
# @file_name src/directives/sh-bootstrap.coffee
# @author Giovanni Sakti
# @email giosakti@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shTooltip directive
# =============================================================================


angular.module(
  'sh.bootstrap', []

).directive('shBootstrapTooltip', [ ->
  restrict: 'A'
  link: (scope, element, attrs) ->

    #
    # Events
    #
    angular.element(element).on('click', ->
      # workaround if somehow, the element is clicked. In this case, mouseleave is not enough
      angular.element(element).tooltip 'hide'
      return

    ).on('mouseenter', ->
      angular.element(element).tooltip 'show'
      return

    ).on('mouseleave', ->
      angular.element(element).tooltip 'hide'

      return
    )

    return
  ]

).directive('shBootstrapPopover', ['$timeout', ($timeout) ->
  restrict: 'A'
  link: (scope, element, attrs) ->
    #
    localAttrs =
      popoverId: null
      timeoutFn: null
      addTimeout: (element) ->
        localAttrs.timeoutFn = $timeout(->
          angular.element(element).popover('hide')
        , 100
        )
        return
      cancelTimeout: () ->
        $timeout.cancel localAttrs.timeoutFn

    # Used for on/off
    cancelTimeout = () ->
      localAttrs.cancelTimeout()

    addTimeout = () ->
      localAttrs.addTimeout(element)

    #
    # Events
    #
    angular.element(element).on('mouseenter', ->
      localAttrs.cancelTimeout()

      if angular.isUndefined(angular.element(element).attr('aria-describedby'))
        # show popover
        angular.element(element).popover('show')
      return

    ).on('mouseleave', ->
      # add timeout
      localAttrs.addTimeout(element)

    ).on('shown.bs.popover', ->
      # delete timeout on popover
      localAttrs.popoverId = angular.element(element).attr('aria-describedby')

      angular.element('#' + localAttrs.popoverId).on 'mouseenter', cancelTimeout
      angular.element('#' + localAttrs.popoverId).on 'mouseleave', addTimeout

    ).on('hide.bs.popover', ->
      angular.element('#' + localAttrs.popoverId).off 'mouseenter', cancelTimeout
      angular.element('#' + localAttrs.popoverId).off 'mouseleave', addTimeout
    )

    return
  ]
)
