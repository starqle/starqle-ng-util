# =============================================================================
# Copyright (c) 2014 All Right Reserved, http://starqle.com/
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
# @file_name src/directives/sh-dialog.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shDialog directive
# =============================================================================

"use strict"

angular.module('sh.dialog', []).directive "shDialog", ['$compile', '$templateCache', ($compile, $templateCache) ->
  restrict: 'E'
  transclude: true
  replace: true
  scope:
    shDialogOk: '&'
    shDialogCancel: '&?'
    shDialogContent: '@?'
    shDialogSrc: '@?'
    shDialogClass: '@?'
    title: '@?'
  template: '''
      <span>
        <a title="{{getTitle()}}" ng-click="onHandleClick()" ng-transclude></a>
      </span>
    '''

  link: (scope, element, attrs) ->
    scope.getShDialogModal = ->
      element.find('#modal-sh-dialog')

    scope.getShDialogContent = ->
      scope.shDialogContent or 'Are you sure?'

    scope.getTitle = ->
      scope.title or element.text()

    scope.onHandleClick = ->
      unless scope.getShDialogModal().length > 0
        shDialogModal = angular.element(
          '''
            <div id="modal-sh-dialog" tabindex="-1" role="dialog" aria-labelledby="modalShDialogLabel" aria-hidden="true" class="modal">
              <div class="modal-dialog {{shDialogClass || 'modal-sm'}}">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;</button>
                    <div class="modal-title">&nbsp;</div>
                  </div>
                  <div class="modal-body">
                    <div class="row">
                      <div class="col-lg-12 sh-dialog-modal-content"></div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button ng-click="onHandleModalOkClick()" class="btn btn-primary">OK</button>
                    <button data-dismiss="modal" class="btn btn-default">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          '''
        )
        $compile(shDialogModal)(scope)

        if scope.shDialogSrc
          shDialogModalSrc = angular.element $templateCache.get(scope.shDialogSrc)
          $compile(shDialogModalSrc)(scope.$parent)
          shDialogModal.find('.sh-dialog-modal-content').append(shDialogModalSrc)

        else
          shDialogModal.find('.sh-dialog-modal-content').append(scope.getShDialogContent())

        element.append(shDialogModal)

      scope.getShDialogModal().modal('show')
      return

    scope.onHandleModalOkClick = ->
      scope.getShDialogModal().modal('hide')
      scope.shDialogOk()
      return
]
