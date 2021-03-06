/*

Arduino code that gathers temperature data every ~10 seconds and sends the data to The Things Network (TTN)
Various variables will need to be set at the start of the program to make the device work with specific TTN applications
Created by: Jeremy Thompson

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

// NOTES:
// The Adafruit SleepyDog library currently breaks the functionality of the serial

// Written by Jeremy Thompson 2019


// required libraries
#include "DHT.h" //temperature sensor library
#include <Wire.h> //LCD display for debugging
#include <TheThingsNetwork.h> //TTN LoRaWAN communication
#include <Adafruit_SleepyDog.h>

#define TIMEDELAY 2000 // waits 2 seconds between measurements
#define DHTPIN 7     // what digital pin DHT temp sensor is connected to
#define freqPlan TTN_FP_US915     // TTN_FP_EU868 or TTN_FP_US915 for European or US bandwidth

// magic numbers for subtype of sensors, additional types can be added in the futures
byte subtypes[10] = {
  0x00, // indoor
  0x01, // outdoor
};

#define DEBUG 1 // 1 if debugging, comment out if not

#define loraSerial Serial1
#define debugSerial Serial

// Uncomment whatever type you're using!
//#define DHTTYPE DHT11   // DHT 11
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
//#define DHTTYPE DHT21   // DHT 21 (AM2301)

// Connect pin 1 (on the left) of the sensor to +5V
// NOTE: If using a board with 3.3V logic like an Arduino Due connect pin 1
// to 3.3V instead of 5V!
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

// Initialize DHT sensor.
// Note that older versions of this library took an optional third parameter to
// tweak the timings for faster processors.  This parameter is no longer needed
// as the current DHT reading algorithm adjusts itself to work on faster procs.
DHT dht(DHTPIN, DHTTYPE);

// TTN connection
TheThingsNetwork ttn(loraSerial, debugSerial, freqPlan);

// AppEUI and AppKey for The Things Network

// SNACKS App EUI from TTN  -may change in the future if application changes
const char *appEui = "70B3D57ED001712B";

// REPLACE WITH YOUR SPECIFIC DEVICE APP KEY
const char *appKey = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

byte payload[5]; // for transmitting data

void setup() {

  loraSerial.begin(57600);
  debugSerial.begin(9600);

  dht.begin();

  // Wait a maximum of 10s for Serial Monitor (TTN)
  while (!debugSerial && millis() < 10000)
    ;

  //debugSerial.println("-- STATUS");
   ttn.showStatus();

  //debugSerial.println("-- JOIN");
   ttn.join(appEui, appKey);
}

void loop() {
  // Wait a few seconds between measurements.
  // delay(TIMEDELAY);

  // To enter low power sleep mode call Watchdog.sleep() like below
  // and the watchdog will allow low power sleep for as long as possible.
  // The actual amount of time spent in sleep will be returned (in
  // milliseconds).

  digitalWrite(LED_BUILTIN, HIGH); // indicate that the temperature is being read

  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)

  // Read sensor values and multiply by 100 to effectively keep 2 decimals
  float h = dht.readHumidity();

  // Unsigned 16 bits integer, 0 up to 65535
  uint16_t h_binary = h * 100;

  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();

  // Signed 16 bits integer, -32767 up to +32767
  int16_t t_binary = t * 100;

  // Read temperature as Fahrenheit (isFahrenheit = true)
  float f = dht.readTemperature(true);

  // Check if any reads failed and exit early (which will restart the loop, sleeping again and eventually attempting another read)
  if (isnan(h) || isnan(t) || isnan(f)) {
    #ifdef DEBUG
    Serial.println(F("Failed to read from DHT sensor!"));
    #endif
    return;
  }

  payload[0] = t_binary >> 8;
  payload[1] = t_binary;
  payload[2] = h_binary >> 8;
  payload[3] = h_binary;

  payload[4] = subtypes[0]; // indoor

  #ifdef DEBUG
  debugSerial.print("\n First byte of data sent: ");
  debugSerial.print(payload[0], HEX);
  debugSerial.print("\n Second byte of data sent: ");
  debugSerial.print(payload[1], HEX);
  debugSerial.print("\n Third byte of data sent: ");
  debugSerial.print(payload[2], HEX);
  debugSerial.print("\n Fourth byte of data sent: ");
  debugSerial.print(payload[3], HEX);
  debugSerial.println();
  #endif

  ttn_response_t response = ttn.sendBytes(payload, sizeof(payload));

  #ifdef DEBUG
  debugSerial.print(F("Humidity: "));
  debugSerial.print(h);
  debugSerial.print(F("%  Temperature: "));
  debugSerial.print(t);
  debugSerial.print(F("°C "));
  #endif

  digitalWrite(LED_BUILTIN, LOW); // indicate that the device is sleeping in low power mode

  // 1 hour = 60s/min x 60min = 3600 s
  // 14400 s / 8 s = 450

  // 1/2 hour = 1800 s
  // 1800 s / 8 s = 225

  unsigned int sleepCounter;

  for (sleepCounter = 450; sleepCounter > 0; sleepCounter--)
  {
    // doing this breaks serial print functionality so be careful when debugging with this sleep function left in
    Watchdog.sleep();
  }
}
