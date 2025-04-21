#pragma once

#include <Arduino.h>
#define ARDUINOJSON_USE_LONG_LONG 1
#include <ArduinoJson.h>
#include <Timer.h>
#include <memory>

#define FASTLED_EXPERIMENTAL_ESP32_RGBW_ENABLED 1
#include <FastLED.h>

#include "ModeController.h"

#define NUM_LEDS 7

class LampManager {
    private:
        Timer& timer;
        CRGB leds[NUM_LEDS];
        std::unique_ptr<ModeController> currentMode;
        JsonDocument doc;

    public:
        LampManager(Timer& timer_);

        void updateState(const char* payload, unsigned int length);
        void loop();
};
