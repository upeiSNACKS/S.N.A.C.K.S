# Public API documentation

## Full url:
https://jm6ctx1smj.execute-api.us-east-2.amazonaws.com/beta/DBapiAccess

## No parameters:

Returns the last 10 readings to enter the db, along with the sensor id, reading type, subtype, and value

## Parameters:

`sensor_id`

Accepts a string referencing the sensor id of a sensor
Filters readings by specified sensor

`start_time`

Accepts a string containing a date, in format:

“YYYY-MM-DD HH:MM:SS”

Examle:

“2019-02-16 17:52:15”

Returns data only after the specified date.

`end_time`

Accepts a string containing a date, in the same format as the start_time
Returns data only before the specified date

`type`

Accepts a string specifying the type of the sensor. Example: “Temperature” see a list of available types here
Returns data matching that sensor type

`subtype`

Accepts a string specifying the subtype of a sensor. Example “Indoors”. See a list of available subtypes here
Returns data matching that subtype

`max_readings`

Accepts an integer specifying the maximum number of measurement elements returned. 
Set to 10 measurements by default, but can be set to anything. This may change in the future.

`lat`

Accepts a float specifying the a latitude
Used to specify a radius to group sensors in. Does nothing if parameter “lon” is not specified

`lon`

Accepts a float specifying the longitude
Used to specify a radius to group sensors in. Does nothing if parameter “lat” is not specified

`radius`

Accepts a float specifying a radius in kilometres
Used to select sensors within a certain radius. Does nothing if parameters “lon” and “lat” are not specified. Set to 10km if “lat” and “lon” are specified but “range” isn’t

`sensor_location`

Accepts true or false
Used to have the output include the sensors location. Defaults to false. 

## Returned JSON object:

A list of reading objects, formatted as such:
```
[
  {
    "sensor_id": "identification tag of the sensor (ex: 3754-ZqyII6DjyV-32467)",
    "sensor_type": "measurement type (ex: Temperature)",
    "sensor_subtype": "measurement subtype (ex: Indoors)",
    "reading_time": "measurement date and time (ex: 2019-06-01 05:45:18)",
    "reading": "value measured (ex: 5)",
    "sensor_lat": "latitude of the sensor (ex: 46.2695)[OPTIONAL]",
    "sensor_lon": "longitude of the sensor (ex: -63.1378)[OPTIONAL]"
  }
]
```
