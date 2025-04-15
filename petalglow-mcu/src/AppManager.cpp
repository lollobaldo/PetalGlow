#include <Arduino.h>
#include <Logger.h>
#include <Timer.h>

#include "LampManager.h"
#include "MqttManager.h"
#include "utils.h"

#undef MODULE_NAME
#define MODULE_NAME "AppMan"

class AppManager {
    private:
        Timer& timer;
        const char* appName;
        LampManager lampManager;
        MqttManager mqttManager;

    public:
        AppManager(Timer& timer_, const char* appName_)
            : timer(timer_), appName(appName_), lampManager(timer) {}

        void setup() {
            LOG_INFO(MODULE_NAME, "Setting up Application!");
            using std::placeholders::_1;
            using std::placeholders::_2;
            mqttManager.setup(appName, std::bind(&AppManager::onMqttData, this, _1, _2));
        }

        void loop() {
            mqttManager.loop();
            lampManager.loop();
        }

    private:
        void onMqttData(byte* payload, unsigned int length) {
            // char* jsonData = new char[length + 1];
            // memcpy(jsonData, payload, length);
            // jsonData[length] = '\0';
            lampManager.updateState((char*)payload, length);
            // delete[] jsonData;
        }
};
