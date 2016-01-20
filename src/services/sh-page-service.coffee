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
# @file_name app/scripts/services/page-service.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains Page Service service.
# =============================================================================


angular.module("sh.page.service", []).service "ShPageService", ['$window', ($window) ->
  _pageTitle = ''
  _appName = ''

  # ===========================================================================
  # METHODS
  # ===========================================================================

  # Public Methods
  # ===========================================================================

  # Page Title
  @setPageTitle = (pageTitle) ->
    _pageTitle = pageTitle
    $window.document.title = @getAppName() + ' - ' + @getPageTitle()
    @getPageTitle()
    return

  @getPageTitle = () ->
    _pageTitle


  # App Name
  @setAppName = (appName) ->
    _appName = appName
    $window.document.title = @getAppName() + ' - ' + @getPageTitle()
    @getAppName()
    return

  @getAppName = () ->
    _appName

  # Private Methods
  # ===========================================================================

  return this
]
