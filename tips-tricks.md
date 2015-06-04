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
