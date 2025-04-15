#include <Logger.h>

#include "utils.h"

#include "modes/FadeColors.h"
#include "modes/JumpColors.h"
#include "modes/SolidColors.h"

#include "LampManager.h"

#undef MODULE_NAME
#define MODULE_NAME "LmpMan"

#define FLOWERS_DATA_PIN 21
#define STEMS_DATA_PIN 0

LampManager::LampManager(Timer& timer_): timer(timer_) {
    LOG_INFO(MODULE_NAME, "Setting up Lamp Manager!");
    FastLED.addLeds<WS2812, FLOWERS_DATA_PIN, GRB>(leds, NUM_LEDS).setRgbw(RgbwDefault());
    FastLED.setBrightness(128);
    
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
        // LOG_INFO(MODULE_NAME, "Stem value: " << stemValue);
        analogWrite(STEMS_DATA_PIN, 4*stemValue);
        FastLED.show();
    }
}
