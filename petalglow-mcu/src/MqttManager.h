#pragma once

#include <Arduino.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <WebServer.h>
#include <WiFi.h>
#include <WiFiManager.h>

typedef std::function<void(byte* payload, unsigned int length)> DataCallback;

class MqttManager {
    inline static const char* CONNECTED = "CONNECTED";
    inline static const char* DISCONNECTED_MSG = "{\"state\":\"DISCONNECTED\"}";

    WiFiClient wifiClient;
    WiFiManager wifiManager;
    PubSubClient mqttClient;

    const char* clientName;
    DataCallback onData;

    const char* clientId;
    const char* connectionStatusTopic;
    const char* dataTopic;

    unsigned long lastWifiConnectionAttemptMillis;

    void reconnect();
    void setupWifi();
    String buildConnectedMsg();
    void onMqttMsg(char* topic, byte* payload, unsigned int length);

    public:
        MqttManager();
        void setup(const char* serverName, DataCallback onData);
        void loop();
        bool isMqttConnected();
};
