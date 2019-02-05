CREATE TABLE Owners (
	email varchar(128) not null primary key, 
    fname varchar(64), 
    lname varchar(64), 
    address varchar(128));
CREATE TABLE Types (
	type varchar(32) not null primary key, 
    subtype varchar(32) default '', 
    unit varchar(8) default '');
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
    sensor_type varchar(32) not null, 
    sensor_subtype varchar(32) not null, 
    time TIMESTAMP default CURRENT_TIMESTAMP, 
    reading varchar(16),
    CONSTRAINT PRIMARY KEY (sensor_id, sensor_type, sensor_subtype, time), 
    CONSTRAINT FOREIGN KEY (sensor_id) references Sensors (sensor_id)
		ON UPDATE CASCADE ON DELETE NO ACTION, 
	CONSTRAINT FOREIGN KEY (sensor_type, sensor_subtype) references Types (type, subtype)
		ON UPDATE CASCADE ON DELETE NO ACTION);