Scalable architecture in AngularJS
=============

[Resources](Resources.md)
-------------

Intro
-------------
Originally forked from ProLoser/AngularJS-ORM

The project demonstrates ways to **leverage ui-router to the greatest of it's abilities**, how to **keep your controllers down to 1 line of code**, how to **organize your services** in a completely simplified manner, and how to **leverage resolves** like a god. Keeping your application down to a **tiny handful of directives**. Avoid the nightmare of lifecycle, transition, and session/stateful bugs. How to **keep your `$scope` clean and tidy**. It doesn't require using `controller as` and it **doesn't turn everything into directives**. Write your code to be **angular-agnostic**. Use the router to **manage state, sessions and collections** allowing you to avoid the problems addressed with complicated flux architectures. Sharing references means **no more watchers and subscribers** strewn across your app.

**_WIP: Please help clean up this repo!_**

The StyleGuide
-------------

#### Don't focus on `src`, `css`, `view`, `controller`, `directives`
In today's code, it's sensible keep modules together and small. HTML, JS and CSS are closely tied together, so we should organize projects that way.

#### Don't use `controllerAs: 'vm'`
This is a practice that is becoming predominant and actually screws up a lot of the benefits of `controllerAs` syntax. Instead of namespacing and bundling controller logic, the only benefit you gain is the little `.` dot notation in `ng-model`. The name `vm` does not tell you where the logic came from or what it has to do with, and does not allow you to work with multiple bundles of logic at the same time. As such, it should be completely avoided. 

#### _[DISPUTED]_ If you can't open-source your directives, they usually shouldn't exist
A lot of people will create what I refer to as 'one-off' directives. These usually should just be sub-states. If you create directives specific to your business logic, and aren't focused on purely UI visual implementation (regardless of data, application, etc) then you are too tightly coupling your business logic to your view. You are making it more difficult to quickly refactor your view or view structure. You have to track down where business logic is being executed or modified in multiple places. You start keeping track of data state and lifecycle and implementing things like events and streams because your view lifecycle isn't consistent with your data lifecycle.

Instead, 0 business logic in views. Rendering logic in views only. Publicly, reusable, agnostic, unopinionated, highly versatile/reusable view logic.

#### Don't do routing redirects inside services/factories
Even though you have an Auth service, or something else, you should always have them bubble their results up to the top of the promise chain. Alway do routing from controllers or state definitions, otherwise people have to go diving through a deeply nested chain of service callbacks to figure out why they keep getting a redirect loop.

#### [Keep controllers implementation agnostic](https://github.com/ProLoser/AngularJS-ORM/blob/62ce345d6b6152a332562d58b0ec73d194ca3d8c/modules/Authentication/Login.js#L28-L37)
Occasionally people use the `ui-boostrap/modal` service which lets you specify a controller and template and resolves. Inside that controller, you have access to `$modalInstance`, which is actually very bad practice. This means if your boss decides one day to no longer use a modal, you have to refactor the controller too (albeit trivially). Instead, have the `$modalInstance` resolve in a state definition, and use the `onEnter()` and `onExit()` callbacks to clean up implementation-specific logic. This leaves the controller free to just focus on it's internal view-related matters. [Example](https://github.com/ProLoser/AngularJS-ORM/blob/62ce345d6b6152a332562d58b0ec73d194ca3d8c/modules/Authentication/Login.js#L28-L37)

#### Keep It Simple, Stupid
Avoid thin wrappers that just cause obfuscation. If you are turning `$http.get('/api/whatever/' + arg1 + '/' + arg2 + '/' + arg3)` into `whatever(arg1, arg2, arg3)` you're not really gaining anything. Check out how we [use resolves](https://github.com/ProLoser/AngularJS-ORM/blob/b6482fab60a5b0207e2a39929681b10668552745/modules/Authentication/Authenticated.js#L23-L25) to [handle breadcrumbs](https://github.com/ProLoser/AngularJS-ORM/blob/b6482fab60a5b0207e2a39929681b10668552745/modules/Project/Project.js#L22-L28), something you need a lot of control and definition for in every state.

