## Express usage:

`hekdi` can be integrated with [express.js](https://github.com/expressjs/express).
```javascript
'use strict';

const express = require('express');
const { expressDI, createModule } = require('hekdi');
const app = express(); // create express app

class Ctrl { // create controller
  static get $inject() {
    return ['hello', 'world'];
  }
  constructor(hello, world) {
    this.hello = hello;
    this.world = world;
  }

  next(req, res, next) {
    console.log('hi from next Ctrl method');
    next();
  }

  greet(req, res) {
    console.log('greet');
    console.log('\n');
    res.send(`${this.hello},${this.world}`);
  }

  hi(req, res, next, data) {
    console.log('hi', data);
    console.log('\n');
    res.send(`${this.hello} there`);
  }
}

const importedModule = createModule({ // create module to be injected
  name: 'ServicesModule',
  declarations: [
    { name: 'hello', strategy: 'value', value: 'Hello' },
    { name: 'world', strategy: 'value', value: 'World' },
  ],
  exports: '*'
});

// create DI instance and register a router config to it.

const di = expressDI.create(app, {
  '/api': { // router path
    get: {  // http method
      controller: 'Controller', // Dependency 
      fn: 'hi', // dependency function to be called
      data: ['args'] // data that will be passed to function as arguments after (req, res, next)
    }
  },
  '/api/:test': {
    get: {
      controller: 'Controller',
      fn: 'greet',
      middlewares: [ // this array will register middlewares for this route.
        (req, res, next) => { // if middleware is a function it will be registered
          console.log('from middleware');
          next();
        }, { // but if it is a config then this dependency function will be found in module
          controller: 'Controller',
          fn: 'next'
        }
      ]
    },
  }
});

di.bootstrap({ // bootstraps di
  name: 'Module',
  declarations: [
    { name: 'Controller', strategy: 'singleton', value: Ctrl }
  ],
  imports: [ importedModule ]
});

app.listen(3000); // launch app
```

In the case of `get` request to `/api` we will get:
- console: 'hi' 'args'
- response: 'hello there'

In the case of `get` request to `/api/param` we will get:
- console: 
    - 'from middleware';
    - 'hi from next Ctrl method';
    - 'greet'
    
- response: 'Hello, World'