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


#
# Only responsible for displaying modal (not hiding modal).
# If you want to hide this modal, you must call it manually
#
shDialogModule.directive "shDialog", ['$compile', '$templateCache', '$timeout', '$q', ($compile, $templateCache, $timeout, $q) ->
  restrict: 'A'
  replace: true
  scope:
    shDialogOk: '&?'
    shDialogBeforeShow: '&?'
    shDialogCancel: '&?'

    shDialogHeader: '@?'
    shDialogBody: '@?'
    shDialogFooter: '@?'

    shDialogForm: '@?'

    shDialogClass: '@?'

    shDialogEntity: '=?'
    shDialogLoading: '=?'
    shDialogDisabled: '&?'

    title: '@?'

  link: (scope, element, attrs) ->
    #
    #
    #
    angular.element(element).addClass('sh-dialog').children().eq(0).on( 'click', ->
      onHandleClick()
    )

    #
    #
    #
    onHandleClick = ->
      modalIdSuffix = scope.$id

      shDialogModal = null

      if scope.shDialogForm?
        shDialogModal = angular.element(
          '<div id="modal-sh-dialog-' + modalIdSuffix + '" tabindex="-1" role="dialog" aria-labelledby="modalShDialogLabel" aria-hidden="true" class="modal">' +
          '<div class="modal-dialog ' + (scope.shDialogClass ? 'modal-sm') + '">' +

          '<form class="modal-content" novalidate="" name="' + scope.shDialogForm + '">' +
          '''
                  <div class="modal-header">
                    <button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;</button>
                    <h4 class="modal-title"></h4>
                  </div>
                  <div class="modal-body"></div>
                  <div class="modal-footer"></div>
                </form>
              </div>
            </div>
          '''
        )
      else
        shDialogModal = angular.element(
          '<div id="modal-sh-dialog-' + modalIdSuffix + '" tabindex="-1" role="dialog" aria-labelledby="modalShDialogLabel" aria-hidden="true" class="modal">' +
          '<div class="modal-dialog ' + (scope.shDialogClass ? 'modal-sm') + '">' +
          '''
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;</button>
                    <h4 class="modal-title"></h4>
                  </div>
                  <div class="modal-body"></div>
                  <div class="modal-footer"></div>
                </div>
              </div>
            </div>
          '''
        )


      # Header setup
      if scope.shDialogHeader?
        compiledShDialogHeader = angular.element $templateCache.get(scope.shDialogHeader)
        shDialogModal.find('.modal-title').append(compiledShDialogHeader)
      else
        shDialogModal.find('.modal-title').html(scope.title)

      # Body setup
      if scope.shDialogBody?
        compiledShDialogBody = angular.element $templateCache.get(scope.shDialogBody)
        shDialogModal.find('.modal-body').append(compiledShDialogBody)

      # Footer setup
      if scope.shDialogFooter?
        compiledShDialogFooter = angular.element $templateCache.get(scope.shDialogFooter)
        shDialogModal.find('.modal-footer').append(compiledShDialogFooter)
      else if attrs.shDialogOk?
        buttonOkElement = '''
          <button
            class="btn btn-primary margin-left"

            ng-disabled="
          ''' +
          'aliasShDialogDisabled()' +

          '''
            "

            ng-click="
          ''' +
          'aliasShDialogOk($event)' +

          '''
            "

            sh-submit="
          ''' +
          '{{aliasShDialogForm}}' +

          '''
            "

            ng-attr-title="{{'ACTION_SUBMIT' | translate}}"
            translate="ACTION_SUBMIT"
            type="submit"
          >
          </button>
          '''

        shDialogModal.find('.modal-footer').append buttonOkElement

        shDialogModal.find('.modal-footer').append '''
          <button type="button" data-dismiss="modal" translate="ACTION_CANCEL" class="btn btn-default margin-left">
          </button>
        '''
      else
        shDialogModal.find('.modal-footer').append '''
          <button type="button" data-dismiss="modal" translate="ACTION_CLOSE" class="btn btn-default margin-left">
          </button>
        '''


      $compile(shDialogModal)(scope.$parent)

      # Append modal to body
      angular.element('body').append(shDialogModal)

      #
      # TODO:
      #
      scope.$parent.shDialogEntity = angular.copy(scope.shDialogEntity, {}) if scope.shDialogEntity?

      shDialogModal.on(

        'show.bs.modal', ->
          scope.$parent.shDialogLoading = true

          deferred = $q.defer()

          $q.when(
            (scope.shDialogBeforeShow || angular.noop)()
          ).then(
            (success) ->
              scope.$parent.shDialogEntity = angular.copy(success.data, {}) if success?.data?

              ### ###
              deferred.resolve success
            (error) ->
              ### ###
              # Close this modal
              hideModal()
              deferred.reject error
          ).finally(
            () ->
              ### ###
              scope.$parent.shDialogLoading = false
              return
          )

          deferred.promise

      ).on(
        'hidden.bs.modal', ->
          shDialogModal.remove()
          scope.$parent.shDialogEntity = {}
          return
      )

      # TODO
      $timeout( ->
        shDialogModal.modal('show')
      , 20
      )

      scope.$parent.aliasShDialogDisabled = () ->
        return true if scope.$parent.shDialogLoading

        return scope.shDialogDisabled() if attrs.shDialogDisabled?

        return false unless scope.shDialogForm?

        scope.$parent[scope.shDialogForm]?.$pristine or
        scope.$parent[scope.shDialogForm]?.$invalid or
        scope.$parent[scope.shDialogForm]?.$submitted


      scope.$parent.aliasShDialogOk = ($event) ->
        deferred = $q.defer()

        scope.$parent.shDialogLoading = true
        $q.when(
          (scope.shDialogOk || angular.noop)({$event: $event})
        ).then(
          (success) ->
            hideModal()
            # It doesnt need to enable the button, the form is already hidden
            deferred.resolve()

          (error) ->
            # Only button enabler. do not set unstouched
            scope.$parent[scope.shDialogForm]?.$submitted = false if scope.shDialogForm?
            deferred.reject()

        ).finally(
          () ->
            scope.$parent.shDialogLoading = false
            return
        )

        deferred.promise

      scope.$parent.aliasShDialogForm = scope.shDialogForm

      return

    #
    #
    #
    hideModal = () ->
      angular.element('.modal').modal('hide')
      return

    scope.$watch '$parent.shDialogLoading', (newVal, oldVal) ->
      if newVal?
        scope.shDialogLoading = newVal if scope.shDialogLoading?
      return

    return
]


shDialogModule.directive('shDialogDismissButton', ->
  restrict: 'EA'
  template: (element, attrs) ->
    '''
      <button type="button" data-dismiss="modal" translate="ACTION_CANCEL" class="btn btn-default margin-left">
      </button>
    '''
)
