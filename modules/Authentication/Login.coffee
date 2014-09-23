###
Login Module
============

In here we're demonstrating opening a modal upon entering a state (instead of swapping a view).
###

# Tracks the previous location and allows you to redirect back to that location
previousLocation = null

module = angular.module('App.Login', ['ui.router', 'ui.bootstrap']).config ($stateProvider) ->
    $stateProvider.state 'login',
        parent: 'guest'
        url: '/login'
        template: ''
        onEnter: ($modal) ->
            # This is a feature of UI-Bootstrap Modal
            # It allows you to programmatically open async modals
            $modal.open
                templateUrl: "modules/Authentication/loginModal.html"
                controller: 'Login'
                resolve:
                    user: ->
                        # Although this is a fresh user, if a UserObject is passed the username will be pre-filled
                        # @TODO Find a way to make this resolve optional(?)
                        undefined
                    redirect: ($location) -> ->
                        # Note we're returning a function to be called later, that has the redirect info pre-filled
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
