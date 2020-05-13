/* eslint-disable dot-notation */
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


async function processDataForFrontEnd(req, res, data) {
  const restosend = [];
  const lowerrange = req.body.year.slice(1, 5);
  const upperrange = req.body.year.slice(8, 12);
  const lowercost = req.body.amount.split('-')[0].trim().slice(1);
  const uppercost = req.body.amount.split('-')[1].trim().slice(1);
  const zipcode = req.body.zip;
  const permits = req.body.permit;
  data.forEach((element) => {
    if (element['lat'] !== 'N/A' && element['long'] !== 'N/A') {
      if (element['year'] >= lowerrange && element['year'] <= upperrange && element['cost'] >= lowercost && element['cost'] <= uppercost) {
        if (zipcode !== '') {
          if (element['zip'] === zipcode) {
            // eslint-disable-next-line no-lonely-if
            if (permits === 'r-Permits') {
              if (element['type'] === 'R' || element['type'] === 'RG' || element['type'] === 'RGU' || element['type'] === 'RGU (RESIDENTIAL ADDITION/GRADING/USE)' || element['type'] === 'SGU' || element['type'] === 'SGU - (New Single Family)') {
                restosend.push(element);
              }
            } else if (permits === 'b-Permits') {
              if (element['type'] === 'UO' || element['type'] === 'UO (USE & OCCUPANCY)') {
                restosend.push(element);
              }
            } else if (permits === 'build-Permits') {
              if (element['type'] === 'UTB' || element['type'] === 'UTB (USE & OCCUPANCY-BUILDING)') {
                restosend.push(element);
              }
            } else if (permits === 'z-Permits') {
              if (element['type'] === 'UTZ' || element['type'] === 'UTZ (USE & OCCUPANCY-ZONING)') {
                restosend.push(element);
              }
            } else {
              restosend.push(element);
            }
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (permits === 'r-Permits') {
            if (element['type'] === 'R' || element['type'] === 'RG' || element['type'] === 'RGU' || element['type'] === 'RGU (RESIDENTIAL ADDITION/GRADING/USE)' || element['type'] === 'SGU' || element['type'] === 'SGU - (New Single Family)') {
              restosend.push(element);
            }
          } else if (permits === 'b-Permits') {
            if (element['type'] === 'UO' || element['type'] === 'UO (USE & OCCUPANCY)') {
              restosend.push(element);
            }
          } else if (permits === 'build-Permits') {
            if (element['type'] === 'UTB' || element['type'] === 'UTB (USE & OCCUPANCY-BUILDING)') {
              restosend.push(element);
            }
          } else if (permits === 'z-Permits') {
            if (element['type'] === 'UTZ' || element['type'] === 'UTZ (USE & OCCUPANCY-ZONING)') {
              restosend.push(element);
            }
          } else {
            restosend.push(element);
          }
        }
      }
    }
  });
  res.json(restosend);
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
  .post(async(req, res) => { 
    try {
      const posts = await Post.find();
      await processDataForFrontEnd(req, res, posts);
      console.log(req.body);
    } catch (err) {
      console.log(err);
    } 
  })
  .put(async(req, res) => { 
    try {
      const posts = await Post.find();
      await processDataForFrontEnd(req, res, posts);
    } catch (err) {
      console.log(err);
    } 
  });

app
  .route('/geo')
  .get(async (req, res) => {
    try {
      const posts = await Post.find();
      const codes = []
      posts.forEach((element)=>{
        const code = {'name':element['name'], 'lat': element['lat'], 'long': element['long']};
        codes.push(code);
      });
      res.json(codes);
    } catch (err) {
      console.log(err);
    } 
  });

app
  .route('/address')
  .get(async (req, res) => {
    try {
      const posts = await Post.find();
      const codes = []
      posts.forEach((element)=>{
        const code = {'name':element['name'], 'address': element['fullLocation']};
        codes.push(code);
      });
      res.json(codes);
    } catch (err) {
      console.log(err);
    }
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
