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
