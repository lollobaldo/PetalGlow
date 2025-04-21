#include <Arduino.h>
#include <FastLED.h>
#include <Logger.h>

#include "utils.h"

#include "FadeColors.h"

#undef MODULE_NAME
#define MODULE_NAME "CFade "

FadeColors::FadeColors(int nLeds, JsonObject params): nLeds(nLeds) {
    LOG_INFO(MODULE_NAME, "Starting FadeColors mode!");    

    stemBrightness = params["stemBrightness"] | 128;
    LOG_INFO(MODULE_NAME, "Stem brightness: " << stemBrightness);

    JsonArray colorsArray = params["colors"];
    colors.reserve(colorsArray.size());
    for (JsonVariant item : colorsArray) {
        JsonObject color = item.as<JsonObject>();
        CHSV hsv = CHSV(color["h"], color["s"], color["v"]);
        LOG_INFO(MODULE_NAME, "Color: hsv(" << hsv.h << ", " << hsv.s << ", " << hsv.v <<")");
        colors.push_back(hsv);
    }

    uint64_t startRaw = params["start"].as<unsigned long long>() | millis();
    uint8_t speed = params["speed"] | 128;  // Default to middle speed if not provided
    speedMs = speed * 100L;
    uint64_t fullCycleLength = speedMs * colors.size();
    start = startRaw % fullCycleLength;
    LOG_INFO(MODULE_NAME, "Speed: " << speedMs << "ms. Start: " << startRaw << " (norm " << start << ")");
}

bool FadeColors::populateLeds(struct CRGB *leds, uint8_t *stemBrightness) {
    if (colors.size() < 2) {
        // Need at least 2 colors to fade between
        LOG_INFO(MODULE_NAME, "Not enough colors to fade between");
        return false;
    }
    
    uint64_t fullCycleLength = speedMs * colors.size();
    uint64_t currentTime = utils::get_time_ms() % fullCycleLength;
    uint64_t elapsed = currentTime + fullCycleLength - start; // hack to avoid underflow

    // Calculate how much to move the position
    float position = (float)elapsed / speedMs;
    // Wrap around when we exceed the number of colors
    int size = colors.size();
    while (position >= size) {
        position -= size;
    }
    
    // Update all LEDs with the interpolated color
    CHSV currentColor = getInterpolatedColor(position);
    for (int i = 0; i < nLeds; i++) {
        leds[i] = currentColor;
    }

    *stemBrightness = this->stemBrightness;
    return true;  // Always update LEDs for this mode
}

CHSV FadeColors::getInterpolatedColor(float pos) {
    // Find the two colors to interpolate between
    int colorIndex1 = floor(pos);
    int colorIndex2 = (colorIndex1 + 1) % colors.size();
    
    // Calculate the blend amount between the two colors
    float blendAmount = pos - colorIndex1;
    
    // Get the two colors
    CHSV color1 = colors[colorIndex1];
    CHSV color2 = colors[colorIndex2];
    return blend(color1, color2, blendAmount * 255, SHORTEST_HUES);
}
