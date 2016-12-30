# Get the currently playing song and display on the client

## Tasks

- Looking at the shell output when playing a song, can you see the name of the song appear?
- Think of a way to get only the song details logging int the console. I use [regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec) and [string slice](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/slice)
- Send those song details through to the client.

## Walkthrough

When starting the stream you may see the song details popup in the console occasionally:

```bash
...
Public : yes
Bitrate: 128kbit/s

stdout: Cache size set to 320 KBytes

Cache fill:  0.00% (0 bytes)
Cache fill:  5.00% (16384 bytes)
stdout:
ICY Info: StreamTitle='Deep Purple - Woman From Tokyo  ';StreamUrl=''; # <- HERE!

Cache fill: 10.00% (32768 bytes)
stdout:
...
```

Think of a way to capture this. The only way I could get this working is with a regex pattern to capture the initial string `StreamTitle='<song-details>';` then I used a replace to to remove the beginning `StreamTitle='`, and a slice to remove the tailing `';`.

Once we have this information we can use `streamerStatusUpdate({ nowPlaying });` function with a now playing object for being updated on the client side app.

```js
'use strict';
const spawn = require('child_process').spawn;
const pattern = /StreamTitle=\'[\s\S]*\';/;

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
      if (data.indexOf('StreamTitle') > -1) {
        let nowPlaying = pattern.exec(data)[0].replace('StreamTitle=\'', '');
        nowPlaying = nowPlaying.slice(0, nowPlaying.indexOf('\';'));
        streamerStatusUpdate({ nowPlaying });
      }
      // console.log(`stdout: ${data}`); // <- Leave this in incase we need to fault find in future
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

  self.play = play;
  self.stop = stop;

  return self;
};

module.exports = streamer;
```

The server will already emit the message, so all that's left is to make sure the client get's updated. Let's add a nowPlaying property and make sure it only get's updated if the status update has an update.

```js
...

var piRadio = new Vue({
  el: '#pi-radio',
  data: {
    stationsList: [],
    newStation: {},
    stationName: 'Stopped',
    nowPlaying: '',
  },
  ...
});

socket.on('streamer.statusUpdate', function (data) {
  if (!data) {
    piRadio.nowPlaying = '';
    piRadio.stationName = 'Stopped';
  } else {
    if (data.nowPlaying) { piRadio.nowPlaying = data.nowPlaying; }
    if (data.stationName) { piRadio.stationName = data.stationName; }
  }
});
...
```

Finally add it to the app view `index.html`

```html
...
<h2>Controls</h2>
{{ stationName }} : {{ nowPlaying }}
<button @click="stopStation">Stop</button>
...
```
