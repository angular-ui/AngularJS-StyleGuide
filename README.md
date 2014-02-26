AngularJS-ORM
=============

This is an example project for my AngularJS-ORM talk

NG-Conf 2014 Talk
-----------------

[![NG-Conf 2014 Talk](http://i1.ytimg.com/vi/Iw-3qgG_ipU/0.jpg)](http://www.youtube.com/watch?v=Iw-3qgG_ipU)

Slides
------

[Slid.es/ProLoser/AngularJS-ORM](http://slid.es/proloser/angularjs-orm)

[If you have questions, open an issue](https://github.com/ProLoser/AngularJS-ORM/issues)
--------------------------------------

Notes
-----

You may have noticed **I don't use a src, css, view, controller, etc folders**. That is because I believe in today's architecture, it's more scalable to keep modules together and small. HTML, JS and CSS are closely tied together, so we should start organizing projects that way.

Coffeescript
------------

I use Coffeescript because it gives me easy-to-code classes and because the last line is always returned (which is great for promise chaining). You do not have to use Coffeescript and should not refactor into it 'just because'.

### How To Read

**Javascript:**
```js
function( x, y, z ){
  return z
}

this.property( x )

var x = {
  prop: true
}
```
**Coffeescript**
```coffee
( x, y, z ) ->
  z # last line of functions are always returned

@property x # paranthesis are optional

x = # braces are optional
  prop: true
```
