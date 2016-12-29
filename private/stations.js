'use strict';

const fs = require('fs');
const stationsListFile = `${__dirname}/stations-list.json`;
let list;

function read() {
  list = require(stationsListFile);
}

function save() {
  fs.writeFile(stationsListFile, JSON.stringify(list), err => {
    if (err) console.log(err);
    console.log('Saved to', stationsListFile);
  });
}

read();

const stations = {
  list,
  save,
};

module.exports = stations;
