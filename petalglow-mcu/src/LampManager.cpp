#include <Logger.h>

#include "utils.h"

#include "modes/FadeColors.h"
#include "modes/JumpColors.h"
#include "modes/SolidColors.h"

#include "LampManager.h"

#undef MODULE_NAME
#define MODULE_NAME "LmpMan"

#define FLOWERS_DATA_PIN 2
#define STEMS_DATA_PIN 3 // teensy
// #define STEMS_DATA_PIN 0 // waveshare
// #define STEMS_DATA_PIN 6 // trial

unsigned long fadeStartTime;
unsigned long lastStemValue;

LampManager::LampManager(Timer& timer_): timer(timer_) {
    LOG_INFO(MODULE_NAME, "Setting up Lamp Manager!");
    FastLED.addLeds<WS2812, FLOWERS_DATA_PIN, GRB>(leds, NUM_LEDS).setRgbw(RgbwDefault());

    fadeStartTime = millis();
    
    // Initialize the stem control pin
    pinMode(STEMS_DATA_PIN, OUTPUT);
    analogWrite(STEMS_DATA_PIN, 0);  // Start with stems off

    // timer.oscillate(STEMS_DATA_PIN, 1000, HIGH);
}

void LampManager::updateState(const char* payload, unsigned int length){
    DeserializationError error = deserializeJson(doc, payload, length);
    if (error) {
        LOG_INFO(MODULE_NAME, "deserializeJson() returned " << error.c_str());
        return;
    }
    const char* mode = doc["mode"];
    const JsonObject params = doc["params"];
    params["stemBrightness"] = doc["stemBrightness"] | 128;
    
    LOG_INFO(MODULE_NAME, "Received new mode: " << mode);
    if (strcmp(mode, "SOLID") == 0) {
        currentMode = std::make_unique<SolidColors>(NUM_LEDS, params);
    } else if (strcmp(mode, "FADE") == 0) {
        currentMode = std::make_unique<FadeColors>(NUM_LEDS, params);
    } else if (strcmp(mode, "JUMP") == 0) {
        currentMode = std::make_unique<JumpColors>(NUM_LEDS, params);
    }
}

void LampManager::loop() {
    if(!currentMode) {
        return;
    }
    uint8_t stemValue = 0;
    bool hasChanged = currentMode.get()->populateLeds(leds, &stemValue);
    
    if(hasChanged) {
        FastLED.show();
        stemValue = stemValue * stemValue / 255;
        if (stemValue != lastStemValue) {
            lastStemValue = stemValue;
            analogWrite(STEMS_DATA_PIN, stemValue);
        }
    }
    // LOG_INFO(MODULE_NAME, "Stem: " << stemValue);

    // unsigned long progress = millis() - fadeStartTime;
    // long brightness = 0;
    // if (progress <= 3000) brightness = map(progress, 0, 3000, 0, 255);
    // else if (progress <= 6000) brightness = map(6000 - progress, 0, 3000, 0, 255);
    // else fadeStartTime = millis(); // restart fade again
    // if (brightness != lastStemValue) {
    //     lastStemValue = brightness;
    //     analogWrite(STEMS_DATA_PIN, brightness * brightness / 255);
    // }
    // delay(50);
}
