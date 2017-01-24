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

function add(station) {
  list.push(station);
  save();
  return station;
}

function remove(index) {
  list.splice(index, 1);
  save();
  return index;
}

read();

const stations = {
  list,
  save,
  add,
  remove,
};

module.exports = stations;
