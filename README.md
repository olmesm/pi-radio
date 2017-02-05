# Pi Radio

## To run on Pi

```bash
git clone https://github.com/olmesm/pi-radio.git && cd pi-radio
scp -rp  private public config package.json  pi@pi-radio:~/pi-radio
pi$ npm run setup-pi

# the following will error - copy and paste the sudo command and then proceed
pi$ npm run pm2-setup
pi$ npm run pm2-first-run
```

Additionally requires:
* git
* mplayer
* node & npm
