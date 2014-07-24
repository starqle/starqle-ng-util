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
# @file_name src/directives/sh-form.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shForm directive
# =============================================================================

"use strict"

angular.module('sh.form',[]).directive "shForm", [ ->
  restrict: 'C'
  link: (scope, elem, attrs) ->
    scope.shHighlightRequired = {} unless scope.shHighlightRequired
    scope.shHighlightRequired[attrs.name] = false
    scope.$watch "shHighlightRequired.#{attrs.name}", (newVal, oldVal) ->
      if "#{scope.shHighlightRequired[attrs.name]}" == 'true'
        jQuery(".sh-form").addClass('sh-highlight-required')
      else
        jQuery(".sh-form").removeClass('sh-highlight-required')
]
