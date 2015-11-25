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
# @file_name src/prototypes/sh-form.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains shForm Prototype
# =============================================================================

"use strict"

shFormModule.run ['$rootScope', ($rootScope) ->


  ###*
  # @ngdoc factory
  # @name shForm
  #
  # @description
  # ShForm
  ###
  $rootScope.shForm = [
    ->
      self = this

      @entityForm = null unless @entityForm?
      @entity = null unless @entity?

      ###*
      # @ngdoc method
      # @name validationClass
      #
      # @description
      # Gives elements a class that mark its fieldname state
      #
      # @returns {String} String as class that mark element state
      ###
      @validationClass = (fieldName) ->
        result = ''
        if @entityForm?[fieldName]?
          if @entityForm[fieldName].$invalid
            if @entityForm[fieldName].$dirty
              result += 'has-error '
            else
              result += 'has-pristine-error '
          else if @entityForm[fieldName].$dirty and @entityForm[fieldName].$valid
            result += 'has-success '
        result


      ###*
      # @ngdoc method
      # @name isDisabled
      #
      # @description
      # Return this entity form state
      #
      # @returns {Boolean} entityForm state
      ###
      @isDisabled = () ->
        return true unless @entityForm?
        @entityForm?.$pristine or
        @entityForm?.$invalid or
        @entityForm?.$submitted


      ###*
      # @ngdoc method
      # @name reset
      #
      # @description
      # Resset all the form state. `$dirty: false`, `$pristine: true`, `$submitted: false`, `$invalid: true`
      #
      # @returns {*}
      ###
      @reset = () ->
        @entityForm?.$setPristine()
        @entityForm?.$setUntouched()


      ###*
      # @ngdoc method
      # @name resetSubmitted
      #
      # @description
      # Set `$submitted` to `false`, but not change the `$dirty` state.
      # Should be used for failing submission.
      #
      # @returns {*}
      ###
      @resetSubmitted = () ->
        @entityForm?.$submitted = false
  ]
]
