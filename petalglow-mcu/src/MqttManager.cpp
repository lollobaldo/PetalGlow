#include <Logger.h>

#include "utils.h"

#include "MqttManager.h"

#undef MODULE_NAME
#define MODULE_NAME "MqttManager"

#define MQTT_SERVER "mqtt.flespi.io"
#define MQTT_PORT 1883
#define MQTT_PASSWORD ""

#ifndef MQTT_USER
    #error "MQTT_USER is not defined"
#endif

#ifndef AP_NAME
    #error "AP_NAME is not defined"
#endif

#ifndef AP_PSWD
    #define AP_PSWD "AP123456"
#endif

#ifndef CLIENT_ID
    #error "CLIENT_ID is not defined"
#endif

#ifndef WIFI_SSID
    #error "WIFI_SSID is not defined"
#endif

#ifndef WIFI_PSWD
    #error "WIFI_PSWD is not defined"
#endif

#define WM_CONNECTION_TIMEOUT 10
#define WM_CONNECTION_GAP_MS 30 * 1000

// 3 minutes timeout when prompting for wifi credentials
#define WM_PORTAL_TIMEOUT 3 * 60

#define MQTT_MSG_BUFFER_SIZE 512

#define MQTT_TOPIC_PREFIX "petalglow/"

using std::placeholders::_1;
using std::placeholders::_2;
using std::placeholders::_3;

std::vector<const char*> WM_MENU_ITEMS = {"wifi", "setup", "sep", "info", "param", "exit"};

MqttManager::MqttManager() : wifiClient(), wifiManager(), mqttClient(wifiClient) {

}

void MqttManager::setup(const char* cn, DataCallback onDt) {
    clientName = cn;
    onData = onDt;
    clientId = utils::concat(clientName, "-",  CLIENT_ID);
    connectionStatusTopic = utils::concat(MQTT_TOPIC_PREFIX,  clientId,  "/connectionStatus");
    dataTopic = utils::concat(MQTT_TOPIC_PREFIX, clientId, "/data");
    setupWifi();
    mqttClient.setBufferSize(MQTT_MSG_BUFFER_SIZE);
    mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
    mqttClient.setCallback(std::bind(&MqttManager::onMqttMsg, this, _1,_2,_3));
}

void MqttManager::setupWifi() {
    LOG_INFO(MODULE_NAME, "Setting up WiFi!");
    wifiManager.setDebugOutput(true, "WIFMAN ");
    wifiManager.setDebugOutput(true, WM_DEBUG_VERBOSE);
    wifiManager.debugPlatformInfo();
    wifiManager.setCountry("GB");
    wifiManager.setShowPassword(true);
    wifiManager.setHostname(clientName);
    wifiManager.setTitle(clientName);
    wifiManager.setMenu(WM_MENU_ITEMS);
    wifiManager.setConnectTimeout(WM_CONNECTION_TIMEOUT);
    wifiManager.setConfigPortalBlocking(false);
    wifiManager.setConfigPortalTimeout(WM_PORTAL_TIMEOUT);
    wifiManager.setConfigPortalTimeoutCallback([]() { LOG_INFO(MODULE_NAME, "Closing portal!"); });
    wifiManager.preloadWiFi(WIFI_SSID, WIFI_PSWD);
    bool res = wifiManager.autoConnect(AP_NAME);
    wifiManager.setEnableConfigPortal(false); // Only enable first time.
    if(!res) {
        LOG_ERROR(MODULE_NAME, "Could not autoconnect after " << WM_CONNECTION_TIMEOUT << " sec.");
    }
    else {
        LOG_INFO(MODULE_NAME, "Wifi connected. IP address: " << WiFi.localIP());
        int8_t rssi = WiFi.RSSI();
        LOG_INFO(MODULE_NAME, "Strength " << rssi << "dBm (" << wifiManager.getRSSIasQuality(rssi) << "%)");
    }
}

void MqttManager::setupNtp() {
    configTime(0, 0, SNTP_SERVER);
}

void MqttManager::reconnect() {
    int retries = 0;
    while (!mqttClient.connected() && retries < 3) {
        retries += 1;
        LOG_INFO(MODULE_NAME, "Attempting MQTT connection as " << clientName << "...");
        LOG_INFO(MODULE_NAME, "Will channel: " << connectionStatusTopic);
        LOG_INFO(MODULE_NAME, "Will: " << DISCONNECTED_MSG);
        bool connected = mqttClient.connect(clientId, MQTT_USER, MQTT_PASSWORD, connectionStatusTopic, MQTTQOS1, true, DISCONNECTED_MSG);
        if (connected) {
            LOG_INFO(MODULE_NAME, "MQTT Connected");
            String connectedMsg = buildConnectedMsg();
            mqttClient.publish(connectionStatusTopic, connectedMsg.c_str(), true);
            LOG_INFO(MODULE_NAME, "Subscribing to channel " << dataTopic);
            mqttClient.subscribe(dataTopic);
        } else {
            LOG_ERROR(MODULE_NAME, "MQTT Connection error. Rc: " << mqttClient.state() << ". Will try again in 1 seconds");
            delay(1000);
        }
    }
}

void MqttManager::onMqttMsg(char* topic, byte* payload, unsigned int length) {
    LOG_INFO(MODULE_NAME, "Received MQTT data!");
    onData(payload, length);
}

bool MqttManager::isMqttConnected() {
    return mqttClient.connected();
}

void MqttManager::loop() {
    if(wifiManager.getConfigPortalActive()) {
        wifiManager.process();
    }
    else if (WiFi.status() != WL_CONNECTED) {
        if(millis() - lastWifiConnectionAttemptMillis >= WM_CONNECTION_GAP_MS) {
            LOG_INFO(MODULE_NAME, "Re-attempting WiFi connection...");
            lastWifiConnectionAttemptMillis = millis();
            wifiManager.autoConnect();
        }
    }
    else if (!mqttClient.connected()) {
        setupNtp();
        reconnect();
    }
    else {
        mqttClient.loop();
    }
}

String MqttManager::buildConnectedMsg() {
    JsonDocument doc;
    doc["state"] = CONNECTED;
    doc["ssid"] = WiFi.SSID();
    doc["ip"] = WiFi.localIP().toString();
    doc["dbm"] = WiFi.RSSI();

    String output;
    serializeJson(doc, output);
    return output;
}

