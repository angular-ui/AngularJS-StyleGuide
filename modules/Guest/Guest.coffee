module = angular.module('App.Guest', ['ui.router'])

module.config ($stateProvider) ->
    $stateProvider.state 'guest',
        templateUrl: 'modules/Guest/Guest.html'
        abstract: true
 
