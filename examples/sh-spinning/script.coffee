app = angular.module('exampleApp', [ 'sh.spinning.module' ])
app.controller 'ExampleController', [
  '$scope'
  'ShSpinningService'
  ($scope, ShSpinningService) ->

    self = this

    self.loading =
      panel01: false
      panel02: false
      panel03: true

    self.spinPanel = (strKey) ->
      self.loading[strKey] = true

    self.stopPanel = (strKey) ->
      self.loading[strKey] = false

    $scope.$watch(
      () ->
        self.loading.panel01
      (newVal, oldVal) ->
        if newVal?
          ShSpinningService.spin('panel-one', newVal)
        return
    )

    $scope.$watch(
      () ->
        self.loading.panel02
      (newVal, oldVal) ->
        if newVal?
          ShSpinningService.spin('panel-two', newVal)
        return
    )

    $scope.$watch(
      () ->
        self.loading.panel03
      (newVal, oldVal) ->
        if newVal?
          ShSpinningService.spin('panel-three', newVal)
        return
    )

    return
]
