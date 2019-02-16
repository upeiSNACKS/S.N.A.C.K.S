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
from os import environ

endpoint=environ.get('ENDPOINT')
port=environ.get('PORT')
dbuser=environ.get('DBTTNUSER_IN')
password=environ.get('DBPASSWORD_IN')
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

    #logger.info('Data received: ', str(event))
    #TODO: add the values to the command here
    payload_fields = event['payload_fields']
    for field in payload_fields:
        command = 'INSERT INTO Readings (sensor_id, sensor_type, sensor_subtype, reading_time, reading) VALUES ('
        command += '\''+event['hardware_serial']+'\', '
        command += '\''+field.capitalize()+'\', ' #TODO: add sql statement to query other table
        command += '\'Indoors\', ' #TODO: add sql statement to query other table
        time = event['metadata']['time']
        time = time.replace('T', ' ')
        time = time.split('.')[0]
        command += '\'' + time +'\', '
        command += '\'' + str(payload_fields[field]) + '\')'

        try:
            cnx = make_connection()
            cursor=cnx.cursor()

            try:
                cursor.execute(command)
            except:
                logger.error("ERROR: Cannot execute cursor.\n{}".format(
                    traceback.format_exc()) )

        except:
            logger.error("ERROR: Cannot connect to database from handler.\n{}".format(
                traceback.format_exc()))


        finally:
            try:
                cnx.close()
            except:
                pass

if __name__== "__main__":
    handler(None,None)
