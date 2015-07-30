var module = angular.module('App', ['ui.router', 'App.Authentication', 'App.Guest']);

module.config(function($urlRouterProvider) {
    
    // Default URL if no matches
    $urlRouterProvider.otherwise('/projects');
    
});

module.run(function($rootScope){
    
    $rootScope.$on('$stateChangeError', console.error.bind(console));
    
    // Add support for a `redirectTo` property on state definitions for default children
    $rootScope.$on('$stateChangeStart', function(event, toState){
        if (toState.redirectTo) {
            if (angular.isFunction(toState.redirectTo)) {
                toState.redirectTo.apply(toState, [].slice.call(arguments));
            } else {
                event.preventDefault();
                $state.go(toState.redirectTo);
            }
        }
    });
    
});
