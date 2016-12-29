# Store stations in file

As a client we can retrieve a list of stations from the server. So the next step would be to add the functionality to add new stations to the list. However we do not currently have a method of storing the data permanently on the server.

Currently if we were to add a station to the server, we would lose the list when we powered the server off.

We could store the data as a file on the local disk which is great for our small application. A database would be great but as we are only making a simple app, we can get away with storing our data in a json file.

## Tasks

- Create a function called `save` which writes the stationsList to a JSON file. [Example code to save a file](https://docs.nodejitsu.com/articles/file-system/how-to-write-files-in-nodejs/)
- Remove the stationsList from the server and create a `read` function which reads the stationsList from a JSON file
- Restructure the stationsList file so that we have a stations object with a list property.

## Walkthrough

Lets get to saving a file. From [the code available here](https://docs.nodejitsu.com/articles/file-system/how-to-write-files-in-nodejs/), I've added to so it writes in the private directory.

```js
const fs = require('fs');
const stationsListFile = `${__dirname}/stations-list.json`;
const stationsList = [...];

function save() {
  fs.writeFile(stationsListFile, JSON.stringify(stationsList), err => {
    if (err) console.log(err);
    console.log('Saved to', stationsListFile);
  });
}

save(); // Don't forget to execute it to create first file!

module.exports = stationsList;
```

If it created the file then delete `save()` to stop the server from overwriting on initialisation.

Let's remove the data within stationsList (assign it to an empty array - []) and read the information from the JSON file. Because we are reassigning `stationsList`, we need to define it with `let` and not `const`.

I also get a node error if I don't start the file with `'use strict';`

```js
'use strict';
...
let stationsList = [];

function read() {
  stationsList = require(stationsListFile);
}

function save() {
  ...
}

read();

module.exports = stationsList;
```

Note how we add `read()` the file as we want to read the list when we start the server. Check everything still works on the front end.

Now let's neaten this all up.

Lets encapsulate all these new functions within a single object and export that. Below I have renamed stationsList to list. I have then created a `stations` object. It has properties list and save.

```js
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
```

I also renamed `stationsList.js` to `stations.js`.

Update `server.js` to reflect these new properties.

```js
...
const stations = require('./stations');

function handleClient(socket) {
  io.emit('stations.list', stations.list);
};
...
```

Lastly we need to update the client side.

`app.js`

```js
...
socket.on('stations.list', function (data) {
  piRadio.stationsList = data;
});
...
```

Fire up the server and check everything still works.

Typing out `node private/server.js` too much?

We can add a script to npm.

Within `package.json` add the following `start` command to your `scripts` object

```json
"main": "public/server.js",
"scripts": {
  "start": "node private/server.js"
}
```

Typing `npm start` will now start the server for you. You save an incredible 13 characters of typing... if you were in fact typing to start the server and not just pressing the up arrow.

[Next](#)

## Resources

* [JavaScript ES6+: var, let, or const?](https://medium.com/javascript-scene/javascript-es6-var-let-or-const-ba58b8dcde75#.kpmt5gawg)
* [Example code to save a file](https://docs.nodejitsu.com/articles/file-system/how-to-write-files-in-nodejs/)
* [Database or JSON - Reddit](https://www.reddit.com/r/node/comments/2lmitx/what_is_the_best_database_stack_for_node_js/)
