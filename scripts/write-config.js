#!/usr/bin/env node

/* eslint-disable global-require, no-console */
const fs = require('fs');

function writeConfig() {
  fs.writeFileSync(`${__dirname}/../public/config.json`, JSON.stringify(require('config')));

  console.log('Config changed: www/js/config.json');
}

module.exports = writeConfig;

if (require.main === module) {
  writeConfig();
}
