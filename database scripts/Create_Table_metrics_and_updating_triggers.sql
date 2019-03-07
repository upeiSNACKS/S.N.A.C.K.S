# Creating Table_metrics table + triggers

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
