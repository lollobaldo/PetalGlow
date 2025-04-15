#include <Arduino.h>
#include <FastLED.h>
#include <Logger.h>

#include "FadeColors.h"

#undef MODULE_NAME
#define MODULE_NAME "CFade "

FadeColors::FadeColors(int nLeds, JsonObject params): nLeds(nLeds) {
    LOG_INFO(MODULE_NAME, "Starting FadeColors mode!");
    colors.reserve(nLeds);

    speed = params["speed"] | 128;  // Default to middle speed if not provided
    scale = params["scale"] | 5;    // Default to 5 seconds if not provided
    LOG_INFO(MODULE_NAME, "Speed: " << speed << ", Scale: " << scale);
    
    JsonArray colorsArray = params["colors"];
    for (JsonVariant item : colorsArray) {
        JsonObject color = item.as<JsonObject>();
        CHSV hsv = CHSV(color["h"], color["s"], color["v"]);
        LOG_INFO(MODULE_NAME, "Color: hsv(" << hsv.h << ", " << hsv.s << ", " << hsv.v <<")");
        colors.push_back(hsv);
    }
    // Initialize position and timing
    position = 0.0;
    lastUpdate = millis();
}

bool FadeColors::populateLeds(struct CRGB *leds, uint8_t *stemBrightness) {
    if (colors.size() < 2) {
        // Need at least 2 colors to fade between
        LOG_INFO(MODULE_NAME, "Not enough colors to fade between");
        return false;
    }
    
    unsigned long currentTime = millis();
    unsigned long elapsed = currentTime - lastUpdate;
    
    // Calculate how much to move the position
    // Higher speed = faster movement
    // Scale converts to seconds for a full cycle at max speed
    float maxSpeedInMs = scale * 1000.0;
    float speedFactor = speed / 255.0;
    float moveAmount = (elapsed / maxSpeedInMs) * speedFactor * colors.size();
    
    position += moveAmount;
    
    // Wrap around when we exceed the number of colors
    while (position >= colors.size()) {
        position -= colors.size();
    }
    
    // Update all LEDs with the interpolated color
    CHSV currentColor = getInterpolatedColor(position);
    for (int i = 0; i < nLeds; i++) {
        leds[i] = currentColor;
    }

    lastUpdate = currentTime;
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
/*
    CHSV newColor = blend(color1, color1, blendAmount, SHORTEST_HUES);
    
    // Calculate the shortest path for hue interpolation
    uint8_t h;
    int16_t clockwiseDist = ((int16_t)color2.h - color1.h + 256) % 256;
    
    if (clockwiseDist <= 128) {
        // Go clockwise - normal interpolation
        h = blend8(color1.h, color2.h, blendAmount * 255);
    } else {
        // Go counterclockwise - wrap around
        h = blend8(color1.h, color2.h, (1 - blendAmount) * 255);
        h = blend8(color2.h, color1.h, (1 - blendAmount) * 255);
    }
    
    // Normal interpolation for saturation and value
    uint8_t s = blend8(color1.s, color2.s, blendAmount * 255);
    uint8_t v = blend8(color1.v, color2.v, blendAmount * 255);
    
    return CHSV(h, s, v);
    */
}