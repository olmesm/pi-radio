# Pi Radio

## Why?

I enjoy listening to Internet radio plus I want to give back to the open source community.

I feel this project is an awesome springboard into understanding what you can do with node, it also allows you to safely develop new knowledge in coding.

## Technology/Stacks Used

I've used the following to develop the pi-radio. Basic programming knowledge is required, however the steps are pretty well written out and this was created with the weekend hacker in mind.

* SSH
* Nginx
* Raspberry Pi
    - Vue.js
* Node
    - Hapi.js
    - Socket.io
* es5 and es6

## To Run

Two options:

1. You can make this yourself with the tutorial I've created
1. You could clone this directly to the pi and run it there.

## Lazy Guide

Do the steps in the [Setup Pi](/walkthrough/Setup-Pi.md) section, then install git.

```bash
pi: $ sudo apt-get update
pi: $ sudo apt-get upgrade              # this can take a while
pi: $ sudo apt-get install git -y
```

Then follow the steps in [Manage serving with Nginx](/walkthrough/Manage-serving-with-Nginx.md) till the step where you copy the files to the pi. Instead do the following:

```bash
pi: $ cd ~
pi: $ git clone https://github.com/olmesm/pi-radio.git
pi: $ cd pi-radio
pi: $ npm run setup
```

Then test it out with below:

```bash
pi: $ npm start
```

Open a browser on your local machine and go to http://raspberrypi or the ip address of the raspberry pi - http://192.168.1.148 (your's will be different).

Finally set up the pi so it loads the server when it boots;

```bash
pi: $ pm2 startup systemd

# the above may request you to run a sudo .. command - do it.

pi: $ pm2 start private/server.js --name pi-radio
pi: $ pm2 save
```

Confirm this all works, restart the pi - wait a minute or so and then check if it still works.

You're done!

## Development Rig

I'm doing this on a mac, but you shouldn't have any issues doing this on another linux based PC. If you're on Windows you should be able to get this working however I do use quite a few shell commands.

I would assume you have a raspberry pi to hand so I don't see any reason this can't be programmed with and directly onto the pi.

## Final notes

Enjoy my efforts and drop me a [tweet](https://twitter.com/oh_es) if you enjoyed this or have any questions.

## Style

## Steps

1. [Create a basic Hapi.js server](./walkthrough/Create-a-basic-Hapi.js-server.md)
1. [Serve an index.html](/walkthrough/Serve-an-index.html.md)
1. [Serve a css and javascript file to the client](/walkthrough/Serve-a-css-and-javascript-file-to-the-client.md)
1. [Dynamically list stations for client](/walkthrough/Dynamically-list-stations-for-client.md)
1. [Serve a list of stations via sockets (cRud)](/walkthrough/Serve-a-list-of-stations-via-sockets.md)
1. [Store stations in file](/walkthrough/Store-stations-in-file.md)
1. [Add a station via socket (CRud)](/walkthrough/Add-a-station-via-socket.md)
1. [Delete a station via socket (CRuD)](/walkthrough/Delete-a-station-via-socket.md)
1. [Start a node process](/walkthrough/Start-a-node-process.md)
1. [Start playing a station](/walkthrough/Start-playing-a-station.md)
1. [Get the currently playing station and display on the client](/walkthrough/Get-the-currently-playing-station-and-display-on-the-client.md)
1. [Get the currently playing song and display on the client](/walkthrough/Get-the-currently-playing-song-and-display-on-the-client.md)
1. [Setup Pi](/walkthrough/Setup-Pi.md)
1. [Manage serving with Nginx](/walkthrough/Manage-serving-with-Nginx.md)
1. [Manage startup of radio with PM2](/walkthrough/Manage-startup-of-radio-with-PM2.md)
1. [Styling](/walkthrough/Styling.md)
