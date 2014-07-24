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
# @file_name src/directives/sh-select2.coffee
# @author Bimo Horizon
# @email bimo@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shSelect2 directive
# =============================================================================

"use strict"

angular.module('sh.select2', []).directive "shSelect2", ['$rootScope', ($rootScope) ->
  restrict: 'A'
  scope:
    value: '=ngModel'
    shSelect2Config: '='
  require: '?ngModel'

  link: (scope, elem, attrs, ngModel) ->
    elem.select2
      allowClear: true
      placeholder: '- Silakan pilih -'
      minimumInputLength: 0
      initSelection: (elememt, callback) ->
        callback scope.value
      formatResult: (item) ->
        if scope.shSelect2Config.codeIdentifier
          if item[scope.shSelect2Config.codeIdentifier]
            "<div>(#{item[scope.shSelect2Config.codeIdentifier]}) - #{item.text}</div>"
          else
            "(-) #{item.text}</div>"
        else if item.code
          "<div>(#{item.code})#{if item.text is '' or item.text is null then '' else ' - ' + item.text}</div>"
        else
          "<div>#{item.text}</div>"
      formatSelection: (item) ->
        if scope.shSelect2Config.codeIdentifier
          if item[scope.shSelect2Config.codeIdentifier]
            "<div>(#{item[scope.shSelect2Config.codeIdentifier]}) - #{item.text}</div>"
          else
            "(-) #{item.text}</div>"
        else if item.code
          "<div>(#{item.code})#{if item.text is '' or item.text is null then '' else ' - ' + item.text}</div>"
        else
          "<div>#{item.text}</div>"
      ajax: 
        url: ->
          $rootScope.apiHost + scope.shSelect2Config.remote.url
        data: (term, page) ->
          $.extend({}, {
            username: $rootScope.currentUser.username
            auth_token: $rootScope.authToken
            q: term
            page_limit: 10
            page: page
          }, scope.shSelect2Config.params)
        results: (response, page) ->
          results = for item in response.data.items
            $.extend item,
              text: item.text || item.Text || item.name || item.Name
              id: item.id || item.Id || item.code || item.Code
              amount: item.Amount
            item
          results: results

    scope.applyValidity = ->
      if attrs.required
        ngModel.$setValidity 'required', (scope.value && scope.value.id? && scope.value.id isnt "")

    scope.applyValidity()

    # Binding on select
    elem.bind "change", (e) ->
      scope.$apply ->
        if e.added
          $.extend scope.value, e.added
          $.extend scope.value, {Id: e.added.id || e.added.code}
          $.extend scope.value, {Code: e.added.code} if e.added.code
        else
          scope.value = {}
      scope.applyValidity()

    scope.$watch "value", (newVal, oldVal) ->
      if newVal
        $.extend newVal,
          text: newVal.text ||  newVal.Text || newVal.name ||  newVal.Name
          id: newVal.id || newVal.Id || newVal.code || newVal.Code
        elem.select2('val', newVal)
      scope.applyValidity()
]
