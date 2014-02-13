module = angular.module('App.Authenticated', ['ui.router'])

module.config ($stateProvider) ->
    $stateProvider.state 'authenticated',
        templateUrl: 'modules/Authenticated/Authenticated.html'
        abstract: true
        resolve:
            currentUser: (AppObject, Context, Authentication, $rootScope) ->
                Authentication.checkCredentials().then (userId) ->
                    AppObject.getUser(userId)
        onEnter: (user) ->
            user.open()
            $rootScope.currentUser = user
        onExit: (AppObject, $rootScope) ->
            AppObject.close()
            $rootScope.currentUser = null
 