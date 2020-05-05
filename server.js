/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
// These are our required libraries to make the server work.
// We're including a server-side version of Fetch to build on your client-side work
const express = require('express');
const fetch = require('node-fetch');

// Here we instantiate the server we're going to turn on
const app = express();


// Servers are often subject to the whims of their environment.
// Here, if our server has a PORT defined in its environment, it will use that.
// Otherwise, it will default to port 3000
const port = process.env.PORT || 3000;

// Our server needs certain features - like the ability to send and read JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// And the ability to serve some files publicly, like our HTML.
app.use(express.static('public'));


function processDataForFrontEnd(req, res) {
  const baseURL = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json'; // Enter the URL for the data you would like to retrieve here

  // Your Fetch API call starts here
  // Note that at no point do you "return" anything from this function -
  // it instead handles returning data to your front end at line 34.
  fetch(baseURL)
    .then((results) => results.json())
    .then((data) => { // this is an explicit return. If I want my information to go further, I'll need to use the "return" keyword before the brackets close
      console.log(data);
      console.log(`Number of data points: ${data.length}`);
      // return data; // <- this will pass the data to the next "then" statement when I'm ready.
      const clearEmptyData = data.filter((f) => f.geocoded_column_1);
      const refined = clearEmptyData.map((m) => ({
        category: m.category,
        name: m.name,
        latLong: m.geocoded_column_1.coordinates
      }));
      return refined;
    })
    .then((data) => data.reduce((c, current) => {
      if (!c[current.category]) {
        c[current.category] = [];
      }
      c[current.category].push(current);
      return c;
    }, {}))
    .then((data) => {
      console.log('new data', data);
      const reformattedData = Object.entries(data).map((m, i) => {
        console.log(m);
        return {
          y: m[1].length,
          label: m[0],
          // default that will be changed later
          color: 'red'
        };
      });
        // sort the array by count, from https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
      reformattedData.sort((a, b) => ((a.y < b.y) ? 1 : -1));
      // used to set the datapoint's color because colorSet wasn't working for me
      // color set from https://www.color-hex.com/color-palette/90365 because of course I'm gonna rep my favorite band from middle school
      const colorArray = ['#a52929', '#811c1c', '#691b1b', '#e8f067', '#f4b63f'];
      let curColor = -1;
      for (let i = 0; i < reformattedData.length; i += 1) {
        if (curColor < colorArray.length - 1) {
          curColor += 1;
        } else {
          curColor = 0;
        }
        reformattedData[i].color = colorArray[curColor];
      }
      return reformattedData;
    })
    .then((data) => {
      console.log(data);
      res.send({ data: data }); // here's where we return data to the front end
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/error');
    });
}

// This is our first route on our server.
// To access it, we can use a "GET" request on the front end
// by typing in: localhost:3000/api or 127.0.0.1:3000/api
app.get('/api', (req, res) => { processDataForFrontEnd(req, res); });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
