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
# @file_name src/main.coffee
# @author Giovanni Sakti
# @email giosakti@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains entry point for Starqle Angular utilities
# =============================================================================

angular.module 'starqle.ng.util', [
  # config
  'on.root.scope',

  # directives
  'sh.bootstrap',
  'sh.collapsible',
  'sh.datepicker',
  'sh.focus',
  'sh.number.format',
  'sh.segment',
  'sh.submit',
  'sh.view.helper',

  # factories
  'auth.token.handler',

  # filters
  'sh.filter.collection',
  'sh.floating.precision',
  'sh.remove.duplicates',
  'sh.strip.html',
  'sh.strip.to.newline',
  'sh.truncate',

  # modules
  'sh.api.module',
  'sh.dialog.module',
  'sh.form.module',
  'sh.helper.module',
  'sh.persistence.module',
  'sh.spinning.module',
  'sh.table.module',
  'sh.validation.module',

  # services
  'sh.notification',
  'sh.page.service'
]
