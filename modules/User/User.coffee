###
User Module
============
###

                                                # part of angular-ui/ui-utils
module = angular.module('App.User', ['ui.router', 'ui.validate']).config ($stateProvider) ->
    $stateProvider.state 'users',
        parent: 'admin'
        url: '/users'
        templateUrl: 'modules/User/Users.html'
        controller: 'Users'
        resolve:
            users: (AppObject) ->
                AppObject.getUsers()
                
    # Multi-Step Registration Wizard
    $stateProvider.state 'register',
        parent: 'guest'
        url: '/register'
        resolve:
            # shared & accessible from all steps (and their controllers if necessary)
            user: (AppObject) ->
                AppObject.newUser()
        templateUrl: 'modules/User/Register.html'
        controller: 'UserForm'
    $stateProvider.state 'register.step1',
        url: '/step1' # /register/step1
        templateUrl: 'modules/User/RegisterStep1.html'
    $stateProvider.state 'register.step2',
        url: '/step2' # /register/step1
        templateUrl: 'modules/User/RegisterStep2.html'
        resolve:
            # prevent accessing step prematurely
            validate: (user, $state) ->
                if !user.stepsCompleted(1)
                    $state.go('register.step1')
    $stateProvider.state 'register.step3',
        url: '/step3' # /register/step3
        templateUrl: 'modules/User/RegisterStep3.html'
        resolve:
            # prevent accessing step prematurely
            validate: (user, $state) ->
                if !user.stepsCompleted(2)
                    $state.go('register.step2')

module.controller 'Users', ($scope, users) ->
    $scope.users = users
    
module.controller 'UserForm', ($scope, user) ->
    $scope.user = user
            
module.factory 'UserObject', (BaseObject) ->
    class UserObject extends BaseObject
        # ... 
        stepsCompleted: (stepCount) ->
            ...
            # return Boolean
