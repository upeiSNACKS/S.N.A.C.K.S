/*

Creating Table_metrics table + triggers

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

CREATE TABLE IF NOT EXISTS Table_metrics (
	table_name varchar(32) not null primary key,
    row_count integer );
INSERT INTO Table_metrics values ('Owners', (select count(*) from Owners)),('Readings', (select count(*) from Readings)), ('Sensors', (select count(*) from Sensors)), ('Types', (select count(*) from Types));
CREATE TRIGGER after_insert_owners after insert on Owners for each row
UPDATE Table_metrics SET row_count=(SELECT COUNT(*) FROM Owners) where table_name='Owners';
CREATE TRIGGER after_insert_readings after insert on Readings for each row
UPDATE Table_metrics SET row_count=(SELECT COUNT(*) FROM Readings) where table_name='Readings';
CREATE TRIGGER after_insert_sensors after insert on Sensors for each row
UPDATE Table_metrics SET row_count=(SELECT COUNT(*) FROM Sensors) where table_name='Sensors';
CREATE TRIGGER after_insert_types after insert on Types for each row
UPDATE Table_metrics SET row_count=(SELECT COUNT(*) FROM Types) where table_name='Types';

CREATE TRIGGER after_delete_owners after delete on Owners for each row
UPDATE Table_metrics SET row_count=(SELECT COUNT(*) FROM Owners) where table_name='Owners';
CREATE TRIGGER after_delete_readings after delete on Readings for each row
UPDATE Table_metrics SET row_count=(SELECT COUNT(*) FROM Readings) where table_name='Readings';
CREATE TRIGGER after_delete_sensors after delete on Sensors for each row
UPDATE Table_metrics SET row_count=(SELECT COUNT(*) FROM Sensors) where table_name='Sensors';
CREATE TRIGGER after_delete_types after delete on Types for each row
UPDATE Table_metrics SET row_count=(SELECT COUNT(*) FROM Types) where table_name='Types';
