var module = angular.module('App', ['ui.router', 'App.Authentication', 'App.Guest']);


module.config(function($urlRouterProvider, $rootScope) {
    // Default URL if no matches
    $urlRouterProvider.otherwise('/projects');

    // Global catching of uiRouter errors (for development)
    $rootScope.$on('stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
    	console.log( event, toState, toParams, fromState, fromParams, error );
    });
});
