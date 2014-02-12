module = angular.module('App', ['ui.router'])

module.config ($urlRouterProvider, $provide) ->

	# Default State
    $urlRouterProvider.otherwise("projects")


module.run () ->