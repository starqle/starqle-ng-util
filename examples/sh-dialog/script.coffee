app = angular.module('exampleApp', [ 'sh.dialog.module' ])
app.controller 'ShDialogExampleController', [
  '$scope'
  ($scope) ->

    @beforeSayHello = () ->
      alert 'Get ready...'
      return

    @sayHello = (name) ->
      alert "Hello, #{name}!"
      return

    @customAlert = () ->
      alert 'This is alert'
      return

    return
]
