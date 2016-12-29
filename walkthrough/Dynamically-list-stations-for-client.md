# Dynamically list stations for client

We need to have a list of radio stations in order for the user to select one to play.

Lets get the list of stations displayed in the client's window first.

This could get confusing as we are not going to be using es6 for the client. A majority of browsers and mobile devices don't support es6 and I want to try to keep the complexity of this project as low as possible - so I won't be using anything like a precompiler.

In the `app.js` create the following object - you can remove the initial `console.log(...)`:

```js
var stations = [
  {
    name: "Classic Rock Florida - SHE Radio",
    url: "http://us1.internet-radio.com:8105/listen.pls",
  },
  {
    name: "Magic 80s Florida",
    url: "http://airspectrum.cdnstream1.com:8018/1606_192.m3u",
  },
  {
    name: "PulseEDM DANCE Music Radio",
    url: "http://us3.internet-radio.com:8087/listen.pls",
  },
];

console.log(stations);
```

Spin it up and see if the stations are being logged in the console.

Next we want this list to dynamically populate the clients view. We could do this without a library or framework, but it will be much easier to use something like `jquery` or `vue.js`. Initially I wanted to use jquery, but vue is so hot right now.

Using the [Vue.js getting started guide](https://vuejs.org/v2/guide/#Getting-Started), include the vue.js scripts above your `app.js` script:

```html
...
  </body>
  <script src="https://unpkg.com/vue/dist/vue.js"></script>
  <script type="text/javascript" src="js/app.js"></script>
</html>
```

Next look for the guide on [Conditionals and Loops](https://vuejs.org/v2/guide/#Conditionals-and-Loops).

We can use the directive `v-for` - can you adapt the example for our use case?

`index.html`

```html
...
<p>Hello from the Pi Radio Server</p>
<div id="pi-radio">
  <ul>
    <li v-for="station in stations">
      {{ station.name }}
    </li>
  </ul>
</div>
...
```

`app.js`

```js
var stations = [...];

var piRadio = new Vue({
  el: '#pi-radio',
  data: { stations },
});
```

Vue.js made our life a lot easier.

Notice what something like this would look like in jQuery:

```html
<p>Hello from the Pi Radio Server</p>
<div>
  <ul id="pi-radio"></ul>
</div>
```

```js
var stations = [...];

function makeList() {
  var stationListHtml = '';

  for (var i = 0; i < stations.length; i++) {
    stationListHtml += "<li>stations[i].name</li>";
  }

  $('ul#pi-radio').html(stationListHtml)
}

makeList();
```

To be fair most of this is javaScript - only the last line  of the function is jQuery. But it looks cleaner and simpler with Vue.

Hopefully in the long run it keeps our project easier to maintain and understand.

[Next](#)

## Resources

* [Vue.js getting started guide](https://vuejs.org/v2/guide/#Getting-Started)
* [Conditionals and Loops](https://vuejs.org/v2/guide/#Conditionals-and-Loops)
