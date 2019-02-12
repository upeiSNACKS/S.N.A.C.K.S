# Creating metrics views
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