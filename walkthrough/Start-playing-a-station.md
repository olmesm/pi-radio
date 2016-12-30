# Start playing a station

## Tasks

- Get mplayer and start a stream via command line
- Adapt the node script to start and stop mplayer

## Walkthrough

### Install mplayer

Let's get something to run the radio stream. I've used mplayer in the past, plus it has the ability to display the title and artist if the provider supplies it.

Check if you have mplayer installed by typing

```bash
mplayer -v
```

If you get an error like command not found, install it.

I recommend homebrew/linuxbrew, but you can get it however you want. Just make sure it can be run via the shell.

```bash
brew update
brew install mplayer
```

Next visit [internet-radio.com](https://www.internet-radio.com/) and find a stream. Test that it works by pressing the play button. Some may be country restricted.

When you find one you like and want right click the play button and select the `inspect` or `inspect element`. You'll see something like the following popup in the inspect window:

```html
<i onclick="ga('send', 'event', 'tunein', 'playjp', 'http://us1.internet-radio.com:8105/listen.pls');" style="font-size: 60px;" class="jp-play text-danger mdi-av-play-circle-outline"></i>
```

What we want from this is the URL for the radio stream `http://us1.internet-radio.com:8105/listen.pls`.

Run the following command with your radio URL on the end:

```bash
mplayer -playlist http://us1.internet-radio.com:8105/listen.pls
```

How awesome is that!

We already created a play function and pass through the URL of the stream so lets amend the node process to start mplayer. In `streamer.js`

```js
...

function play(url) {
  radioStream = spawn('mplayer', ['-playlist', url]);

  ...
}
...
```

Depending on the internet connection and speed you'll hear the stream within a few seconds.

[Next](#)

## Resources

* []()


## Resources

- []()
