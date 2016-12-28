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
    shDialogOnHide: '&?'
    shDialogCancel: '&?'

    shDialogHeader: '@?'
    shDialogBody: '@?'
    shDialogFooter: '@?'

    shDialogForm: '@?'

    shDialogClass: '@?'

    shDialogEntity: '=?'
    shDialogLoading: '=?'
    shDialogDisabled: '&?'

    shDialogLabelOk: '@?'
    shDialogLabelClose: '@?'
    shDialogLabelCancel: '@?'

    shDialogParent: '=?'

    title: '@?'

  link: (scope, element, attrs) ->
    # Default label
    shDialogLabelOk = scope.shDialogLabelOk ? 'Submit'
    shDialogLabelClose = scope.shDialogLabelClose ? 'Close'
    shDialogLabelCancel = scope.shDialogLabelCancel ? 'Cancel'

    #
    #
    #
    angular.element(element).addClass('sh-dialog').children().eq(0).on( 'click', ->
      unless angular.element(this).find('> *:first-child').attr('disabled') is 'disabled'
        onHandleClick()
      return
    )


    #
    # Show the modal
    # using scope for decorateable
    #
    scope.showModal = (elmt) ->
      # TODO
      $timeout(
        () ->
          elmt.modal('show')
          return
        20
      )
      return

    #
    # Hide the modal
    # using scope for decorateable
    #
    scope.hideModal = () ->
      angular.element('.modal').modal('hide')
      return

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
          """
                  <div class="modal-header">
                    <button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;</button>
                    <h4 class="modal-title"></h4>
                  </div>
                  <div class="modal-body"></div>
                  <div class="modal-footer"></div>
                </form>
              </div>
            </div>
          """
        )
      else
        shDialogModal = angular.element(
          '<div id="modal-sh-dialog-' + modalIdSuffix + '" tabindex="-1" role="dialog" aria-labelledby="modalShDialogLabel" aria-hidden="true" class="modal">' +
          '<div class="modal-dialog ' + (scope.shDialogClass ? 'modal-sm') + '">' +
          """
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
          """
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
        buttonOkElement = """
          <button
            class="btn btn-primary margin-left"

            ng-disabled="
          """ +
          'aliasShDialogDisabled()' +

          """
            "

            ng-click="
          """ +
          'aliasShDialogOk($event)' +

          """
            "

            sh-submit="
          """ +
          '{{aliasShDialogForm}}' +

          """
            "

            ng-attr-title="#{shDialogLabelOk}"
            type="submit"
          >
          #{shDialogLabelOk}
          </button>
          """

        shDialogModal.find('.modal-footer').append buttonOkElement

        shDialogModal.find('.modal-footer').append """
          <button type="button" data-dismiss="modal" class="btn btn-default margin-left">
            #{shDialogLabelCancel}
          </button>
        """
      else
        shDialogModal.find('.modal-footer').append """
          <button type="button" data-dismiss="modal" class="btn btn-default margin-left">
            #{shDialogLabelClose}
          </button>
        """

      parent = scope.shDialogParent ? scope.$parent

      $compile(shDialogModal)(parent)

      # Append modal to body
      angular.element('body').append(shDialogModal)

      #
      # TODO:
      #
      parent.shDialogEntity = angular.copy(scope.shDialogEntity, {}) if scope.shDialogEntity?

      shDialogModal.on(

        'show.bs.modal', ->
          parent.shDialogLoading = true

          deferred = $q.defer()

          $q.when(
            (scope.shDialogBeforeShow || angular.noop)()
          ).then(
            (success) ->
              parent.shDialogEntity = angular.copy(success.data, {}) if success?.data?

              ### ###
              deferred.resolve success
            (error) ->
              ### ###
              # Close this modal
              scope.hideModal()
              deferred.reject error
          ).finally(
            () ->
              ### ###
              parent.shDialogLoading = false
              return
          )

          deferred.promise

      ).on(
        'hidden.bs.modal', ->
          scope.shDialogOnHide && scope.shDialogOnHide()
          shDialogModal.remove()
          parent.shDialogEntity = {}
          return
      )


      scope.showModal(shDialogModal)


      parent.aliasShDialogDisabled = () ->
        return true if parent.shDialogLoading

        return scope.shDialogDisabled() if attrs.shDialogDisabled?

        return false unless scope.shDialogForm?

        parent[scope.shDialogForm]?.$pristine or
        parent[scope.shDialogForm]?.$invalid or
        parent[scope.shDialogForm]?.$submitted


      parent.aliasShDialogOk = ($event) ->
        deferred = $q.defer()

        parent.shDialogLoading = true
        $q.when(
          (scope.shDialogOk || angular.noop)({$event: $event})
        ).then(
          (success) ->
            scope.hideModal()
            # It doesnt need to enable the button, the form is already hidden
            deferred.resolve()

          (error) ->
            # Only button enabler. do not set unstouched
            parent[scope.shDialogForm]?.$submitted = false if scope.shDialogForm?
            deferred.reject()

        ).finally(
          () ->
            parent.shDialogLoading = false
            return
        )

        deferred.promise

      parent.aliasShDialogForm = scope.shDialogForm

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
    """
      <button type="button" data-dismiss="modal" class="btn btn-default margin-left" translate="ACTION_CANCEL">
      </button>
    """
)
