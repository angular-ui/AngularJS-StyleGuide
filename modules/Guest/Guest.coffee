module = angular.module('App.Guest', ['ui.router'])

module.config ($stateProvider) ->
    $stateProvider.state 'guest',
        templateUrl: 'modules/Guest/Guest.html'
        abstract: true
        resolve:
            currentUser: (AppObject, Context, Authentication, $rootScope) ->
                Authentication.checkCredentials().then () ->
                    AppObject.getUser(Context.userId).then (user) ->
                        user.open()
                        $rootScope.currentUser = user
        onExit: (AppObject, $rootScope) ->
            AppObject.close()
            $rootScope.currentUser = null
 