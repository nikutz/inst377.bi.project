# Web Application Final Project for INST377 Spring 2020
## 
### (inst377.bi.project)
*Group repository for Evening 10*

Project focuses on an app designed to help users find favorable locations in Prince George's County to start a business.

https://inst377-pg-bi.herokuapp.com/

Target browsers: Our site is mainly focused on desktop browsers 
such as Chrome and Firefox for use in business settings. However,
the site will also function adequately on most mobile browsers.

[User Manual](docs\user.md)

To set up the application, navigate to the main folder using the
terminal/command prompt and install npm. Once that's done, run
npm start and the website and server will be booted up.


### Developer Manual

To get started install Node JS on your system
Clone/Pull the project from github
open your command line to the project folder location 
run "npm install"
follow the prompts to install npm
run "npm start" which uses the server.js file as instructions for the webserver 
Use a browser to navigate to the local address and port as indicated by ther npm terminal console
If you can use the site locally you have set things up correctly.


The main  client files are index.html ,demo.html , and about.html

The main server side file is server.js

The API endponts are 

/api 

which has different behavior based on wether it is a GET or POST request.


To create a filtered data with a POST request

Follow the standard stringification of the form fields or 

PUT WORKS THE same as POST

make the POST request body in this format

no zip code means all zip code

{
permit: 'b-Permits',
zip: '',
year: '[2013 - 2020]',
amount: '$0 - $1000000'
}

GET request gets everything


/geo api route


GET request gives you  the Geo locations.

### Future Improvements 

More Metadata e.g. the map pins should have hover over information.

The startup and behavior of the processing it is doing more work than needed.



#### Extra credit
-We used a database MongoDB
-We used JQuery to dynamically create slider controls instead of pure HTML
