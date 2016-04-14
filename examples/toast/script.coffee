app = angular.module('exampleApp', [ 'sh.notification' ])
app.controller 'ExampleController', [
  '$scope'
  'ShNotification'
  ($scope, ShNotification) ->

    # Toasts
    @toasts = ShNotification.toasts
    @dismissToast = (index) ->
      ShNotification.removeToast(index, 1)
      return

    @addExampleToast = () ->
      ShNotification.addToast
        type: 'success'
        message: 'This is example toast'
      return

    @addExampleToastByType = (toastType) ->
      ShNotification.addToast
        type: toastType
        message: 'This is example toast by type ' + toastType
      return


    return
]
