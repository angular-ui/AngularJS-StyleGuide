/*
Auth Module
=====================

Most of the actual app is located under here. This abstract module primarily tackles authenticating the user
*/

var module = angular.module('App.Auth');

module.config(function($stateProvider) {
  $stateProvider.state('authenticated', {
    templateUrl: 'modules/Authenticated/Authenticated.html',
    abstract: true,
    resolve: {
      user: (User, Auth, $state, $q) =>
        Auth.checkCredentials()
          .then(
            (response) => new User(response.data),
            // must return a rejected promise in order to stay in rejected-mode
            (error) => $q.reject($state.go('login'))
          )
      },
      // layout variable for breadcrumb nav (populated by children)
      breadcrumbs: () => []
    },
    onEnter(user) {
      user.open();
    },
    onExit(user, Auth) {
      user.close();
      Auth.logout();
    }
  });
});
