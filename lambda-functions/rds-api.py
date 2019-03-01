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

logger.info("Cold start complete.")

def handler(event,context):
    print('parameters: ', event['queryStringParameters'])
    command = 'SELECT * FROM Readings'
    max_readings = 10
    '''
    TODO: sort by date
    TODO: range selection (everything if none)
    [DONE] TODO: time selection (everything if none)
    [DONE] TODO: sensor selection (all sensors if none)
    [DONE] TODO: max measurements (10 if none)
    [DONE] TODO: measurement type (list options, all if none)
    '''
    parameters = event['queryStringParameters']
    if parameters is not None:
        command += ' WHERE '
        if 'max_readings' in parameters:
            pass
            max_readings = int(parameters['max_readings'])
        if 'sensor_id' in parameters:
            pass
            command += 'sensor_id = \'' + parameters['sensor_id'] + '\' AND '
        if 'start_time' in parameters:
            pass
            command += 'reading_time > \'' + parameters['start_time'] + '\' AND '
        if 'end_time' in parameters:
            pass
            command += 'reading_time < \'' + parameters['end_time'] + '\' AND '
        if 'type' in parameters:
            pass
            command += 'sensor_type = \'' + parameters['type'] + '\' AND '
        if 'subtype' in parameters:
            pass
            command += 'sensor_subtype = \'' + parameters['subtype'] + '\' AND '
        '''
        Now that we have a query statement, we need to get rid of the last AND,
        and limit the query to the default max.
        '''
        command = command[:-5] + ' LIMIT ' + str(max_readings) + ';'
        print(command)

    else:
        command += 'LIMIT 10;'
    data = None
    try:
        cnx = make_connection()
        cursor=cnx.cursor(pymysql.cursors.DictCursor)

        try:
            cursor.execute(command)
        except:
            logger.error("ERROR: Cannot execute cursor.\n{}".format(
                traceback.format_exc()) )
            return data

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
    response = {
        "statusCode" : 200,
        "headers" : {
            "header1" : "its working yall!"},
        "body" : json.dumps(data),
        "isBase64Encoded" : "false"
    }
    return response

if __name__== "__main__":
    handler(None,None)
