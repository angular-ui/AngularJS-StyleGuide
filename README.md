AngularJS-ORM - Example of scalable architecture
=============

The project demonstrates ways to **leverage ui-router to the greatest of it's abilities**, how to **keep your controllers down to 1 line of code**, how to **organize your services** in a completely simplified manner, and how to **leverage resolves** like a god. Keeping your application down to a **tiny handful of directives**. Avoid the nightmare of lifecycle, transition, and session/stateful bugs. How to **keep your `$scope` clean and tidy**. It doesn't require using `controller as` and it **doesn't turn everything into directives**. Write your code to be **angular-agnostic**. Use the router to **manage state, sessions and collections** allowing you to avoid the problems addressed with complicated flux architectures. Sharing references means **no more watchers and subscribers** strewn across your app.

### Resources

* [Tips and Tricks](https://github.com/ProLoser/AngularJS-ORM/blob/master/TIPS-AND-TRICKS.md)
* [Slidedeck](http://slid.es/proloser/angularjs-orm)
* [Older Branch (uses coffeescript and sockets)](https://github.com/ProLoser/AngularJS-ORM/tree/coffee-sockets)
* [ES6 Cheat Sheet](#es6-syntax)
* [Conference talk video](http://www.youtube.com/watch?v=Iw-3qgG_ipU)  
[![NG-Conf 2014 Talk](http://i1.ytimg.com/vi/Iw-3qgG_ipU/0.jpg)](http://www.youtube.com/watch?v=Iw-3qgG_ipU)

ES6 Syntax
------------

I use ES6 because it gives me easy-to-code classes and because the last line is always returned in arrow functions (which is great for promise chaining). You do not have to use ES6, and should not refactor into it 'just because'.

### How To Read

**Javascript:**
```js
function( x, y, z ){
  return z
}

function x(z) {
  // constructor
  this.y = z;
}
x.prototype.method = function(){}
```
**ES6**
```js
// `this` is bound to OUTER scope
( x, y, z ) => {
  this.whatever;
}
// single-line functions without brackets returns their expression
( x ) => x.y
// single-argument signatures don't need parenthesis
response => response.data



class x {
  constructor(z) {
    this.y = z;
  }
  method(z) {}
}
```
