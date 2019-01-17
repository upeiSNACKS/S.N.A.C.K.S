// Building on top of DHT11 sensor example code to gather temperature at set intervals.
// Written by Jeremy Thompson 2019
// Example testing sketch for various DHT humidity/temperature sensors
// Written by ladyada, public domain

// required libraries
#include "DHT.h" //temperature sensor library
#include <Wire.h> //LCD display for debugging
#include <LiquidCrystal_I2C.h> //LCD display for debugging
#include <TheThingsNetwork.h> //TTN LoRaWAN communication

#define TIMEDELAY 2000 // waits 2 seconds between measurements
#define DHTPIN 7     // what digital pin DHT temp sensor is connected to
#define freqPlan TTN_FP_US915     // TTN_FP_EU868 or TTN_FP_US915 for European or US bandwidth

// For LCD debugging with Leonardo (Things Uno), SDA and SCL pins are as follows:
// SDA: 2 (NOT A2)
// SCL : 3 (NOT A3)
// SDA and SCL of LCD need to be connected to the appropriate pins

#define loraSerial Serial1
#define debugSerial Serial

// Uncomment whatever type you're using!
#define DHTTYPE DHT11   // DHT 11
//#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
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

// set the LCD address to 0x38 for a 16 chars and 2 linedisplay
LiquidCrystal_I2C lcd(0x38, 16, 2);

// TTN connection
TheThingsNetwork ttn(loraSerial, debugSerial, freqPlan);

// AppEUI and AppKey for The Things Network
const char *appEui = "70B3D57ED000F6F6";
const char *appKey = "ECDEFF8CAAA80B6A7EF0522B027DEFFC";

byte payload[4]; // for transmitting data

void setup() {
  lcd.init(); //initialize the lcd
  lcd.backlight(); //open the backlight
  loraSerial.begin(57600);
  debugSerial.begin(9600);
  Serial.println(F("DHTxx test!"));

  dht.begin();

  // Wait a maximum of 10s for Serial Monitor (TTN)
  while (!debugSerial && millis() < 10000)
    ;

  debugSerial.println("-- STATUS");
  ttn.showStatus();

  debugSerial.println("-- JOIN");
  ttn.join(appEui, appKey);
}

void loop() {
  // Wait a few seconds between measurements.
  delay(TIMEDELAY);

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

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  payload[0] = t_binary >> 8;
  payload[1] = t_binary;
  payload[2] = h_binary >> 8;
  payload[3] = h_binary;

  debugSerial.print("\n First byte of data sent: ");
  debugSerial.print(payload[0], HEX);
  debugSerial.print("\n Second byte of data sent: ");
  debugSerial.print(payload[1], HEX);
  debugSerial.print("\n Third byte of data sent: ");
  debugSerial.print(payload[2], HEX);
  debugSerial.print("\n Fourth byte of data sent: ");
  debugSerial.print(payload[3], HEX);
  debugSerial.println();

  ttn.sendBytes(payload, sizeof(payload));
  
  // Compute heat index in Fahrenheit (the default)
  float hif = dht.computeHeatIndex(f, h);
  // Compute heat index in Celsius (isFahreheit = false)
  float hic = dht.computeHeatIndex(t, h, false);

  debugSerial.print(F("Humidity: "));
  debugSerial.print(h);
  debugSerial.print(F("%  Temperature: "));
  debugSerial.print(t);
  debugSerial.print(F("°C "));
  debugSerial.print(f);
  debugSerial.print(F("°F  Heat index: "));
  debugSerial.print(hic);
  debugSerial.print(F("°C "));
  debugSerial.print(hif);
  debugSerial.println(F("°F"));

  lcd.setCursor(0, 0);
  lcd.print(t);
  lcd.setCursor(6, 0);
  lcd.print("deg C");
  lcd.setCursor(0, 1);
  lcd.print(h);
  lcd.setCursor(6, 1);
  lcd.print("% humidity");
}