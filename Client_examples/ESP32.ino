#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <WebSocketsClient.h>
#include <SocketIOclient.h>
#include "DHT.h"



WiFiMulti WiFiMulti;
SocketIOclient socketIO;
#define DHTPIN 14
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
#define USE_SERIAL Serial
#define LED 12
int LED_STATE= 0;
bool blink = false;
void socketIOEvent(socketIOmessageType_t type, uint8_t *payload, size_t length) {
    switch (type) {
        case sIOtype_DISCONNECT:
            USE_SERIAL.printf("[IOc] Disconnected!\n");
            break;
        case sIOtype_CONNECT:
            USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);

            // Join default namespace (no auto join in Socket.IO V3)
            socketIO.send(sIOtype_CONNECT, "/");
            break;
        case sIOtype_EVENT: {
            char *sptr = NULL;
            int id = strtol((char *)payload, &sptr, 10);
            USE_SERIAL.printf("[IOc] get event: %s id: %d\n", payload, id);
            if (id) {
                payload = (uint8_t *)sptr;
            }
            DynamicJsonDocument doc(1024);
            DeserializationError error = deserializeJson(doc, payload, length);
            if (error) {
                USE_SERIAL.print(F("deserializeJson() failed: "));
                USE_SERIAL.println(error.c_str());
                return;
            }

            String eventName = doc[0];
            USE_SERIAL.printf("[IOc] event name: %s\n", eventName.c_str()); // Print any message received

            // Check if the event is "remote"
            if (eventName.equals("remote")) {
                String message = doc[1];
                USE_SERIAL.printf("[IOc] message: %s\n", message.c_str());

                // Check if the message is "1"
                if (message.equals("1")) {
                  USE_SERIAL.printf("LED ON");
                  blink=false;
                  LED_STATE=1; // Turn on the built-in LED
                } else if(message.equals("0")){
                  USE_SERIAL.printf("LED OFF");
                  blink=false;
                  LED_STATE=0; // Turn off the built-in LED
                }else{
                  USE_SERIAL.printf("LED BLINK");
                  blink=true;
                }
            }

            // Message includes an ID for an ACK (callback)
            if (id) {
                // Create JSON message for Socket.IO (ack)
                DynamicJsonDocument docOut(1024);
                JsonArray array = docOut.to<JsonArray>();

                // Add payload (parameters) for the ACK (callback function)
                JsonObject param1 = array.createNestedObject();

                // JSON to String (serialization)
                String output;
                output += id;
                serializeJson(docOut, output);

                // Send event
                socketIO.send(sIOtype_ACK, output);
            }
            break;
        }
        case sIOtype_ACK:
            USE_SERIAL.printf("[IOc] get ack: %u\n", length);
            break;
        case sIOtype_ERROR:
            USE_SERIAL.printf("[IOc] get error: %u\n", length);
            break;
        case sIOtype_BINARY_EVENT:
            USE_SERIAL.printf("[IOc] get binary: %u\n", length);
            break;
        case sIOtype_BINARY_ACK:
            USE_SERIAL.printf("[IOc] get binary ack: %u\n", length);
            break;
    }
}

void setup() {
    USE_SERIAL.begin(115200);
    USE_SERIAL.setDebugOutput(true);
    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

    for (uint8_t t = 4; t > 0; t--) {
        USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
        USE_SERIAL.flush();
        delay(1000);
    }

    WiFiMulti.addAP("leuleu", "iuiuhatehate"); // SSID, PASS

    while (WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
    }

    String ip = WiFi.localIP().toString();
    USE_SERIAL.printf("[SETUP] WiFi Connected %s\n", ip.c_str());

    // Server address, port, and URL
    socketIO.begin("103.163.119.124", 8080, "/socket.io/?EIO=4");

    // Event handler
    socketIO.onEvent(socketIOEvent);
    pinMode(LED,OUTPUT);
}

unsigned long messageTimestamp = 0;
unsigned long blinkTimestamp = 0;


void loop() {
    socketIO.loop();
    

    
    uint64_t now = millis();
    if(blink == true && now-blinkTimestamp> 400){
      blinkTimestamp=now;
      if(LED_STATE==1){
        LED_STATE=0;
      }else{
        LED_STATE=1;
        }
    }
    if(LED_STATE==1){
      digitalWrite(LED,HIGH);
    }else{
      digitalWrite(LED,LOW);
    }
    if (now - messageTimestamp > 5000) {
        messageTimestamp = now;
        // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t) ) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }
        // Create JSON message for Socket.IO (event)
        DynamicJsonDocument doc(1024);
        JsonArray array = doc.to<JsonArray>();

        // Add event name
        // Hint: socket.on('event_name', ....
        array.add("toMyDatabase"); // "toMyDatabase"

        // Add payload (parameters) for the event
        JsonObject param1 = array.createNestedObject();
        param1["databaseId"] = "642135fad6d53079497933c3";
        param1["method"] = "push";
        param1["data"]["dht11"]["temp"] = t;
        param1["data"]["dht11"]["humi"] = h;
        param1["timestamp"] = true;

        // JSON to String (serialization)
        String output;
        serializeJson(doc, output);

        // Send event
        socketIO.sendEVENT(output);

        // Print JSON for debugging
        USE_SERIAL.println(output);
    }
}