#### Understand `$apply()` in AngularJS
Keep your `$scope.$apply()` [as close to the top of your stack trace as possible](https://github.com/ProLoser/AngularJS-ORM/blob/8f6fafa2048ec301672c23828ba4eb591fb6cca5/modules/Socket.js#L46). You only need it if you plan to execute some angular-wrapped behavior. **NEVER** use the hack that checks for `$scope.$$phase` as this is a sign you are executing the same logic in angular and outside of angular.

#### If sections can be accessed logged in AND out, resolve a null `authUser`
The point of putting the logged in user in the top-level (`authentication state`) resolve is that all of your code can act on this data synchronously and leverage more `bind-once` in your views. If the user logs in or out, **you should reload the entire state tree with the re-resolved `authUser`.** This is because adding listeners for a user logging in and out in your entire codebase causes a massive amount of overhead, and you have to start coding listeners which deal with asynchronous lifecycles of users changing their state. Logging in and out happens at most once a week, so it's just better to not incur the performance and coding penalty just to allow simpler login.

Apps that don't let you access their content without being logged in don't have to deal with this use-case. Otherwise, `$state.reload()` or `$state.go('...', {}, { reload: true })` are your friends.

#### Don't use `controllerAs` in routes. Use it in directives only.
_pasted from slack_

Controller instances are not shareable.

Meaning if you put logic into a controller (`this.doSomething()`) although you can reuse the logic elsewhere, you can’t reuse the instance. `controllerAs` syntax fixes a few issues, but it misleads people into thinking it’s okay to bloat controllers, which it isn’t (except for directives). Your stateful logic shouldn’t be in the controller, it should be in something stateful that can be shared so instead put most of your `this.doSomething()` into a factory, preferrably in a `class` or `object instance`. Then you can share it across multiple controllers, not just the logic, but the **highly stateful data**: `resolve: { person: function(Person) { return new Person() } }`

You inject `person` into multiple controllers and they all share the same data, and update in sync. So instead of doing `this.doSomething()` in your controller, and keeping track of info about how a `Person` works inside a controller (_which is reusable, but **not shareable**_) you should keep it inside your factories, which are even FURTHER abstracted from the view/angular-centric mindset, but are also instantiatable and manageable. I can control more concretely when a person is created, destroyed, updated, who has access to it, how it gets reused, etc. Angular no longer handles the lifecycle of the data, i do.

Controllers are generally 2-10 lines of code so my controller does nothing more than putting my business logic onto the view and occasionally wrapping business logic with view logic and / or route logic:  
```
$scope.person = person;
$scope.save = function(){
  $scope.loading = true;
  person.save().then(() => {
    $scope.loading = false;
    $state.go(...);
  });
});
```

Now lets say you STILL wanted to use `controllerAs` yet still keep things organized the way I described. You CAN, except your bindings look like this: `<input ng-model=“personCtrl.person.name”>` instead of just `<input ng-model=“person.name”>`. That is fairly trivial, but there is another big annoyance I have with it. **Your view is no longer reusable with different controllers**.

Lets say i want to use the same view with a create vs edit controller. My view bindings have to be `<input ng-model=“createCtrl.person.name”>` or `<input ng-model=“updateCtrl.person.name”>` or lets just say you call the controller `person` or `personCtrl`. You could have a `personEditCtrl` inside of a `personViewCtrl` so who gets which namespace?

When you start to build big apps and deal with these design questions, I find `controllerAs` is **NOT** the answer.  
I like having brittle scope bindings, for instance you may have cringed when i did `$scope.loading = true` because if you put a `ng-click=“loading = false”` inside of an `ng-if` it won’t work. Except I _want_ to keep my view-state flags shallow, simple, clean, and I don’t want the view to update them. I like having 2 controllers, both with their own `loading` flags that are not the same variable. I prefer not having to namespace all my loading flags by my controller name or variable or state name, and yet my views simply don’t care. To them, doing `ng-show=personLoading` is the same as doing `ng-show=personCtrl.loading` and my view becomes more brittle and heavily tied to the controller in use.

**In directives, it’s a completely different ballgame**  
Because *directives* are entirely about view logic, and should almost never do business logic. Period. The old way of doing directives you put all your shit into a linking function. A directive controller is essentially identical to a linking function except it is **reusable by other directives**, a visual-widget's externally visible api. If you look at [ui-select](https://github.com/angular-ui/ui-select) i love `controllerAs` because I can give it methods like `uiSelectCtrl.open()` and that really is what it’s doing. It’s the controls for my `ui-select` widget.

`personCtrl.person.open()` just doesn’t make sense if you read it. The ‘controller’ (guy doing shit to people) isn’t the one with the method, the object itself has methods that work upon itself. Doing `personCtrl.open()` is just a sign of bad design, because controllers should be skinny.

#### Never use scope inheritence across controllers (ui-views)
This is like using `$rootScope`, it's equivalent to using global variables and relies upon assumptions that variables will exist. It makes controllers (and views) depend on variables that may or may not exist, and makes it difficult for developers to see where these variables came from. If you wish to use a service, resolve or something inside of a route controller or view, you should **always re-inject the dependency and place it on the scope redundantly**. This is single-handedly the key to ensuring that your codebase has a solid contract and that the quality of your code stands up to refactoring. Even if it means placing the same objects onto the same variables in the same place on the scope, do it. Period.

The only time scope inheritence is good is when working with directives. Directives are view-centric data that do nothing more than decorate the scope based on what came before or what comes after, and even this is quickly being deprecated in favor of explicit attributes and highly reusable directives. 

#### Leverage Directive-controller communication to keep directives small and modular
If your directive is getting a bit unwieldy (assuming this is an [open-sourceable directive](#if-you-cant-open-source-your-directives-they-probably-shouldnt-exist)) remember that you can use a directive's `require` attribute to access the controller of another directive. Think of this as a directives **externally accessible api**. This is where you can concretely define methods and attributes that can be accessed by other directives, instead of relying on the scope. You can then package sub-features of a directive and can pick and choose which ones to load when you build your templates.
Example:
`<div ui-grid ui-grid-sortable ui-grid-paginate>`

#### Use the object to manage _data_ state
Instead of putting heavy load on _view_ state flags that describe how things should _look_, use grammar that describes the verb-like state of the data or action itself. This can then be repurposed in multiple ways in the view as to the visual representation, and is not tied to visual information.

Instead of `$scope.showSpinner` or `$scope.loading` use `task.uploading` or `project.saving` which could be rendered as a spinner, form, panel, whatever. The point is the **state flag is agnostic about the visual implementation**.
