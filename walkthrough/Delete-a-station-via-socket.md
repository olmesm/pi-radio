# Delete a station via socket (CRuD)

So I don't know about you, but from messing about with the previous step, I've added a lot of dud stations. Let's make a function that will delete them.

## Tasks

- Create a remove button on the clients app, passing the [index number of the station](https://vuejs.org/v2/guide/list.html#Basic-Usage) in the list.
- Follow the function through to the server.
- Make sure the station is removed from the list, use [Array.splice()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) with the index.
- Save the updated list
- Remove the station from the clients list of stations.

## Walkthrough

Lets get the [index number of the station](https://vuejs.org/v2/guide/list.html#Basic-Usage) in the list, and add a remove button.

```html
<h2>Stations</h2>
  <ul>
    <li v-for="(station, index) in stationsList">
      {{ index }} - {{ station.name }}
      <button @click="remove(index)">x</button>
    </li>
  </ul>
```

To make sure this remove button is working and the index exists lets create a function in `app.js`

```js
...
function remove(index) {
  console.log('remove requested', index);
}

var piRadio = new Vue({
  el: '#pi-radio',
  data: {
    stationsList: [],
    newStation: {},
  },
  methods: {
    add,
    remove, // <- don't forget to add the remove function to the piRadio methods!
  },
});
...
```

Does it log the correct index number?

Let's get this emitted to the server.

```js
...
function remove(index) {
  socket.emit('station.remove', index);
}
...
```

Confirm the server gets the request in `server.js`

```js
...
function handleClient(socket) {
  ...

  socket.on('station.remove', index => {
    console.log('remove station', index);
  });
};
...
```

If the station is getting logged in the terminal, then create the remove function, like we did with the add function.

In `server.js`

```js
...
socket.on('station.remove', index => {
  stations.remove(index);
});
...
```

In `stations.js` - we will use [Array.splice()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/splice). Don't forget to save the list, add the remove function to the stations object, and emit a new list.

```js
...
function add(station) {
  list.push(station);
  save();
}

function remove(index) {
  list.splice(index, 1);
  save();
}
...

const stations = {
  list,
  save,
  add,
  remove,
};

...
```

In `server.js`

```js
...
socket.on('station.remove', index => {
  stations.remove(index);
  io.emit('stations.list', stations.list);
});
...
```

## Cleaning up

We added and deleted a station followed by updating the list. But we only changed one station.

Imagine a system for a school. If you added or deleted a student from the database, you wouldn't want to reload the 1000's of student's names and details for every small action.

It is better practice to return just the added station, deleted station, or error message. Let clean this up quickly.

### Task

- Think of a better way to add or remove the stations from the list. We only want to update changes.

Lets amend the add function in `stations.js` so it returns the new station.

```js
...
function add(station) {
  list.push(station);
  save();
  return station;
}
...
```

Now emit the new station to the client from `server.js` and the name of the emit message will be `station.added`

```js
...
socket.on('station.add', newStation => {
  io.emit('station.added', stations.add(newStation));
});
...
```

And in the client app

```js
socket.on('stations.list', function (data) {
  ...
});

socket.on('station.added', function (data) {
  piRadio.stationsList.push(data);
});

socket.on('connect', function () {
  ...
});
```

Similarly lets return the index of the removed station in the remove function

```js
function remove(index) {
  list.splice(index, 1);
  save();
  return index;
}
```

and in `server.js` emitting `station.removed`

```js
socket.on('station.remove', index => {
  io.emit('station.removed', stations.remove(index));
});
```

Finally in `app.js`

```js
socket.on('station.added', function (data) {
  piRadio.stationsList.push(data);
});

socket.on('station.removed', function (data) {
  piRadio.stationsList.splice(data);
});
```

Now we only add and remove a single station.

[Next](#)

## Resources

* []()
