# S.N.A.C.K.S.
___(Sensor Network Around Charlottetown's Key Surroundings)___
### Project Plan, January 2019

### Contributors: 
 - Jeremy Thompson
 - R.J. Arsenault
 - Eduardo Egger
 - Alexander Metcalfe
 
## Vision Statement
This project consists of integrating The Things Network with a relational database from Amazon Web Services, designing a visualization for location-based environmental data, and producing documentation that encourages citizens to participate in the system (a low barrier to entry, low confusion about the system, and ease of access to information).

This project is being completed for the City of Charlottetown, but is ultimately being created with the goal of being a citizen-focused system. Citizens of Charlottetown are the primary users of this system, and primarily those among them that are scientifically minded or want to contribute to a citizen science project.

This project is being created with the hope of inspiring future development and engagement from citizens. Engaging citizens with a local project that uses novel technologies in a relatively new and exciting way is a great way to bring the community together, and a well implemented solution would be a major help to other communities worldwide who might be interested in a similar system. Another main goal of this project is to be able to use the recorded data to find irregularities in certain zones so that they can be addressed. This project was inspired by a very similar one that was made in Amersfoort.


## Scope
The highest overview of the system is as follows. There will exist sensors scattered throughout Charlottetown, but near enough to a Things Network Gateway so that their data can be properly received. These sensors (most likely Arduino boards with a temperature sensor attached) will transmit their data at set intervals to The Things Network. Our system will take the data from The Things Network, associate it with geographic information we have previously gathered about the sensor, and store it in a more permanent database hosted by Amazon Web Services. Our project will also produce a web server that provides a public API for data retrieval from this database. Finally, as a demonstration of the API, a website that serves as the homepage for the project will display a map of Charlottetown with all of the sensors currently in use. The data from the sensors will also be visualized in some way (ex. temperature can be visualized with a colored heat map). Finally, there will be accessible documentation created that will also be available through the website that provides instructions on how citizens can get their own sensor from the city, how they can build their own sensor and register it with the city, or how they can remove an existing sensor from the system.

The data transfer from The Things Network to the Amazon database is our first priority. Once this is accomplished, creating the API that retrieves data from this database is the next step. Finally, the quality of the project’s main website will depend on how well we adhere to the schedule, and a high quality data visualization can be considered a stretch goal.

## Project Community 
The project community will contain the four students continuing on from 4810 to 4820. Jeremy Thompson will be the project lead and R.J. Arsenault will be the technical lead. The two other developers are Eduardo Egger and Alec Metcalfe.

The primary customer is the City of Charlottetown. Our main contact with them (and the initiator of this project idea) is Peter Rukavina. Peter will also be able to maintain the system after the students graduate. Ramona Doyle is the Sustainability Officer at the City of Charlottetown, and Matt McCarville is the Community Energy Planner at the City of Charlottetown. They both have provided requirements for the system and what they envision it accomplishing in the future. There are also a number of interested citizens that Peter Rukavina has previously contacted, and they include Dave Cairns, Rosie Le Faive (from the Robertson Library), and Michelle Cottreau. These citizens are available as potential testers and can also help with specific technical areas of the project where they have expertise.

David LeBlanc will assist with the project planning aspects. He will help ensure that the proper steps are followed during the software development process, but will not assist in any specific technical aspect of the project.

## Key Technical and Operational Requirements
This project is going to need technical aspects from PHP, MySQL, Amazon Web Services, Arduino, Data Visualization and Git. We will be developing the server side of the website using PHP, and the client side of the website using JavaScript. The database will be coded in MySQL, and be hosted using Amazon Web Services. We will require some knowledge on networking systems together since we are working with The Things Network and our own privately hosted database. On the website we will be using some data visualization tools such as D3 in order to present the data that is in the database. The sensors that we are using are Arduino, so we will need to understand and program in C in order to make them function. We will be using Git to maintain our code, so knowledge of that is also important.

## System Acceptance Tests 
Since this project is very loose in requirements from the client, the only tests we need to succeed in are coding the back end of the website in PHP, and using MySQL on an AWS server. If the project does succeed, a public API would also be a required result. We will test the system to ensure there are no security holes, and all the data is safe in the database. We will also test with simulated sensor data to ensure that the database is working properly, and that the data visualization is getting the right data and presenting it correctly. Tests will be made on multiple browsers. Any use of the API must not affect the database at all. We will ensure that the citizen/user of the system can interact easily with it, and ensure errors are minimal but exist when needed.


## Use Cases and Scenarios
### Add Sensor to the System
#### Actors
 - User
 - Administrator
 - Website
 - Database
 - Things Network
 - Sensor
#### Preconditions
 - User has received a pre-configured sensor from the City of Charlottetown that has been already registered in the Things Network application
 - Or user has built their own sensor that they want to contribute data to the network
#### Post-conditions
 - The sensor will be able to write data to the main database
 - The sensor will appear on the map that visualizes all sensors in Charlottetown
#### Normal Flow
 1.  The user navigates to the website
 2. The user selects the option from a menu to indicate they want to add a sensor to the system
 3. The user is prompted to select the location of the sensor from an interactive map
 4. The user is also asked to provide the unique identifying number that is on their sensor
 5. The user is also asked to provide an optional nickname for this sensor
 6. The information gathered from the user is submitted to the maintainers of the system
 7. All this user entered data becomes associated with their specific sensor, and any future data provided by that sensor that goes into the database will be tagged with its geographic location data
 8. The user provides power to the sensor and verifies that it has powered on properly
 9. The sensor sends its first data value to the Things Network
 10. The Things Network sends this data value to our database, which associates the unique ID of the sensor with geographic data that it received in step 3
 11. The user verifies that their sensor appears on the map visualization
#### Exceptions
 3.1, 4.1, 5.1  User cancels the process and is returned to the website main page
#### Alternate Flow
 4. User does not have a unique identifying number, and selects that option
    1. Confirm with use that they have not received the sensor from the City
    2. Get information about type of sensor, type of datam and an email from user
    3. Send this infor to a system administrator who will review the request
    4. If request is reasonable, administrator will add entry into Things Network for this citizen's sensor, and email citizen the sensor ID needed for Arduino code
    5. If request is not reasonable, email citizen and let them know what's wrong


### Remove a Sensor
#### Actors
 - User
 - Administrator
 - Sensor
 - Things Network
#### Preconditions
 - The sensor that is going to be removed was entered properly into the system previously
### Post-conditions
 - The sensor will not longer send data to our database for storage
### Normal Flow
 1. The user removes the power source from their sensor
 2. The sensor will no longer send any data to The Things Network, and therefore no more data from the sensor will be put in the database
 3. The user navigates to the website
 4. The user selects the option from a menu to indicate they want to remove a sensor from the system
 5. The user enters the unique sensor ID, and why they are choosing to remove their sensor
 6. This information is submitted to maintainers of the system, and the user receives instructions about where to give the sensor back to the City of Charlottetown
 
 
### View Current Data From all Sensors
#### Actors
 - User
 - Website
 - Database
#### Preconditions
 - There is relatively recent data from the sensors in the database (the cutoff for "recent" data will be determined at a later date) 
#### Post-conditions
 - The map will show the most up to date data from all sensors
#### Normal Flow
 1. The user navigates to the website
 2. As the website is loading, it pings the database (via a publicly available API) for the most up to date information about all of the sensors in Charlottetown
 3. The website computes how much of the map of Charlottetown it needs to show in order to fit all of the relevant sensors into the screen
 4. The website draws the default visualization with the data it received from the database
#### Alternative Flow
 4. The user wants to view some sort of visualization other than the default type
     1. The user selects the visualization that they want to see from a list of options
     2. The website updates its display (no new data needs to be retrieved from the database) 
#### Exceptions
 2 The API returns an error code instead of the most up to date data
     1. The website displays an error page instead of a visualization
 
 
### View Current Data from One Sensor
#### Actors
 - User 
 - Website
 - Database
#### Preconditions
 - The sensor the user wants to see has successfully been added to the database and has previously sent data to the database
#### Post-conditions
 - The user will see the most recent value from the sensor that is stored in the database
#### Normal Flow
 1. The user navigates to the website
 2. As the website is loading, it pings the database (via a publicly available API) for the most up to date information about all of the sensors in Charlottetown
 3. The website computes how much of the map of Charlottetown it needs to show in order to fit all of the relevant sensors into the screen
 4. The website draws the default visualization with the data it has from the default sensors
 5. The user clicks which sensor they want to see specific sensor information from
 6. There is a pop-up display box of some kind that shows the value of the most recent data point, and the time that this data was sent
#### Exceptions
 2. The API returns an error code instead of the most up to date data
     1. The website displays an error page instead of a visualization
 
 
### View Past Data
#### Actors
 - User
 - Website
 - Database
#### Preconditions
 - There is data in the database from the time period the user is interested in
#### Post-conditions
 - The user will be presented with a visualization of sensor data from some time in the past
#### Normal Flow
 1. The user navigates to the website
 2. The user selects the time period that they’re interested in from a menu of some kind (default selected option should be to display only the most up to date data)
 3. The relevant information is retrieved from the database
 4. The website updates to show the state of the data at the start of the user selected time period
 5. The user can advance the state of the data by some amount (by one hour, by X hours, by X days, by X weeks)
 6. As the time selection advances, the website will need to retrieve more data from the database to maintain smooth transitions
 7. The website visualization will transition between different times by fading between colors or by some other kind of smooth transition, based on whatever kind of visualization is being displayed
#### Exceptions
 2. The user enters a time period in the future or that is otherwise invalid
     1. The user is re-prompted to select a correct time
 3. There is no data available for the selected time period
     1. The API returns an error code to indicate no data was found for that period
     2. The website does not update visualization, but displays a message that no data is available for that time period


### Sensor Sends Data
#### Actors
 - Sensor
 - Things Network
 - Database
 - Website
#### Preconditions
 - The sensor and Things Network are both functioning properly
 - The sensor is in range of a Things Network Gateway
#### Post-conditions
 - The database has a new entry from the sensor
#### Normal Flow
 1. After some set amount of time since its last data update, the sensor will have new data to
send
 2. The sensor broadcasts this data over LoRaWAN
 3. The nearest Things Network gateway will receive this transmission
 4. Our database will update with this new entry
 5. The website will update in real time to reflect this new data entry with a smooth transition between the previous value and the new value


### Raw Data Access
#### Actors
 - User 
 - Database
#### Preconditions
 - The user knows how to work with the database API
 - The user knows what specific information they want from the database
#### Post-conditions
 - The user will have the data that they requested from the database via the API in some raw, textual format (likely in the form of JSON)
#### Normal Flow
 1. User determines the specifics about what sort of data they want from the database (time span, data type, geographic bounds, etc.)
 2. User sends the request to the database via an API
 3. Database responds with the raw information that the user requested (likely will be in the form of a JSON formatted string)
 4. User parses that information and does whatever they want with it
#### Exceptions
 3. User sends an improperly formatted request
     1. Error code is returned instead of data
     
     
## Feature List
### Create Arduino code to gather and send data to The Things Network
__Description__: Arduino will be reading temperature data from a sensor. Need to code a way to read that data properly. Figure out a way to transmit data from the sensor to the Things Network. Decide which data needs to be sent to the Things Network.

__Priority__: 2

__Effort__: 1

__Time__: 20 hours


### Test data integrity between Arduino, The Things Network, and the database
__Description__: Transmissions may not be received by the gateway for some reason. Ensure that this does not happen, or is at least minimized.

__Priority__: 1

__Effort__: 2

__Time__: 30 hours


### Research data extraction from the Things Network
__Description__: The Things Network will store data for us but only for a small amount of time, so we need to find a way to move this data to a database.

__Priority__: 1

__Effort__: 2

__Time__: 6 hours


### Create the data transfer scripts to send data from the Things Network to the database
__Description__: Create a solution that will transmit data from the Things Network to our database.

__Priority__: 1

__Effort__: 2

__Time__: 10 hours


### Research data visualization techniques
__Description__: Need to find what data visualizations are available, and decide what data visualization to use.

__Priority__: 3

__Effort__: 2

__Time__: 14 hours


### Build data visualization for the website
__Description__: Figure out implementation of the diagram, and where it will be processed (client side vs server side). Each point on the diagram will represent a sensor, and the area bounding the point will represent the area that sensor reading stands for.

__Priority__: 4

__Effort__: 4

__Time__: 40 hours


### Decide what data we need to store in the database
__Description__: We need to figure out what data to get from the Things Network that needs to be stored in the database, and how to store it - what tables are required and which columns go in which tables as well as keys required.

__Priority__: 2

__Effort__: 3

__Time__: 15 hours


### Learn and research AWS database
__Description__: We will be using Amazon Aurora for our database, need to figure out how it works.

__Priority__: 1

__Effort__: 2

__Time__: 10 hours


### Design and implement database
__Description__: given all the decisions made about the database we must construct the database

__Priority__: 1

__Effort__: 4

__Time__: 16 hours


### Research the AWS API
__Description__: Figure out how to use the AWS API.

__Priority__: 1

__Effort__: 3

__Time__: 10 hours


### Develop the API
__Description__: Create functionality to allow polling the database for most recent data and old data, as the user desires. Also enable functionality to poll the database for a single sensors data.

__Priority__: 1

__Effort__: 3

__Time__: 20 hours


### Design the front-end of the website
__Description__: The look and feel of the website, without the functionality

__Priority__: 2

__Effort__: 2

__Time__: 20 hours


### Function to create csv files
__Description__: A function which takes all the data from the database and puts it in CSV format.

__Priority__: 2

__Effort__: 3

__Time__: 15 hours


### Testing on API
__Description__: Need to be sure that the API will be secure, so no one can read/write data they aren’t supposed to and no one can delete any data unless admin.

__Priority__: 2

__Effort__: 4

__Time__: 20 hours


### Research Google Maps API
__Description__: Learn how to use Google Maps API

__Priority__: 3

__Effort__: 3

__Time__: 20 hours


### Create documentation for end users
__Description__: people who have the sensors in their possession need to know how to care for it and maintain it

__Priority__: 2

__Effort__: 2

__Time__: 24 hours


### Create documentation for API users
__Description__: users of the API need to know how to use it properly

__Priority__: 2

__Effort__: 2

__Time__: 12 hours


### Create documentation for Admin of the system
__Description__: Admin needs documentation for how the system works

__Priority__: 2

__Effort__: 1

__Time__: 12 hours


### Ensure security of the database
__Description__: Ensure no undesired accesses or writes are happening

__Priority__: 2

__Effort__: 2

__Time__: 5 hours


### Rapid prototyping of data visualization
__Description__: Create a data visualization that satisfies the customers needs and looks good.

__Priority__: 3

__Effort__: 3

__Time__: 20 hours


### Build back-end of website that utilizes the API
__Description__: Create the functional part of the website that fetches data from the database using our API and presents it to a user in some format.

__Priority__: 3

__Effort__: 2

__Time__: 10 hours


## Delivery Plan
## RMMM Plan
___(Risk, Mitigation, Monitoring, Management Plan)___
## Use Case Diagram
## Initial Class Definitions
## Activity Diagram
## State Diagram
## CRC Model
___(Class, Responsibilities, Collaborations model)___

![Dependency Chart](/Diagrams/activity_diagram.png)
## Sequence Diagrams
