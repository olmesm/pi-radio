# Get the currently playing station and display on the client

## Tasks

- Display the playing station on the client
- Ensure player have completely stopped before running another stream.

## Walkthrough

Easiest way is to just emit the name of the station once the process starts. If the process stops we can change the display name to 'Stopped'.

`index.html`

```html
...
<h2>Controls</h2>
{{ stationPlaying }}
<button @click="stopStation">Stop</button>
...
```

`app.js`

```js
...
function playStation(index) {
  piRadio.stationName = 'Loading...';
  socket.emit('station.play', index);
}

function stopStation() {
  piRadio.stationName = 'Stopping...';
  socket.emit('station.stop');
}

var piRadio = new Vue({
  el: '#pi-radio',
  data: {
    stationsList: [],
    newStation: {},
    stationName: 'Stopped',
  },
  methods: {
    ...
  },
});

socket.on('streamer.statusUpdate', function (data) {
  if (!data) {
    piRadio.stationName = 'Stopped';
  } else {
    if (data.stationName) { piRadio.stationName = data.stationName; }
  }
});
...
```

`server.js`

```js
...
const stations = require('./stations');

function streamerStatusUpdate(update) {
  io.emit('streamer.statusUpdate', update);
}

const streamer = require('./streamer.js')(streamerStatusUpdate); // <- Note: this is important!

function handleClient(socket) {
  ...

  socket.on('station.play', index => {
    io.emit('streamer.statusUpdate', { stationName: stations.list[index].name });
    streamer.play(stations.list[index].url);
  });
  ...
};
...
```

We need to pass in the streamerStatusUpdate function so we can call it when the stream stops or there is an error. To do this we need to ensure that we export a function that has an argument passed in when it's required. [Read more on currying](https://www.sitepoint.com/currying-in-functional-javascript/)

```js
const streamer = (functionWePassIn) => {
  let self = this; // <- makes sure 'this' is contained within this object.

  function stop() {} // Declare functions as per usual.
  function play(url) {
    functionWePassIn(); // <- call the function we passed in.
  }


  self.stop = stop;
  self.play = play; // Assign declared function to object for export.

  return self; // Return the object for export.
};

module.exports = streamer;
```

Out in full...

```js
'use strict';
const spawn = require('child_process').spawn;

const streamer = streamerStatusUpdate => {
  let self = this;

  self.radioStream;
  self.isPlaying;

  function stop() {
    self.isPlaying = false;
    self.radioStream.kill();
  }

  function play(url) {
    if (self.isPlaying) { self.stop(); }

    self.isPlaying = true;

    self.radioStream = spawn('mplayer', ['-playlist', url]);

    self.radioStream.stdout.on('data', data => {
      console.log(`stdout: ${data}`);
    });

    self.radioStream.stderr.on('data', data => {
      console.log(`stderr: ${data}`);
    });

    self.radioStream.on('close', code => {
      if (self.isPlaying && code === 1) { return; }
      console.log(`child process exited with code ${code}`);
      streamerStatusUpdate();
    });
  }

  self.stop = stop;
  self.play = play;

  return self;
};

module.exports = streamer;
```
