// These are our required libraries to make the server work.

import express from "express";
import fetch from "node-fetch";

// const sqlite3 = require('sqlite3').verbose(); // We're including a server-side version of SQLite, the in-memory SQL server.
// const open = require(sqlite).open; // We're including a server-side version of SQLite, the in-memory SQL server.

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import writeUser from "./libraries/writeuser";

const dbSettings = {
  filename: "./tmp/database.db",
  driver: sqlite3.Database,
};

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

function processDataForFrontEnd(req, res) {
  const baseURL = 'https://data.princegeorgescountymd.gov/resource/weik-ttee.json'; // Enter the URL for the data you would like to retrieve here

  // Your Fetch API call starts here
  // Note that at no point do you "return" anything from this function -
  // it instead handles returning data to your front end at line 34.
    fetch(baseURL)
      .then((results) => results.json())
      .then((data) => { // this is an explicit return. If I want my information to go further, I'll need to use the "return" keyword before the brackets close
          console.log(data);
          console.log("Number of data points: " + data.length);
          // return data; // <- this will pass the data to the next "then" statement when I'm ready.
          
          const refined = data.map((m) => ({
            category: m.permit_category,
            agency: m.county_agency,
            id: m.permit_case_id,
            year: m.permit_case_year,
            type: m.permit_type,
            name: m.case_name,
            address: m.street_address,
            city: m.city,
            zip: m.zip_code,
            date: m.permit_issuance_date,
            cost: m.expected_construction_cost,
            full_location: m.location
          }));
          return refined;
        })
      .then((data) => {
        return data.reduce((c, current) => {
          if (!c[current.category]) {
            c[current.category] = [];
          }
          c[current.category].push(current);
          return c;
        }, {});
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

// Syntax change - we don't want to repeat ourselves,
// or we'll end up with spelling errors in our endpoints.
//
app
  .route("/api")
  .get((req, res) => {
    // processDataForFrontEnd(req, res)
    (async () => {
      const db = await open(dbSettings);
      const result = await db.all("SELECT * FROM user");
      console.log("Expected result", result);
      res.json(result);
    })();
  })
  .post((req, res) => {
    console.log("/api post request", req.body);
    if (!req.body.name) {
      console.log(req.body);
      res.status("418").send("something went wrong, additionally i am a teapot");
    } else {
      writeUser(req.body.name, dbSettings)
      .then((result) => {
        console.log(result);
        res.send("your request was successful"); // simple mode
      })
      .catch((err) => {
        console.log(err);
      });
    }
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
