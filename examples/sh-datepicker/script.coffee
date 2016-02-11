moment.tz.setDefault('America/New_York')

app = angular.module('exampleApp', [ 'sh.datepicker.module' ])
app.controller 'ShDatepickerExampleController', [
  '$scope'
  ($scope) ->
    $scope.currentTimezone = moment.defaultZone.name
    @entity =
      basic_date: '2015-10-22'
      from_date: '2015-10-15'
      thru_date: '2015-10-30'
      basic_datetime: '1455008908000'

    @getLoadedNames = () ->
      moment.tz.names()


    $scope.$watch 'currentTimezone', (newVal, oldVal) ->
      if newVal?
        moment.tz.setDefault(newVal)
      return

    return
]
