#!/usr/bin/env node

/* eslint-disable global-require, no-console */
const fs = require('fs');

function writeConfig() {
  fs.writeFileSync(`${__dirname}/../private/app/js/config.json`, JSON.stringify(require('config')));

  console.log('Config changed: private/app/js/config.json');
}

module.exports = writeConfig;

if (require.main === module) {
  writeConfig();
}
