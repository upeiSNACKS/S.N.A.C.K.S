#!/usr/bin/env python
#
# serverless database query - mysql example
# Copyright 2016 Amazon.com, Inc. or its affiliates.
# All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License").
# You may not use this file except in compliance with the License.
# A copy of the License is located at
#
#    http://aws.amazon.com/apache2.0/
#
# This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
# or in the "license" file accompanying this file.
# either express or implied. See the License for the specific language governing permissions
# and limitations under the License.
#by Eduardo"

'''
The following script is meant to be used in an AWS Lambda environment, using
python 3.6. To run, it requires pymysql, and the database access keys set
as environment parameters.
'''

import pymysql
import logging
import traceback
import json
import re
from os import environ

endpoint=environ.get('ENDPOINT')
port=environ.get('PORT')
dbuser=environ.get('DBUSER_OUT')
password=environ.get('DBPASSWORD_OUT')
database=environ.get('DATABASE')

logger=logging.getLogger()
logger.setLevel(logging.INFO)

def make_connection():
    return pymysql.connect(host=endpoint, user=dbuser, passwd=password,
        port=int(port), db=database, autocommit=True, cursorclass=pymysql.cursors.DictCursor)

def log_err(errmsg):
    logger.error(errmsg)
    return {"body": errmsg , "headers": {}, "statusCode": 400,
        "isBase64Encoded":"false"}

def check_for_errors(parameters):
    accepted_parameters = ['sensor_id',
                            'start_time',
                            'end_time',
                            'type',
                            'subtype',
                            'lat',
                            'lon',
                            'radius',
                            'max_readings']
    bad_parameters = []
    if parameters is not None:
        #Check for typing errors
        for k in parameters:
            if not k in accepted_parameters:
                bad_parameters.append('unknown parameter '+k)

        #Check for malformed parameters
        if 'start_time' in parameters and not re.match('\D\D-\D\D-\D\D\D\D', parameters['start_time']):
            pass
            bad_parameters.append('malformed start_time: '+parameters['start_time']+' should have format DD-MM-YYYY')
        if 'end_time' in parameters and not re.match('\D\D-\D\D-\D\D\D\D', parameters['end_time']):
            pass
            bad_parameters.append('malformed end_time: '+parameters['end_time']+' should have format DD-MM-YYYY')
        if 'lat' in parameters and (int(parameters['lat']) > 90 or int(parameters['lat']) < -90):
            bad_parameters.append('malformed lat: '+str(int(parameters['lat']))+' should be within -90 and 90')
        if 'lon' in parameters and (int(parameters['lon']) > 180 or int(parameters['lat']) < -180):
            bad_parameters.append('malformed lon: '+str(int(parameters['lon']))+' should be within -180 and 180')
    return bad_parameters

def handler(event,context):
    response = {
        "statusCode" : 200,
        "headers" : {
            "Access-Control-Allow-Origin" : "*",
            "the-Game" : "you just lost it"
        },
        "body" : None,
        "isBase64Encoded" : "false"
    }
    max_readings = 500
    command = 'SELECT Readings.*, Sensors.sensor_lat, sensor_lon FROM Readings, Sensors WHERE Readings.sensor_id = Sensors.sensor_id AND '
    parameters = event['queryStringParameters']

    errors_found = check_for_errors(parameters)
    if len(errors_found) > 0:
        pass
        response['body'] = json.dumps({'invalid parameter': errors_found})
        response['statusCode'] = 400
        return response

    if parameters is not None:
        pass
        if 'sensor_id' in parameters:
            pass
            command += 'Sensors.sensor_id = \'' + parameters['sensor_id'] + '\' AND '
        if 'start_time' in parameters:
            if parameters['start_time'] == 'now':
                command += 'reading_time >= all (select date_format(reading_time, \'%Y-%m-%d %H\') from Readings) AND '
            else:
                command += 'reading_time > \'' + parameters['start_time'] + '\' AND '
        if 'end_time' in parameters:
            if'start_time' not in parameters:
                command += 'reading_time < \'' + parameters['end_time'] + '\' AND '
        if 'type' in parameters:
            pass
            command += 'sensor_type = \'' + parameters['type'] + '\' AND '
        if 'subtype' in parameters:
            pass
            command += 'sensor_subtype = \'' + parameters['subtype'] + '\' AND '
        if 'lat' in parameters and 'lon' in parameters:
            pass
            radius_to_degrees = 111
            lon = str(float(parameters['lon']))
            lat = str(float(parameters['lat']))
            command += 'SQRT(POW(Sensors.sensor_lat - ' + lat + ', 2) + POW(Sensors.sensor_lon - ' + lon + ', 2)) <= '
            if 'radius' in parameters:
                pass
                #define here the range in which sensor readings can be accepted
                radius = str(float(parameters['radius']) / radius_to_degrees)
                command += radius + ' AND '
            else:
                #set the range of accepted sensors to 10km
                command += str(float(10 / radius_to_degrees)) + ' AND '

        '''
        Now that we have a query statement, we need to get rid of the last AND,
        and limit the query to the default max.
        '''
        if 'max_readings' in parameters:
            max_readings = int(parameters['max_readings'])
        else:
            pass
            command = command[:-5] + ' ORDER BY reading_time DESC;'
    command = command[:-5] + ' ORDER BY reading_time DESC LIMIT ' + str(max_readings) + ';'
    #else:
    #    '''
    #    In case no parameters were picked, we come here
    #    '''
    #    #command = command[:-5] + ' ORDER BY reading_time DESC;' #FROM Readings, Sensors WHERE Readings.sensor_id = Sensors.sensor_id AND


    data = None
    try:
        cnx = make_connection()
        cursor=cnx.cursor(pymysql.cursors.DictCursor)

        try:
            cursor.execute(command)
        except:
            logger.error("ERROR: Cannot execute cursor.\n{}".format(
                traceback.format_exc()) )
            return cursor.errmsg

        try:
            data = cursor.fetchall()
        except:
            logger.error("ERROR: Cannot execute cursor.\n{}".format(
                traceback.format_exc()) )
            return data

    except:
        logger.error("ERROR: Cannot connect to database from handler.\n{}".format(
            traceback.format_exc()))
        return None

    finally:
        try:
            cnx.close()
        except:
            pass
    for d in data:
        for k in d:
            d[k] = str(d[k])
    response['body'] = json.dumps(data)
    return response

if __name__== "__main__":
    handler(None,None)
