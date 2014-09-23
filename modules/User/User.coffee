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
            wizard: (user, RegistrationWizard) ->
                new RegistrationWizard(user)
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
            validate: (wizard, $state) ->
                if !wizard.stepsCompleted(1)
                    $state.go('register.step1')
    $stateProvider.state 'register.step3',
        url: '/step3' # /register/step3
        templateUrl: 'modules/User/RegisterStep3.html'
        resolve:
            # prevent accessing step prematurely
            validate: (wizard, $state) ->
                if !wizard.stepsCompleted(2)
                    $state.go('register.step2')

module.controller 'Users', ($scope, users) ->
    $scope.users = users
    
module.controller 'UserForm', ($scope, user, wizard) ->
    $scope.user = user
    $scope.wizard = wizard
            
module.factory 'UserObject', (BaseObject) ->
    class UserObject extends BaseObject
        # ... 
        
        # @rules: this is a Class property instead of an Object property
        @rules: {
            name: '[a-zA-Z0-1]{4,}' # 4 or more alphanum chars
            email: '.+@gmail.com'
        }
        
        # checks validity of the property (probably should be in BaseObject)
        valid: (property) ->
            if !rules[property]
                return true
                                # @::rules means this.prototype.rules
            pattern = new RegExp(@::rules[property])
            pattern.test(@[property])

module.factory 'RegistrationWizard', () ->
    class RegistrationWizard
                    # this.user = user
        constructor: (@user) ->
            
            
        stepsCompleted: (stepCount) ->
            @['step'+stepCount]()
            
        step1: ->
            user.valid('name') && user.valid('email')
            
        step2: ->
            # ...
            
        step3: ->
            user.valid('password')
            
