/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
// These are our required libraries to make the server work.
// We're including a server-side version of Fetch to build on your client-side work

import express from 'express';
import fetch from 'node-fetch';
const nodeGeocoder = require('node-geocoder');
const mongoose = require('mongoose');
const Post = require('./models/Post');
require('dotenv/config');

// Server Instantiation
const app = express();
const port = process.env.PORT || 3000;

// Our server needs certain features - like the ability to send and read JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// And the ability to serve some files publicly, like our HTML.
app.use(express.static('public'));

// Connecting to DB


const options = {
  provider: 'here',
  apiKey: process.env.API_KEY
};
 
const geoCoder = nodeGeocoder(options);

async function startUp() {
  await mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => console.log('Connected to DB!'));

  await fetch('https://data.princegeorgescountymd.gov/resource/weik-ttee.json')
    .then((results) => results.json())
    .then((data) => {
      const refined = [];
      data.forEach((element) => {
        if (element.permit_category === 'Building Permit') {
          const obj = {
            category: element.permit_category,
            agency: element.county_agency,
            id: element.permit_case_id,
            year: element.permit_case_year,
            type: element.permit_type,
            name: element.case_name,
            address: element.street_address,
            city: element.city,
            zip: element.zip_code,
            date: element.permit_issuance_date,
            cost: element.expected_construction_cost,
            fullLocation: element.location
          };
          refined.push(obj);
        }
      });
      console.log('Permit Records: ', refined.length);
      return refined;
    })
    .then(async (data) => {
      await data.forEach(async (element) => {
        let latitude;
        let longitude;
        if (element.fullLocation) {
          await geoCoder.geocode(element.fullLocation)
            .then(async (res) => {
              if (!res[0]) {
                latitude = 'N/A';
                longitude = 'N/A';
              } else {
                latitude = 'N/A';
                longitude = 'N/A';
                if (res[0]['county'] === "Prince George's") {
                  latitude = res[0]['latitude'];
                  longitude = res[0]['longitude'];
                }
              }
            })
            .catch((err) => {
              if (err.code !== 'ECONNRESET' && err.code !== 'ENOTFOUND' && err.code !== 'ETIMEDOUT') {
                console.log(err);
              }
            });
        }
        // Writing to DB
        const post = new Post({
          id: element.id,
          category: element.category,
          agency: element.agency,
          year: element.year,
          type: element.type,
          name: element.name,
          address: element.address,
          city: element.city,
          zip: element.zip,
          date: element.date,
          cost: element.cost,
          fullLocation: element.fullLocation,
          lat: latitude,
          long: longitude
        });
        try {
          const savedPost = await post.save();
        } catch (err) {
          if (err.code !== 11000) {
            console.log(err);
          }
        }
      });
    })
    .catch((err) => {
      console.log('Fetch Error');
    });
}

startUp();

async function processDataForFrontEnd(req, res) {
  // startUp();
  // const lowerrange = req.body.year.slice(1, 5);
  // const upperrange = req.body.year.slice(8, 12);
  // const daterange = [lowerrange, upperrange];
  // const lowercost = req.body.amount.split('-')[0].trim().slice(1);
  // const uppercost = req.body.amount.split('-')[1].trim().slice(1);
  // const pricerange = [lowercost, uppercost];
  // const results = filterPermits(lowerrange, upperrange, lowercost, uppercost, dbSettings);
  // console.log(results);
  // async function findPermit(id, dbSettings) {
  //   const db = await open(dbSettings);
  //   const dat = await db.get('SELECT * FROM permits WHERE id = ?', [id], (err, row) => {
  //     if (err) {
  //       throw err;
  //     }
  //     return row;
  //   });
  // }
}

// This is our first route on our server.
// To access it, we can use a "POST" request on the front end
// by typing in: localhost:3000/api or 127.0.0.1:3000/api
app
  .route('/api')
  .get(async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (err) {
      console.log(err);
    }
  })
  .post((req, res) => { processDataForFrontEnd(req, res); });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
