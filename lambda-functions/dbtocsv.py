# This lambda function gets executed monthly. 
# This lambda function is currently defunct. 
# The part where it uploads to the s3 instance will make the lambda function time out
# I'm not sure why it does that, but it does. 
import json
import pymysql
import datetime
import logging
import traceback
import boto3
from boto3.s3.transfer import TransferConfig
from os import environ

# Get environment variables set in the lambda function on AWS
endpoint=environ.get('ENDPOINT')
port=environ.get('PORT')
dbuser=environ.get('USER')
password=environ.get('PASSWORD')
database=environ.get('DATABASE')
bucketName = environ.get('BUCKET')
KEY_ID = environ.get('access')
ACCESS_KEY = environ.get('access_secret')
logger=logging.getLogger()
logger.setLevel(logging.INFO)

# Connect to a database
def make_connection():
    return pymysql.Connect(host=endpoint, user=dbuser, passwd=password,
        port=int(port), db=database, autocommit=True, cursorclass=pymysql.cursors.DictCursor)

def lambda_handler(event, context):
    # Get the s3 instance
    s3 = boto3.resource(
    's3',
    region_name='us-east-2',
    aws_access_key_id=KEY_ID,
    aws_secret_access_key=ACCESS_KEY
)
    config = TransferConfig(multipart_threshold=1024*25, max_concurrency=10,
                        multipart_chunksize=1024*25, use_threads=True)
    # Get the current month/year. eg: 2019-04
    currentDate = str(datetime.date.today()).split("-")
    currentmonth = currentDate[0] + "-" + currentDate[1]
    filename=currentmonth + ".csv"
    # SQL query to get the CSV from database for the month.
    command = "select concat(Sensors.sensor_id,',',Sensors.sensor_lat,',',Sensors.sensor_lon,',',Readings.reading,',',Readings.reading_time,',',Types.sensor_type,',',Types.sensor_subtype,',',Types.unit) as 'id,lat,lon,reading,time,type,subtype,unit' FROM Sensors, Readings, Types where Sensors.sensor_id=Readings.sensor_id and Readings.sensor_type=Types.sensor_type and Readings.sensor_subtype=Types.sensor_subtype and Readings.reading_time >= '" + currentmonth + "-01 00:00:00';"
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
            print(str(data))
            with open("/tmp/" + filename, "a+") as monthfile:
                print("FILE OPENED")
                monthfile.write(str(data))
                print("WRITTEN TO FILE")      
                # THIS IS WHERE THE SCRIPT FAILS
                # If you know a solution please help. 
                s3.Bucket(bucketName).upload_file("/tmp/" + filename, "CSV/" + filename, Config=config, Callback=lambda vars: logger.error("uploading..."))
                print("UPLOADED SUCCESSFULLY")
        except:
            logger.error("ERROR: Cannot execute cursor.\n{}".format(
                traceback.format_exc()) )
            return []

    except:
        logger.error("ERROR: Cannot connect to database from handler.\n{}".format(
            traceback.format_exc()))
        return None

    finally:
        try:
            cnx.close()
        except:
            pass
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
