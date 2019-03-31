/*

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

CREATE TABLE Owners (
	email varchar(128) not null primary key,
    fname varchar(64),
    lname varchar(64),
    address varchar(128));
CREATE TABLE Types (
	sensor_type varchar(32) not null,
    sensor_subtype varchar(32) default '',
    unit varchar(8) default '',
    CONSTRAINT PRIMARY KEY (sensor_type, sensor_subtype));
CREATE TABLE Sensors (
	sensor_id varchar(64) not null,
    owner_email varchar(128) default '',
    sensor_lat varchar(16),
    sensor_lon varchar(16),
    CONSTRAINT PRIMARY KEY (sensor_id),
    CONSTRAINT FOREIGN KEY (owner_email) REFERENCES Owners (email)
		ON DELETE NO ACTION ON UPDATE CASCADE );
CREATE TABLE Readings (
	sensor_id varchar(64) not null,
    sensor_type varchar(32) default '',
    sensor_subtype varchar(32) not null,
    reading_time TIMESTAMP default CURRENT_TIMESTAMP,
    reading integer,
    CONSTRAINT PRIMARY KEY (sensor_id, sensor_type, sensor_subtype, reading_time),
    CONSTRAINT FOREIGN KEY (sensor_id) references Sensors (sensor_id)
		ON UPDATE CASCADE ON DELETE NO ACTION,
	CONSTRAINT FOREIGN KEY (sensor_type, sensor_subtype) references Types (sensor_type, sensor_subtype)
		ON UPDATE CASCADE ON DELETE NO ACTION);
