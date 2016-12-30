# Start playing a station

## Tasks

- Get mplayer and start a stream via command line
- Adapt the node script to start and stop mplayer

## Walkthrough

Install mplayer

Let's get something to run the radio stream. I've used mplayer in the past, plus it has the ability to display the title and artist if the provider supplies it.

Check if you have mplayer installed by typing

```bash
mplayer -v
```

If you get an error like command not found, install it.

I recommend homebrew/linuxbrew, but you can get it however you want. Just make sure it can be run via the shell.

```
brew update
brew install mplayer
```

Next visit [internet-radio.com](https://www.internet-radio.com/) and find a stream. Test that it works by pressing the play button. Some may be country restricted.

When you find one you like and want right click the play button and select the `inspect` or `inspect element`. You'll see something like the following popup in the inspect window:

```html
<i onclick="ga('send', 'event', 'tunein', 'playjp', 'http://us1.internet-radio.com:8105/listen.pls');" style="font-size: 60px;" class="jp-play text-danger mdi-av-play-circle-outline"></i>
```

What we want from this is the URL for the radio stream `http://us1.internet-radio.com:8105/listen.pls`.

Plug the pi into a switched on TV or plug in headphones and reboot the pi so it detects it has an audio output.

Once booted SSH in and run the following command:

```bash
pi: $ mplayer -playlist http://us1.internet-radio.com:8105/listen.pls
```

How awesome is that! If you don't hear sound, try rebooting the pi while connected to the audio output, or try a different audio output.

So lets get this running from our server. In `streamer.js`

```js
...

function startStream() {
  ls = spawn('mplayer', ['-playlist', 'http://us1.internet-radio.com:8105/listen.pls']);
  ...
}
...
```

Copy this all to the pi and start up the server. Depending on the internet connection and speed you'll hear the stream within a few seconds.

Lastly lets do a little cleanup on the `index.html` and `server.js` files.

Change the stop button name from `station` to `player`;

```html
<button name="player" value="stop">Stop</button>
```

```js
...
var querystring = require('querystring');
...

...
var postData = querystring.parse(chunk.toString());
console.log('postData >>', postData);
if (postData.player === 'stop') {
  streamer.stop();
  return;
}
...
```

The querystring function allows us to convert the post data into a valid javascript object. This means we can call on properties of the object rather than dissect a string and try figure out if it has something we are looking for.


[Next](#)

## Resources

* []()


## Resources

- []()
