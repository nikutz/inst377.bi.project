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

## Strategies and Solutions for the Problem
* Data Collection Procedures
    * Found and assimilated data from external data sources apart from our primary Permits dataset to make our web application more informative.
* Geocoding Raw Data (Street Addresses)
    * Found a REST API and collected coordinates through Fetch.
* Used Python & SQLite in unison along with new Python libraries such as Selenium WebDriver and BeautifulSoup for automated data collection 

## Technical System Decision Rationale

## How/If our Final System Helps to Address the Problem

## Challenges Faced and Impact on Final Design
* Realizing the Limitations of Our Primary Permits Dataset for Our Information Problem
    * Since our dataset primarily consisted of permits for new developments and repairs, it was hard to discern the true potential costs of starting a business.
    * We were able to resolve this issue by collecting retail space leasing data from the website Loopnet.com
* Limited Understanding of SQLite
* Mapping
    * Due to how long it took us to learn how to geocode street addresses, we were unable to complete mapping every data point.

## Possible Future Work Directions With This Problem
* Immediate Next Steps:
    * Adding Markers for all datapoints within our database.
    *  Implementing Tooltips into our map to present aggregated information
    * Dynamically Collecting & Updating Data from External Sources
* Future Next Steps:
    * Incorporating user accounts along with a database to keep track of locations for each user
    * Recommendation System
    * JavaScript Frameworks: React, Bootstrap
* Reasons to Potentially Not Pursue This Project
    * Limitations of the Primary Dataset in the context of the Information Problem
