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
# @file_name src/directives/sh-valid-file.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains validation related validation directive
# =============================================================================

# http://stackoverflow.com/questions/16207202/required-attribute-not-working-with-file-input-in-angular-js


shValidationModule.directive "validFile", ['$timeout', ($timeout) ->
  scope:
    validFileName: '='
  require: 'ngModel'
  link: (scope, el, attrs, ngModel) ->
    scope.$watch 'validFileName', (newFile) ->
      if newFile?
        # TODO: HACKISH: ensure form pristine by surounding setViewValue with $pristine false-true
        # ngModel.$pristine = false
        # ngModel.$setViewValue scope.validFileName
        # ngModel.$pristine = true

        $timeout (->
          ngModel.$pristine = false
          ngModel.$setViewValue scope.validFileName
          ngModel.$pristine = true
        ), 200

        $timeout (->
          ngModel.$pristine = false
          ngModel.$setViewValue scope.validFileName
          ngModel.$pristine = true
        ), 2000

    el.bind 'change', ->
      scope.$apply ->
        ngModel.$setViewValue el.val()
        ngModel.$render()
        return
      return
    return
]

#
# Should set required value to null
# Specifically used for select with ng-options
# Force null if an id in an object is null => {id: null}
#
shValidationModule.directive 'validIdNotNull', ->
  require: 'ngModel'
  link: (scope, elem, attr, ngModel) ->
    # For model -> DOM validation
    ngModel.$formatters.unshift (value) ->
      return null unless value?.id?
      value
    return
