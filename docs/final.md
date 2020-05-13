# **College Park Business Search**

## Team Members
* Punit Khiyara
* Henry Keegstra
* Edward Kostreski
* Ernie Park
* Nikolas Utzschneider

## Information Problem
* Where would be the best location to start a new retail business in Prince George’s County?

## Stakeholders and Target Browsers
* Potential/Current Business Owners
* County Government
* General Public

## Data We Worked With
* https://data.princegeorgescountymd.gov/Urban-Planning/Residential-and-Commercial-Permits-July-2013-to-Pr/weik-ttee
* Webscraped address data and used a GeoCoding API to convert to lat/long coordinates 

## Strategies and Solutions for the Problem
* Data Collection Procedures
    * Found and assimilated data from external data sources apart from our primary Permits dataset to make our web application more informative.
    * Merged this into the original PG County Permit dataset to gain more information on business location.  
* Geocoding Raw Data (Street Addresses)
    * Found a Maps API for Javascript called "here" that allowed us to geocode the raw address data
* Used Python & MongoDb in unison along with new Python libraries such as Selenium WebDriver and BeautifulSoup for automated data collection 
* Relied on JS as the backbone for this application, putting all elements together into a singular process 

## Technical System Decision Rationale
 * We decided to do much of the data processing wtihin the Web Aplication itself to make it a more streamlined process. 
 * Could take advantage of technologies such as the Geocoding API to incorporate into preexisting JSON formatted data.   
 * Heroku and Node JS was used in order to provide an easy and accessible server platform for our web application.  

## How/If our Final System Helps to Address the Problem
* Our system ultimately helps users to idenfity retail businesses specfically, and see where they exist.  We believe this is a valuable tool for those looking to expand, or initialize their own business interests.  It gives users the ability to gain insight into where competition is, where "business hubs" are throughout PG county, and where there may be oportunity to expand.    

## Challenges Faced and Impact on Final Design
* Our Primary Permits Dataset was somewhat limited in the data we could actually use from it.
    * Since our dataset primarily consisted of permits for new developments and repairs, it was hard to discern the true potential costs of starting a business.
    * We were able to resolve this issue by collecting retail space leasing data from the website Loopnet.com
    * The PG county permit dataset included a wide variety of permits that was almost to broad in scope. 
* Had problems utilizing SQLite for some time, and eventually had to switch.  
* Mapping
    * Due to how long it took us to learn how to geocode street addresses, we were unable to complete mapping every data point.
* Our initial Fetch API was no good, so we had to switch to a secondary one that served us much better.  

## Possible Future Work Directions With This Problem
* Future Next Steps:
    * Incorporating user accounts along with a database to keep track of locations for each user
    * Recommendation System
    * JavaScript Frameworks: React, Bootstrap
* 
