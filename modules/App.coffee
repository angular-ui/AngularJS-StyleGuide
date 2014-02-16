module = angular.module('App', ['ui.router', 'App.Authentication', 'App.Guest'])

module.config ($urlRouterProvider, $provide) ->

	# Default State
    $urlRouterProvider.otherwise("projects")


module.run () ->
