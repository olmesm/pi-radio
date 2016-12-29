# Serve a css and javascript file to the client

Now a blank html file is not going to do us any good. We're going to be adding more features to our app so we need to include things like additional javascript and css files to be sent to the client.

Lets add two more folders and files so we have to following in your project folder.

```
.
├── private
│   └── server.js
└── public
    ├── js
    │   └── app.js
    ├── css
    │   └── styles.css
    └── index.html
```

Let's test that our javascript file gets served. Inside `app.js`:

```js
console.log('You got served!');
```

Next we need to ensure this is included in our index.html so the clients browser knows it exists and needs to load it. Below your closing body tag, but above the closing html tag, include your `app.js`.

```html
  ...
  </body>
  <script type="text/javascript" src="js/app.js"></script>
</html>
```

Spin up the server, go to [http://localhost:8000/](http://localhost:8000/), right click the main window and click inspect. Select the console tab.

```
http://localhost:8000/js/app.js Failed to load resource: the server responded with a status of 404 (Not Found)
```

What happened?

Well Hapi makes sure that no files on our server are sent if we haven't specified that they can be sent to the requesting client.

We could add the `app.js` file as a route like so -

```js
server.route({
    method: 'GET',
    path: '/js/app.js',
    handler: function (request, reply) {
        reply.file('./public/js/app.js');
    }
});
```

But this isn't a good way of doing things. Imagine we wanted to serve a bunch of stylesheets, javascript files, and images. That requires a lot of work from our side.

Let's see if Hapi.js has thought about [serving an entire directory.](https://hapijs.com/tutorials/serving-files?lang=en_US#directory-handler-options)

```js
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'public',
            listing: true
        }
    }
});
```

The above takes our public directory and serves all the folder's contents. Let's restart the server and see if it'll serve the `app.js` file now. Open the inspect console of the browser - you may need to refresh the webpage.

```
You got served!
```

Awesome! Let's load a CSS file now.

In your `index.html` between the meat and title tags add:

```html
...
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" type="text/css" href="css/styles.css">
<title>Pi Radio</title>
...
```

Next add the following to `styles.css`

```css
* { color: red; }
```

Is all the font red on the webpage? That means it's working!

We've successfully got a small website being served.

Let's try make that content dynamic!

[Next](#)

## Resources

* [Hapi.js Website - Serving static files](https://hapijs.com/tutorials/serving-files?lang=en_US#replyfile)
