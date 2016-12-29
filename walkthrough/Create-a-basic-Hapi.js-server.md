# Create a basic Hapi.js server

Hapi is a simple framework for creating Javascript Applications.

Following the steps on the [Hapi Website](https://hapijs.com/)

```bash
npm install hapi --save
```

Create the following folders and files:

```
.
└── private
    └── server.js
```

Within the new `server.js` file create a basic Hapi Server.

```js
'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8000
});

server.route({
    method: 'GET',
    path:'/hello',
    handler: function(request, reply) {

        return reply('hello world');
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
```

Run it to test it with `node private/server.js` then visit [http://localhost:8000/hello](http://localhost:8000/hello)

[Next](#)
