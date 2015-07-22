/*
User Module
============

ui.validate is part of angular-ui-validate

*/
var module = angular.module('App.User', ['ui.router', 'ui.validate']);

module.config(function($stateProvider) {
  $stateProvider.state( 'users', {
    parent: 'admin',
    url: '/users',
    templateUrl: 'modules/User/Users.html',
    controller: 'Users',
    resolve: {
      users: (User) => User.list()
    }
  });

  // Multi-Step Registration Wizard
  $stateProvider.state( 'register', {
    parent: 'guest',
    url: '/register',
    resolve: {
      // shared & accessible from all steps (and their controllers if necessary)
      user: (User) => new User(),
      wizard: (user, RegistrationWizard) => new RegistrationWizard(user)
    },
    templateUrl: 'modules/User/Register.html',
    controller: 'UserForm'
  });

  $stateProvider.state( 'register.step1', {
    url: '/step1', // /register/step1
    templateUrl: 'modules/User/RegisterStep1.html'
  });

  $stateProvider.state( 'register.step2', {
    url: '/step2', // /register/step1
    templateUrl: 'modules/User/RegisterStep2.html',
    resolve: {
      // prevent accessing step prematurely
      validate: (wizard, $state) => {
        if (!wizard.stepsCompleted(1))
          $state.go('register.step1');
      }
    }
  });

  $stateProvider.state( 'register.step3', {
    url: '/step3', // /register/step3
    templateUrl: 'modules/User/RegisterStep3.html',
    resolve: {
      // prevent accessing step prematurely
      validate: (wizard, $state) => {
        if (!wizard.stepsCompleted(2))
          $state.go('register.step2');
      }
    }
  });
});

module.controller( 'Users', ($scope, users) => {
  $scope.users = users;
});

module.controller( 'UserForm', ($scope, user, wizard) => {
  $scope.user = user;
  $scope.wizard = wizard;
});

module.factory( 'RegistrationWizard', () => {
  class RegistrationWizard {
    constructor(user) {
      this.user = user;
    }

    stepsCompleted(stepCount) {
      this['step'+stepCount]();
    }

    step1() {
      return this.user.valid('name') && this.user.valid('email');
    }

    step2() {
      // ...
    }

    step3() {
      return this.user.valid('password');
    }
  }

  return RegistrationWizard;
});
