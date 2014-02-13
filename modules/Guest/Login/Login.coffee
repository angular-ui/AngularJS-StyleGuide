# Tracks the previous location and allows you to redirect back to that location
previousLocation = null

module = angular.module('App.Login', ['ui.router']).config ($stateProvider) ->
    $stateProvider.state 'login',
        url: '/login'
        template: ''
        onEnter: ($modal) ->

            $modal.open
                templateUrl: "modules/login/loginModal.html"
                controller: 'Login'
                resolve:
                    user: -> undefined
                    redirect: ($location) -> ->
                        # TODO: Change to state code
                        $location.path( previousLocation )

module.run ($rootScope, $location)->
   $rootScope.$on '$stateChangeStart', (event, toState, toParams, fromState, fromParams) ->
        # TODO: Change to state code
        previousLocation = $location.path()

module.controller 'Login', ($scope, UserObject, Authentication, user, $modalInstance, redirect) ->

    $scope.user = user or new UserObject(null, name: Context.username)

    $scope.login = ->
        Authentication.login($scope.user, $scope.rememberMe).then () ->
            $modalInstance.close()
            redirect()
        , (response) ->
            $scope.error = response