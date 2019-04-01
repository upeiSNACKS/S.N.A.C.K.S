/*

Creating metrics views

SNACKS - A LoRaWAN based sensor network designed to monitor environmental
data around the City of Charlottetown, PE, Canada.

Copyright (C) 2019 Jeremy Thompson, R.J. Arsenault, Alec Metcalfe, Eduardo Egger

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

The best way to contact a developer is by email or via a pull request
on the GitHub page:

https://github.com/upeiSNACKS/snacks

jhthompson@upei.ca
rparsenault@upei.ca
almetcalfe@upei.ca
eegger@upei.ca

*/

CREATE VIEW Sensor_metrics AS
	SELECT  sensor_id,
			sensor_type,
            sensor_subtype,
            count(*) as count,
            min(reading) as minimum,
            max(reading) as maximum,
            avg(reading) as average
            from Readings group by sensor_id, sensor_type, sensor_subtype;
CREATE VIEW Max_values as
select sensor_type,
					sensor_subtype,
					max(reading) as max
                    from Readings group by sensor_type, sensor_subtype;
CREATE VIEW Min_values as
(select sensor_type,
					sensor_subtype,
                    min(reading) as min
                    from Readings group by sensor_type, sensor_subtype);
CREATE VIEW Type_metrics AS
	SELECT  sensor_type,
			sensor_subtype,
            max(reading) as maximum,
            (select a.reading_time
            from Readings a inner join
			Max_values b
				on a.sensor_type = b.sensor_type and a.sensor_subtype = b.sensor_subtype
				and a.reading = b.max limit 1) as max_time,
            min(reading) as minumum,
            (select a.reading_time
            from Readings a inner join
			Min_values b
				on a.sensor_type = b.sensor_type and a.sensor_subtype = b.sensor_subtype
				and a.reading = b.min limit 1) as min_time,
            avg(reading) as average
            from Readings group by sensor_type, sensor_subtype;
