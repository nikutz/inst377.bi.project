/* eslint-disable dot-notation */
/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
// These are our required libraries to make the server work.
// We're including a server-side version of Fetch to build on your client-side work
import express from 'express';
import fetch from 'node-fetch';

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import writePermit from './libraries/writepermit';
import filterPermits from './libraries/filter';
const fsLibrary  = require('fs');

const dbSettings = {
  filename: './tmp/data.db',
  driver: sqlite3.Database
};

// Server Instantiation
const app = express();
const port = process.env.PORT || 3000;

// Our server needs certain features - like the ability to send and read JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

async function dbBoot() {
  const db = await open(dbSettings);
  console.log('async DB boot');
}

async function startUp() {

  let permits = [];
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
            full_location: element.location
          };
          refined.push(obj);
        }
      });
      console.log(refined);
      return refined;
    })
    .then((data) => {
      permits = data;
    })
    .catch((err) => {
    });

  await console.log(permits);
  await permits.forEach((element) => { 
    fetch('https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address='+element.full_location+'&benchmark=Public_AR_Current&format=json')
      .then((results) => results.json())
      .then((dt) => {
        if (!dt["result"]["addressMatches"]) {
          writePermit(element.id, element.category, element.agency, element.year, element.type, element.name, element.address, element.city, element.zip, element.date, element.cost, element.full_location, "N/A", "N/A", dbSettings);
        } else {
          writePermit(element.id, element.category, element.agency, element.year, element.type, element.name, element.address, element.city, element.zip, element.date, element.cost, element.full_location, dt["result"]["addressMatches"][0]["coordinates"]["y"], dt["result"]["addressMatches"][0]["coordinates"]["x"], dbSettings);
        }
      })
      .catch((error) => {
      });
  });
}

async function processDataForFrontEnd(req, res) {
  await startUp();
  const lowerrange = req.body.year.slice(1, 5);
  const upperrange = req.body.year.slice(8, 12);
  const daterange = [lowerrange, upperrange];
  const lowercost = req.body.amount.split('-')[0].trim().slice(1);
  const uppercost = req.body.amount.split('-')[1].trim().slice(1);
  const pricerange = [lowercost, uppercost];
  const results = filterPermits(lowerrange, upperrange, lowercost, uppercost, dbSettings);
  console.log(results);
  async function findPermit(id, dbSettings) {
    const db = await open(dbSettings);
    const dat = await db.get('SELECT * FROM permits WHERE id = ?', [id], (err, row) => {
      if (err) {
        throw err;
      }
      return row;
    });
  }

}

// This is our first route on our server.
// To access it, we can use a "POST" request on the front end
// by typing in: localhost:3000/api or 127.0.0.1:3000/api
app
  .route('/api')
  .get((req, res) => {
    (async () => {
      const db = await open(dbSettings);
      const result = await db.all('SELECT * FROM permits');
      res.json(result);
    })();
  })
  .post((req, res) => { processDataForFrontEnd(req, res); });

// app
//   .route('/api')
//   .get((req, res) => {
//     (async () => {
//       const db = await open(dbSettings);
//       const result = await db.all('SELECT * FROM user');
//       console.log('Expected result', result);
//       res.json(result);
//     })();
//   })
//   .post((req, res) => {
//     
//     }
//   });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
