Libraries in use:

https://github.com/adafruit/DHT-sensor-library (downloaded and installed manually)
TheThingsNetwork (installed from Arduino IDE)

Things Network Library intro:
https://www.youtube.com/watch?v=28Fh5OF8ev0

Wire Library (for i2c debugging with LCD display)

Had some issues with COM port and Things Uno... Tried new USB cable and it worked, not sure how to prevent this in future. Might just need to ensure cable is fully plugged in.

Valuable answer for encoding and decoding temperature: https://www.thethingsnetwork.org/forum/t/decoding-a-float-value-in-a-payload-function/4395/24

Payload format at https://console.thethingsnetwork.org/applications/charlottetown-heatmap/payload-formats is dependent on the binary form of the data received

TODO: might need to add sensor ID to this? or TTN might track that already

Fritzing diagram includes debugging LCD screen attached to DHT11 to view temperature and humidity readings directly on device