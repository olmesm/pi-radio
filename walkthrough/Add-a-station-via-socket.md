# Add a station via socket (CRud)

We have a station list, and we can save the station list. Lets start adding to the list.

## Task

- Create two new text fields for a user to input a Name and URL for a new station. Use [Vue.js text input models](https://vuejs.org/v2/guide/forms.html#Text) and [@click](https://vuejs.org/v2/guide/syntax.html#v-on-Shorthand) for submitting, and [Vue Method event handlers](https://vuejs.org/v2/guide/events.html#Method-Event-Handlers).
- On submitting the new station, log the details in the server console to prove the details are coming through.
- Create a new add station function and get the server to add the new station to the station list.
- Make sure the station file gets updated.
- Make sure the list on the client side gets updated.
- If the name or URL is missing, the submission must not be accepted.
- If the submission is successful, the field inputs should be cleared.

Notice the flow of data and the thought pattern?

We have data coming from the user, make sure it's received by the server, processed and then confirmed back on the client side.

## Walkthrough

Using [Vue.js text input models](https://vuejs.org/v2/guide/forms.html#Text) I've used a single object called newStation to keep the data together. Notice how I've restructured the main `pi-radio` div so that the whole app is contained within it.

Also notice the [@click](https://vuejs.org/v2/guide/syntax.html#v-on-Shorthand) button. Any idea how we get the newStation object in the function?

```html
...
<body>
  <div id="pi-radio">
    <h1>Pi Radio</h1>

    <h2>Add a station</h2>
    <label for="name">Name:
      <input v-model="newStation.name">
    </label>
    <label for="url">URL:
      <input v-model="newStation.url">
    </label>
    <button @click="add()">Submit</button>

    <h2>Stations</h2>
      <ul>
        <li v-for="station in stationsList">
          {{ station.name }}
        </li>
      </ul>
  </div>
</body>
...
```

Let's get Vue.js to fire off an action when we click the `add`/`Submit` button.

Now we need to add the method `add` to piRadio's [Vue Method event handlers](https://vuejs.org/v2/guide/events.html#Method-Event-Handlers) and define newStation on the instance's data property.

```js
...
function add() {
  console.log(piRadio.newStation);
}

var piRadio = new Vue({
  el: '#pi-radio',
  data: {
    stationsList: [],
    newStation: {},
  },
  methods: {
    add,
  },
});
...
```

Start the server. Does it `console.log` the newStation? Awesome!

Let's get this emitting to the server.

```js
...
function add() {
  socket.emit('station.add', piRadio.newStation);
}
...
```

In `server.js`

```js
...
function handleClient(socket) {
  io.emit('stations.list', stations.list);

  socket.on('station.add', newStation => {
    console.log(newStation);
  });
};
...
```

Once you can confirm the server is receiving the newStation, lets get it to add it to the list of stations.

Lets call a `stations.add()` function to add the station. Note the different es6 arrow function `() => {}`.

```js
socket.on('station.add', newStation => {
  stations.add(newStation);
});
```

Now the above function doesn't exist; let's create it. In `stations.js`

```js
...
function add(station) {
  list.push(station);
}

...

const stations = {
  list,
  save,
  add, // <- don't forget to add the new "add" function we just created!
};

...
```

Does it work? If you fill out the name and url fields on the client side and submit the new station, nothing happens. However if you refresh the page, the station now appears?

We need to emit the updated station list back to the client!

In `server.js`...

```js
socket.on('station.add', newStation => {
  stations.add(newStation);
  io.emit('stations.list', stations.list);
});
```

And the difference is instantly noticeable! As soon as you submit the new station the server updates the list and emits it to the clients.

Restart the server and then refresh the client. What happened to the newly added station? It didn't save!

This is because we didn't call the save function right after adding the station.

In `stations.js`

```js
...
function add(station) {
  list.push(station);
  save();
}
...
```

That does the trick.

Let's verify that the user inputs a name and url.

In `app.js` just a simple *check-if-both-fields-aren't-blank* will suffice

```js
function add() {
  if (!piRadio.newStation.name && !piRadio.newStation.url) {
    return;
  }
  socket.emit('station.add', piRadio.newStation);
  piRadio.newStation = {};
}
```

## What else can you do?

- If the submission is unsuccessful the client should be be alerted.

Otherwise next step!

[Next](#)

## Resources

* []()
