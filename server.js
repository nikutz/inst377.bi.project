/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
// These are our required libraries to make the server work.
// We're including a server-side version of Fetch to build on your client-side work

import express from 'express';
import fetch from 'node-fetch';
const nodeGeocoder = require('node-geocoder');
const NEDB = require('nedb');

// Server Instantiation
const app = express();
const port = process.env.PORT || 3000;

// Our server needs certain features - like the ability to send and read JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// And the ability to serve some files publicly, like our HTML.
app.use(express.static('public'));

// Connecting to DB
const database = new NEDB({ filename: './server_files/database.db', autoload: true });
database.ensureIndex({ fieldName: 'id', unique: true }, (err) => {});

const secrets = {
  'API_Key': 'icv8-oVDQisoOF-5Cl48DSs8fu7Y7zqdkvKT-w_NvKs',
  'PGKey': 'uW9whbab4HdcdODVawqrtSejv'
};

const options = {
  provider: 'here',
  apiKey: secrets.API_Key
};

const geoCoder = nodeGeocoder(options);

async function startUp() {
  // eslint-disable-next-line prefer-template
  await fetch('https://data.princegeorgescountymd.gov/resource/weik-ttee.json?')
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
        await database.insert({
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
      });
    })
    .catch((err) => {
      console.log('Fetch Error');
      console.log(err);
    });
}

startUp();


function processDataForFrontEnd(req, res, data) {
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
  .get((req, res) => {
    database.find({}, (err, data) => {
      if (!err) {
        res.json(data);
      }
    });
  })
  .post((req, res) => {
    database.find({}, async (err, data) => {
      if (!err) {
        await processDataForFrontEnd(req, res, data);
      }
    });
  })
  .put((req, res) => { 
    database.find({}, (err, data) => {
      if (!err) {
        processDataForFrontEnd(req, res, data);
      }
    });
  });

app
  .route('/geo')
  .get((req, res) => {
    database.find({}, (err, data) => {
      if (!err) {
        const codes = [];
        data.forEach((element) => {
          const code = { 'name':element[ 'name'], 'lat': element['lat'], 'long': element['long'] };
          codes.push(code);
        });
        res.json(codes);
      }
    });
  });

app
  .route('/address')
  .get((req, res) => {
    database.find({}, (err, data) => {
      if (!err) {
        const codes = [];
        data.forEach((element) => {
          const code = { 'name': element['name'], 'address': element['fullLocation'] };
          codes.push(code);
        });
        res.json(codes);
      }
    });
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
