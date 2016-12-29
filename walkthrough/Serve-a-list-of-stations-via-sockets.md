# Serve a list of stations via sockets (cRud)

Currently we have the stations being stored in a javascript object on the client. Let's see if we can use sockets to have the server publish the list.

We can get the station list from the server in a number of ways. The reason I have chosen to use a socket is because we have the ability to display the current song for the client. We will also be able to get the player's playing/stopped status for the client.

## Tasks

- Install socket.io
- See how to integrate [socket.io with Hapi](https://nodesource.com/blog/understanding-socketio/)
- Move the list of stations from the client to the server.

Note: the html in the example on [nodesource.com](https://nodesource.com/blog/understanding-socketio/) seems to be broken;

    CLIENT-SIDE
    The HTTP server will begin to serve the client library at /socket.io/socket.io.js. To connect to our Socket.IO server, we need to put the following in our body tag:

    ```html
    ](http://msdn.microsoft.com/en-au/library/ie/ms535874%28v=vs.85%29.aspx
    ](http://socket.io/
    ```

Should read

```
<script src="/socket.io/socket.io.js"></script>
```

This will go above the other JavaScript files we've included in `index.html`.

===

## Walkthrough

Install Socket.io on our server

```bash
npm install socket.io --save
```

Integrate Socket.io with our project.

`server.js`

```js
...

server.connection({
    host: 'localhost',
    port: 8000
});

const io = require('socket.io')(server.listener);

function handleClient(socket) {
    console.log('Client Connected!');
};

io.on('connection', handleClient);

...
```

`index.html`

```html
  ...
</body>
<script src="/socket.io/socket.io.js"></script>
...
```

`app.js`

```js
var socket = io();

var stations = [...];

var piRadio = new Vue(...);

socket.on("connect", function () {
    console.log("Connected!");
});
```

We now have Socket.io included and integrated in our project. Lets move out stations list to our server.

Create a new file `private/stationsList.js`.

Cut and paste the `var stations = [...];` over to the new file we created. Rename the variable to `stationsList`.

Using `module.exports` and `require`, export the stations into `server.js`.

`stationsList.js`

```js
const stationsList = [
  {
    name: "Classic Rock Florida - SHE Radio",
    url: "http://us1.internet-radio.com:8105/listen.pls",
  },
  {
    name: "Magic 80s Florida",
    url: "http://airspectrum.cdnstream1.com:8018/1606_192.m3u",
  },
  {
    name: "PulseEDM DANCE Music Radio",
    url: "http://us3.internet-radio.com:8087/listen.pls",
  },
];

module.exports = stationsList;
```

`server.js`

```js
...
const io = require('socket.io')(server.listener);
const stationsList = require('./stationsList');
...
```

Now lets emit these stations via the socket:

```js
...
const io = require('socket.io')(server.listener);
const stationsList = require('./stationsList');

function handleClient(socket) {
  io.emit('stationsList', stationsList);
};

io.on('connection', handleClient);
...
```

Let's tell the client what to do with the information that it receives via the socket.

`app.js`

```js
var socket = io();

var piRadio = new Vue({
  el: '#pi-radio',
  data: {
    stationsList: [],
  },
});

socket.on('stationsList', function (data) {
  console.log(data);
  stationsList = data;
});

socket.on('connect', function () {
  console.log('Connected!');
});
```

Spinning up the server shows that we receive the stations list emitted from the server. However the client is not *reacting* to the new data. [Declaring Reactive Properties in Vue](https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties)

We need to set the property on the Vue instance - namely piRadio.

```js
...
socket.on('stationsList', function (data) {
  console.log(data);
  piRadio.stationsList = data; // <- setting the property on piRadio
});
...
```

If this is difficult to understand, realise by calling `new Vue();` we are creating a new Vue instance. This instance has data inside it, and in the case of piRadio, we have specified that it has a data property called `stationsList`.

When we talk about *reaction* piRadio will update the view on the client when it's internal data changes.

Although this is a fundamental concept, if you can see that there is a pattern and flow of data, you'll be able to carry on.

Remove the `console.log(data);` and proceed to the next step.

[Next](#)

## Resources

* [nodesource.com](https://nodesource.com/blog/understanding-socketio/)
* [Declaring Reactive Properties in Vue](https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties)
