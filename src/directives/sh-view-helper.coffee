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
# @file_name src/directives/sh-view-helper.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains colection of view helpers directive
# =============================================================================


angular.module('sh.view.helper', []

).directive('yesNo', ->
  #
  #
  #
  restrict: 'A'
  scope:
    yesNo: '='
  template: (element, attrs) ->
    '''
      <span ng-if="yesNo == true" class="text-success"><i class="fa fa-left fa-check"></i>{{"LABEL_YES" | translate}}</span>
      <span ng-if="yesNo == false" class="text-danger"><i class="fa fa-left fa-times"></i>{{"LABEL_NO" | translate}}</span>
      <span ng-if="yesNo == null || yesNo == undefined" class="text-muted"><i class="fa fa-left fa-dash"></i></span>
    '''
  link: (scope) ->
    if scope.yesNo in [true, "true", 1, "TRUE"]
      scope.yesNo = true

    if scope.yesNo in [false, "false", 0, "FALSE"]
      scope.yesNo = false
    return

).directive('codeName', ->
  #
  #
  #
  restrict: 'EA'
  scope:
    codeNameCode: '=?'
    codeNameName: '=?'
  template: (element, attrs) ->
    '''
      <span title="{{codeNameCode}} ({{codeNameName}})">
        {{codeNameCode}} <small class="text-muted">({{codeNameName}})</small>
      </span>
    '''
)
