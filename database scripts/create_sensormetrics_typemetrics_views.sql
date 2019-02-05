# Creating metrics views
CREATE VIEW Sensor_metrics AS 
	SELECT  sensor_id, 
			sensor_type, 
            sensor_subtype, 
            count(*) as count, 
            min(sensor_reading) as minimum, 
            max(sensor_reading) as maximum, 
            avg(sensor_reading) as average
            from Readings group by sensor_id;
CREATE VIEW Type_metrics AS 
	SELECT  sensor_type, 
			sensor_subtype, 
            max(sensor_reading) as maximum, 
            (select a.sensor_time 
            from Readings a inner join 
			(select sensor_type, 
					sensor_subtype, 
					max(sensor_reading) as max 
                    from Readings group by sensor_type, sensor_subtype) b 
				on a.sensor_type = b.sensor_type and a.sensor_subtype = b.sensor_subtype 
				and a.sensor_reading = b.max limit 1) as max_time,
            min(sensor_reading) as minumum, 
            (select a.sensor_time 
            from Readings a inner join 
			(select sensor_type, 
					sensor_subtype, 
                    min(sensor_reading) as max 
                    from Readings group by sensor_type, sensor_subtype) b 
				on a.sensor_type = b.sensor_type and a.sensor_subtype = b.sensor_subtype 
				and a.sensor_reading = b.max limit 1) as min_time,
            avg(sensor_reading) as average
            from Readings group by sensor_type, sensor_subtype;