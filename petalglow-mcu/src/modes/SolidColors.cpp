#include <Arduino.h>
#include <FastLED.h>
#include <Logger.h>

#include "SolidColors.h"

#undef MODULE_NAME
#define MODULE_NAME "CSolid"

SolidColors::SolidColors(int nLeds, JsonObject params) {
    LOG_INFO(MODULE_NAME, "Starting SolidColor mode!");
    this->stemBrightness = params["stemBrightness"] | 128;
    LOG_INFO(MODULE_NAME, "Stem brightness: " << this->stemBrightness);
    colors.reserve(nLeds);
    JsonArray colorsArray = params["colors"];
    for (JsonVariant item : colorsArray) {
        JsonObject color = item.as<JsonObject>();
        CHSV hsv = CHSV(color["h"], color["s"], color["v"]);
        LOG_INFO(MODULE_NAME, "Color: hsv(" << hsv.h << ", " << hsv.s << ", " << hsv.v << ")");
        colors.push_back(hsv);
    }
}

bool SolidColors::populateLeds(struct CRGB *leds, uint8_t *stemBrightness) {
    if (!isInit) {
        for (int i = 0; i < colors.size(); i++) {
            leds[i] = colors[i];
        }
        LOG_INFO(MODULE_NAME, "Stem1: " << this->stemBrightness);
        *stemBrightness = this->stemBrightness;
        isInit = true;
        return true;
    }
    return false;
}
