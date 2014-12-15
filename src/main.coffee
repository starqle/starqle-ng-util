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

'use strict'

angular.module 'starqle.ng.util', [
  # config
  'on.root.scope',

  # directives
  'sh.collapsible',
  'sh.datepicker',
  'sh.dialog',
  'sh.focus',
  'sh.nicescroll',
  'sh.number.format',
  'sh.select2',
  'sh.spinning',
  'sh.submit',
  'sh.tooltip',

  # factories
  'auth.token.handler',

  # filters
  'sh.filter.collection',
  'sh.remove.duplicates',
  'sh.strip.html',
  'sh.strip.to.newline',
  'sh.truncate',

  # prototypes
  'sh.bulk.helper',
  'sh.init.ng.table',
  'sh.modal.persistence',
  'sh.ng.table.filter',
  'sh.persistence',

  # services
  'sh.button.state',
  'sh.element.finder',
  'sh.notification',
  'sh.page.service',
  'sh.priv',
  'sh.spinning.service'
]
