###
Authentication Module
=====================

Most of the actual app is located under here. This abstract module primarily tackles authenticating the user
###

module = angular.module('App.Authenticated', ['ui.router'])

module.config ($stateProvider) ->
    $stateProvider.state 'authenticated',
        templateUrl: 'modules/Authenticated/Authenticated.html'
        abstract: true
        resolve:
            currentUser: (AppObject, Authentication) ->
                Authentication.checkCredentials().then (userId) ->
                    AppObject.getUser(userId)
        onEnter: (user) ->
            user.open()
            $rootScope.currentUser = user
        onExit: (user, $rootScope) ->
            user.close()
            $rootScope.currentUser = null
 
