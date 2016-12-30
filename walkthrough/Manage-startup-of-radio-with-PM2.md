# Manage startup of radio with PM2

[PM2](http://pm2.keymetrics.io/) is a process manager for Node.

It will allow us to run the webserver when we boot up the pi.

We don't have to set it up on our local machine so lets rather create a new setup script within `package.json`

```js
{
  "name": "pi-radio",
  "version": "1.0.0",
  "description": "An internet radio, by you, on the pi!",
  "main": "public/server.js",
  "scripts": {
    "setup": "npm i && sudo npm i pm2 -g",
    ...
    },
    ...
}
```

We will run this script whenever we put these files on a pi for a new installation.

Lets copy this across and install PM2.

```bash
scp -rp package.json public private pi@192.168.1.148:~/pi-radio # <- Note this is not the pi's shell!
```

Then in the pi

```bash
pi: $ cd ~/pi-radio
pi: $ npm run setup
```

Reading the [PM2 Quick start guide](http://pm2.keymetrics.io/docs/usage/quick-start/)

We need to initialise pm2 and start our server.

```bash
pi: $ pm2 startup systemd
pi: $ pm2 start private/server.js --name pi-radio
pi: $ pm2 save
```

Confirm this all works, restart the pi - wait a minute or so and then check if it still works.

If so, you're done! All thats left is to style the app!
