Tips / Tricks
-------------

#### **I don't use a src, css, view, controller, etc folders**  
In today's code, it's sensible keep modules together and small. HTML, JS and CSS are closely tied together, so we should organize projects that way.

#### **If you can't open-source your directives, they probably shouldn't exist**  
A lot of people will create what I refer to as 'one-off' directives. They should usually just be sub-states.

#### **Don't do state management inside services/factories**  
Even though you have an Auth service, or something else, you should always have them bubble their results up to the top of the promise chain. Alway do URL / state jumping from controllers or state definitions, otherwise people have to go diving through a deeply nested chain of service callbacks to figure out why they keep getting an infinite redirect loop. Your services should be implementation agnostic.

#### **[Keep controllers implementation agnostic](https://github.com/ProLoser/AngularJS-ORM/blob/62ce345d6b6152a332562d58b0ec73d194ca3d8c/modules/Authentication/Login.js#L28-L37)**  
Your controllers should be implementation agnostic. Occasionally people use the `ui-boostrap/modal` service which lets you specify a controller and template and resolves. Inside that controller, you have access to `$modalInstance`, which is actually very bad practice. This means if your boss decides one day to no longer use a modal, you have to refactor the controller too (albeit trivially). Instead, have the `$modalInstance` resolve in a state definition, and use the `onEnter()` and `onExit()` callbacks to clean up implementation-specific logic. This leaves the controller free to just focus on it's internal view-related matters. [Example](https://github.com/ProLoser/AngularJS-ORM/blob/62ce345d6b6152a332562d58b0ec73d194ca3d8c/modules/Authentication/Login.js#L28-L37)

#### Keep It Simple, Stupid
Avoid thin wrappers that just cause obfuscation. If you are turning `$http.get('/api/whatever/' + arg1 + '/' + arg2 + '/' + arg3)` into `whatever(arg1, arg2, arg3)` you're not really gaining anything. Check out how we [use resolves](https://github.com/ProLoser/AngularJS-ORM/blob/b6482fab60a5b0207e2a39929681b10668552745/modules/Authentication/Authenticated.js#L23-L25) to [handle breadcrumbs](https://github.com/ProLoser/AngularJS-ORM/blob/b6482fab60a5b0207e2a39929681b10668552745/modules/Project/Project.js#L22-L28), something you need a lot of control and definition for in every state.

#### Understand `$apply()` in AngularJS
Keep your `$scope.$apply()` [as close to the top of your stack trace as possible](https://github.com/ProLoser/AngularJS-ORM/blob/8f6fafa2048ec301672c23828ba4eb591fb6cca5/modules/Socket.js#L46). You only need it if you plan to execute some angular-wrapped behavior. **NEVER** use the hack that checks for `$scope.$$phase` as this is a sign you are executing the same logic in angular and outside of angular.

#### If your site can be accessed while logged out, just resolve a blank `authUser`
The point of putting the logged in user in the top-level (`authentication state`) resolve is that all of your code can act on this data synchronously and leverage more `bind-once` in your views. If the user logs in or out, **you should reload the entire state tree with the re-resolved `authUser`.** This is because adding listeners for a user logging in and out in your entire codebase causes a massive amount of overhead, and you have to start coding listeners which deal with asynchronous lifecycles of users changing their state. Logging in and out happens at most once a week, so it's just better to not incur the performance and coding penalty just to allow simpler login.

Apps that don't let you access their content without being logged in don't have to deal with this use-case. Otherwise, `$state.reload()` or `$state.go('...', {}, { reload: true })` are your friends.
