# maptor-consumer

JavaScript module for easily customisable maptor consuming

# Usage

You first need to require the module, or, if installed with a library, it will already be there:

```js
const MC = require('maptor-consumer');
```

Then let's look at a base case scenario: we want to make a new object like this one, but only take `a` and `b`, discarding `c`

```js
const data = {
  a: 1,
  b: 2,
  c: 3
}
```

To do that, we need to define a `maptor`, and tell it to do just that, then call `MC.map` with those parameters:

```js
const I = (x) => x; // identity function
const maptor = {
  a: I,
  b: I
}
const mapped = MC.map(data, maptor);
```

Let's  try to understand what this does. First of all, each property in the maptor should either be assigned to one of functions, objects, or arrays. If the value is a function, then the value of the original object will be mapped through that function. `I` just happened to be the identity function, which means that the values for the mapped object will be:


```js
const mapped = {
  a: maptor.a(data.a),
  b: maptor.b(data.b)
}
```

So if `I` is the identity function, the above will be practically the same as

```js
const mapped = {
  a: data.a,
  b: data.b
}
```

Note that if a value is not defined in the maptor, it is simply ignored, so we get a filtering out of the `c` property. At this point we can just hook the values up:

```js
const mapped = {
  a: 1,
  b: 2
}
```

# So what?

It really doesn't just stop at filtering! The `I` function can be anything. Here are a few useful examples:

```js
const dateStrToMS = (x) => +(new Date(x));
const data = { time: 'Wed Apr 12 2017 09:33:55 GMT+0100 (BST)' };
const maptor = { time: dateStrToMS };
const newObj = MC.map(data, maptor); // { time: 1491986035000 }

const toLowerCase = (x) => x.toLowerCase();
const data = { username: 'BenjaminBenBen' };
const maptor = { username: toLowerCase };
const newObj = MC.map(data, maptor); // { username: 'benjaminbenben' }
```

Your functions can be as complicated as you want them to be.

In some cases, it might be useful to also get the property name, and to possibly make the structure of your code a bit simpler, we provided it as the second parameter

```js
const addPropertyName = (x, name) => x + name;
const data = { a: 1, b: 2 }
const maptor = { a: addPropertyName, b: addPropertyName };
const newObj = MC.map(data, maptor); // { a: '1a', b: '1b' }
```

# What if maptor properties are arrays or objects?

The `MC` will try to match the structure. `Arrays` can only have one element: either another `array` or an `object`. Here's an example:

```js
const data = {
  a: 1,
  b: {
    c: 2,
    d: [{
      e: 3,
      f: 4
    }, {
      e: 5,
      f: 6
    }]
  },
  g: {
    h: 7
  }
};
const I = (x) => x;
const maptor = {
  a: I,
  b: {
    c: I,
    d: [{
      e: I
    }]
  }
};
MC.map( data, maptor );
// will return
{
  a: 1,
  b; {
    c: 2,
    d: [{
      e: 3
    }, {
      e: 5
    }]
  }
}
```

Pretty cool, huh?

# How do I change the name of a property?

You can change the maptor's key value to the name of the correspondant property:

```js
MC.map(
// data
{
  a: [{
    b: 1
  }, {
    b: 2
  }]
}, 
// maptor
{
  a: [{
    c: 'b'
  }]
});
// will return
{
  a: [{
    c: 1
  }, {
    c: 2
  }]
}
```

# other little things

A shortcut for the identity, so you don't have to define it yourself, is setting the maptor's key value to the number `1`:

```js
MC.map({ a: 'hello' }, { a: 1 }); // { a: 'hello' }
// same as
const I = (x) => x;
MC.map({ a: 'hello' }, { a: I });
```

Maptor methods can return `undefined` to filter out a property:

```js
const data = {
  a: '1',
  b: 'ben lives forever'
};
const toNum = (x) => {
  if(!isNaN(parseInt(x)))
    return parseInt(x);
  // otherwise it returns undefined by default
}
const maptor = {
  a: toNum,
  b: toNum
};
MC.map(data, maptor);
// will return
{
  a: 1
}
```

Maptor methods matching data `arrays` and `objects` will still act as functions:

```js
const data = {
  messages: ['ben', 'yes?', 'you should use magic (boom)', 'ok'],
  info: {
    users: ['Max', 'Ben', 'Max'],
  }
}
const maptor = {
  messages: (x) => x.length,
  info: (x) => {
    x.users.push( 'Ben' ); 
    // NOTE: ^ will modify the original data as well because it's still referenced to that
    // It's up to you to sort that out when using functions on objects and arrays
    x.userAmount = x.users.length;
    return x
  }
};
MC.map( data, maptor );
// will return
{
  messages: 4,
  info: {
    users: [ 'Max', 'Ben', 'Max', 'Ben' ],
    userAmount: 4
  }
}
```
