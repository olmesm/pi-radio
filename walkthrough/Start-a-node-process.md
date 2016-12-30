# Start a node process

## Tasks

- Create a new node script `private/streamer.js` where it prints "Hello World" using the shell `echo` command by [spawning a child process](https://nodejs.org/api/child_process.html#child_process_child_process)
- Create a button on the client which triggers the node script `streamer.js`

## Walkthrough

Node is really awesome as it allows the beginner to be able to become familiar with the JavaScript language and syntax, and accomplish a wide variety of feats. I personally believe that everybody should learn as many languages as possible, but JS is ideal for the weekend hacker.

Let's start by creating a new folder and file. `private/streamer.js`

```
.
├── private
│   ├── server.js
│   ├── stations-list.json
│   ├── stations.js
│   └── streamer.js
├── public
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   └── app.js
│   └── index.html
├── package.json
└── README.md
```

From the [node.js website](https://nodejs.org/api/child_process.html#child_process_child_process) add the following to your `streamer.js` file and change the second line to `const ls = spawn('echo', ['hello world']);` and all the `ls` to `helloWorld`

```js
'use strict';
const spawn = require('child_process').spawn;
const helloWorld = spawn('echo', ['hello world']);

helloWorld.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

helloWorld.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

helloWorld.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

Run the following command to execute the script.

```bash
node private/streamer.js
```

`echo` is the shell equivalent of `console.log()`. If you type in your shell right now `echo "hello world"`, it returns `hello world`. `hello world` is passed as the argument to `echo`.

### Starting a Process

As a user I would imagine a list of radio stations. Clicking on one of them should start the play of music. Lets make the stations their own buttons and get them to start or node process.

In `index.html`

```html
...
<li v-for="(station, index) in stationsList">
  <button @click="playStation(index)">{{ station.name }}</button>
  <button @click="remove(index)">x</button>
</li>
...
```

in `app.js`

```js
...
function playStation(index) {
  socket.emit('station.play', index)
}

var piRadio = new Vue({
  el: '#pi-radio',
  data: {
    stationsList: [],
    newStation: {},
  },
  methods: {
    add,
    remove,
    playStation,
  },
});
...
```

Make sure we are requiring the `streamer.js` and there is a corresponding function in the `server.js`

```js
...
function handleClient(socket) {
  ...

  socket.on('station.play', index => {
    streamer.play(stations.list[index].url);
  });
};
...
```

What does `streamer.play(stations.list[index].url);` do?

Well since stations.list is an array we can call on the position of the station using the index `stations.list[index]`.
We only want to pass in the url of the station as the streamer doesn't need to know about the name of the station, hence `stations.list[index].url`.

Lastly we want to have the streamer play the station url we are passing in - however the play function doesn't exist yet. Lets create it.

At the bottom of `streamer.js` create a new streamer object and export it.

```js
...

const streamer = {};

module.exports = streamer;
```

Require this export as a constant in `server.js`

```js
...
const stations = require('./stations');
const streamer = require('./streamer.js');

function handleClient(socket) {
  ...
};
...
```

Now create a play function in streamer, move all the existing code into it and then add it to the streamer object. Pass in the url instead of the 'hello world' string.

```js
'use strict';
const spawn = require('child_process').spawn;

function play(url) {
  const helloWorld = spawn('echo', [url]);

  helloWorld.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  helloWorld.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  helloWorld.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

const streamer = {
  play,
};

module.exports = streamer;
```

Run the server and see if it all works.

### Stopping a Process

Echo is easy as it executes and then stops. Streaming a radio station is not a finite process, it streams as long as there is an internet connection and no errors. Before we jump into streaming a radio station we need to test stopping and starting a process. `echo` runs and completes too quickly for us to experiment with so a better command would be `top` which displays info on the processes running on your machine. It also runs continuously so we will need to manually stop it.

Lets amend the process being spawned within the `streamer.js` file to run `top` with no arguments. Everything works, but we can't stop it unless we stop the server. Try it out.

So to fix this, let's create a stop function we can call. We'll also rename the `helloWorld` variable to `radioStream`, and declare it out of the play function so we can access it in the stop function - so it's not in the [local scope](http://ryanmorr.com/understanding-scope-and-context-in-javascript/).

Don't forget to add the stop function to your streamer object!

```js
...
let radioStream;

function play(url) {
  radioStream = spawn('top');

  radioStream.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  radioStream.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  radioStream.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function stop() {
  radioStream.kill();
}

const streamer = {
  play,
  stop,
};
...
```

Let's bring this new stop function through to our client.

`server.js`

```js
...
function handleClient(socket) {
  ...

  socket.on('station.stop', () => {
    streamer.stop();
  });
};
...
```

`app.js`

```js
...
function stopStation() {
  socket.emit('station.stop')
}

var piRadio = new Vue({
  el: '#pi-radio',
  data: {
    stationsList: [],
    newStation: {},
  },
  methods: {
    add,
    remove,
    playStation,
    stopStation,
  },
});
...
```

Finally `index.html`

```html
...
<button @click="add">Submit</button>

<h2>Controls</h2>
<button @click="stopStation">Stop</button>

<h2>Stations</h2>
...
```

Pressing the button starts the process. We can leave that running for a few minutes and stop it when we want.

Ready to rock?

[Next](#)

## Resources

* []()
