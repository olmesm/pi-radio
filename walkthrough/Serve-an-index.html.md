# Serve an index.html

Create the following folders and files so your folder structure looks like below:

```
.
├── private
│   └── server.js
└── public
    └── index.html
```

Within the `index.html` file create the html to be served by the server:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pi Radio</title>
  </head>
  <body>
    <h1>Pi Radio</h1>
    <p>Hello from the Pi Radio Server</p>
  </body>
</html>
```

We need to have this served to the client.

Again, as per the [Hapi.js Website - Serving static files](https://hapijs.com/tutorials/serving-files?lang=en_US#replyfile), Hapi.js requires inert to be installed to provide file serving to the client.

```bash
npm install --save inert
```

Next we replace the `server.route` and `server.start` functions with the following.

```js
... // above code omitted for brevity

server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/picture.jpg',
        handler: function (request, reply) {
            reply.file('/path/to/picture.jpg');
        }
    });

    server.start((err) => {

        if (err) {
            throw err;
        }

        console.log('Server running at:', server.info.uri);
    });
});
```

Note that we don't have any picture files to serve, so lets modify that route to serve our index file.

```js
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.file('./public/index.html');
    }
});
```

Run the server and you should see your index file:

```bash
node private/server.js
```

[Next](#)

## Resources

* [Hapi.js Website - Serving static files](https://hapijs.com/tutorials/serving-files?lang=en_US#replyfile)
