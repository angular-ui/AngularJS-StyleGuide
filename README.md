AngularJS-ORM
=============

## An example of scalable architecture

This is an example project for my AngularJS-ORM talk at NGConf 2014.  
Slides: [Slid.es/ProLoser/AngularJS-ORM](http://slid.es/proloser/angularjs-orm)  
Original Code (Coffeescript + Sockets): [coffee-sockets](https://github.com/ProLoser/AngularJS-ORM/tree/coffee-sockets)  
[![NG-Conf 2014 Talk](http://i1.ytimg.com/vi/Iw-3qgG_ipU/0.jpg)](http://www.youtube.com/watch?v=Iw-3qgG_ipU)


[If you have questions, open an issue](https://github.com/ProLoser/AngularJS-ORM/issues)
--------------------------------------

Notes
-----

* **I don't use a src, css, view, controller, etc folders**  
In today's code, it's sensible keep modules together and small. HTML, JS and CSS are closely tied together, so we should organize projects that way.

* **If you can't open-source your directives, they probably shouldn't exist**  
A lot of people will create what I refer to as 'one-off' directives. They should usually just be sub-states.

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
( x, y, z ) => {
  this.whatever // `this` is bound to OUTER scope
  z // last line of functions are always returned
}

class x {
  constructor(z) {
    this.y = z;
  }
  method(z) {}
}
```
