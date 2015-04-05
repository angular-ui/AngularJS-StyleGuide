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
            authenticatedUser: (AppObject, Authentication, $state, $q) ->
                Authentication.checkCredentials().then (userId) ->
                    AppObject.getUser(userId)
                , (error) ->
                    # must return a rejected promise in order to stay in rejected-mode
                    $q.reject( $state.go('login') )
        onEnter: (user) ->
            user.open()
        onExit: (user, $rootScope) ->
            user.close()
 
