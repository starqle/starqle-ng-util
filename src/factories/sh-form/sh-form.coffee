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
# @file_name src/factories/sh-table-params.coffee
# @author Raymond Ralibi
# @email ralibi@starqle.com
# @company PT. Starqle Indonesia
# @note This file contains ShForm for holding tableParams data inspired by ng-table
# =============================================================================

###*
# @ngdoc object
# @name ShForm
#
# @description
# ShForm factory
#
###

shFormModule.factory(
  'ShForm'
  [
    () ->

      ShForm = () ->

        self = this

        self.entityForm = null

        ###*
        # @ngdoc method
        # @name validationClass
        #
        # @description
        # Gives elements a class that mark its fieldname state
        #
        # @returns {String} String as class that mark element state
        ###
        self.validationClass = (fieldName) ->
          result = ''
          if self.entityForm?[fieldName]?
            if self.entityForm[fieldName].$invalid
              if self.entityForm[fieldName].$dirty
                result += 'has-error '
              else
                result += 'has-pristine-error '
            else if self.entityForm[fieldName].$dirty and self.entityForm[fieldName].$valid
              result += 'has-success '
          result


        ###*
        # @ngdoc method
        # @name reset
        #
        # @description
        # Resset all the form state. `$dirty: false`, `$pristine: true`, `$submitted: false`, `$invalid: true`
        #
        # @returns {*}
        ###
        self.reset = () ->
          self.entityForm?.$setPristine()
          self.entityForm?.$setUntouched()


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
        self.resetSubmitted = () ->
          self.entityForm?.$submitted = false


        ###*
        # @ngdoc method
        # @name isDisabled
        #
        # @description
        # Return this entity form state
        #
        # @returns {Boolean} entityForm state
        ###
        self.isDisabled = () ->
          return true unless self.entityForm?
          self.entityForm?.$pristine or
          self.entityForm?.$invalid or
          self.entityForm?.$submitted


        ###*
        # @ngdoc method
        # @name isCompleted
        #
        # @description
        # Predicate to check whether the form in completed
        #
        # @returns {Boolean} true if `$pristine`, `$valid`, & not in `$submitted` state
        ###
        self.isCompleted = () ->
          self.entityForm?.$pristine and
          self.entityForm?.$valid and
          not self.entityForm.$submitted


        ###*
        # @ngdoc method
        # @name isDirtyAndValid
        #
        # @description
        # Predicate to check whether the form in `$dirty` and `$valid` state
        #
        # @returns {Boolean} true if `$dirty` and `$valid`
        ###
        self.isDirtyAndValid = () ->
          self.entityForm?.$dirty and
          self.entityForm?.$valid


        ###*
        # @ngdoc method
        # @name isDirtyAndInvalid
        #
        # @description
        # Predicate to check whether the form in `$dirty` and `$invalid` state
        #
        # @returns {Boolean} true if `$dirty` and `$invalid`
        ###
        self.isDirtyAndInvalid = () ->
          self.entityForm?.$dirty and
          self.entityForm?.$invalid


        ###*
        # @ngdoc method
        # @name isResetButtonDisabled
        #
        # @description
        # Predicate to check whether the reset button should disabled or not
        #
        # @returns {Boolean} true if `$pristine` or `$submitted`
        ###
        self.isResetButtonDisabled = () ->
          self.entityForm?.$pristine or
          self.entityForm?.$submitted



        #
        # Return this/self
        #
        this



      #
      # Return ShForm
      #
      ShForm
  ]
)
