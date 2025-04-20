#include <Arduino.h>
#include <FastLED.h>
#include <Logger.h>

#include "JumpColors.h"

#undef MODULE_NAME
#define MODULE_NAME "CJump "

JumpColors::JumpColors(int nLeds, JsonObject params): nLeds(nLeds) {
    LOG_INFO(MODULE_NAME, "Starting JumpColors mode!");
    colors.reserve(nLeds);

    // Get parameters with defaults (all in 0-255 range)
    this->stemBrightness = params["stemBrightness"] | 128;
    LOG_INFO(MODULE_NAME, "Stem brightness: " << this->stemBrightness);
    fadeInTime = params["fadeIn"] | 50;     // Default ~50/255 fade in
    fadeOutTime = params["fadeOut"] | 50;   // Default ~50/255 fade out
    lengthTime = params["length"] | 150;    // Default ~150/255 full color display
    scale = params["scale"] | 1;            // Default scale factor of 1 second
    
    LOG_INFO(MODULE_NAME, "FadeIn: " << (int)fadeInTime << ", Length: " << (int)lengthTime 
             << ", FadeOut: " << (int)fadeOutTime << ", Scale: " << (int)scale);
    
    JsonArray colorsArray = params["colors"];
    for (JsonVariant item : colorsArray) {
        JsonObject color = item.as<JsonObject>();
        CHSV hsv = CHSV(color["h"], color["s"], color["v"]);
        LOG_INFO(MODULE_NAME, "Color: hsv(" << hsv.h << ", " << hsv.s << ", " << hsv.v <<")");
        colors.push_back(hsv);
    }
    
    // Initialize timing and state
    lastUpdate = millis();
    cycleStartTime = lastUpdate;
    currentColorIndex = 0;
}

// Update populateLeds to handle stem brightness
bool JumpColors::populateLeds(struct CRGB *leds, uint8_t *stemBrightness) {
    if (colors.size() < 1) {
        LOG_INFO(MODULE_NAME, "No colors defined");
        return false;
    }
    
    unsigned long currentTime = millis();
    unsigned long elapsed = currentTime - lastUpdate;
    
    // Convert 0-255 values to actual milliseconds using scale
    float msPerUnit = (scale * 1000.0f) / 255.0f;
    unsigned long fadeInMs = fadeInTime * msPerUnit;
    unsigned long lengthMs = lengthTime * msPerUnit;
    unsigned long fadeOutMs = fadeOutTime * msPerUnit;
    
    // Calculate total cycle time for one color
    unsigned long totalCycleTime = fadeInMs + lengthMs + fadeOutMs;
    
    // Calculate time elapsed in the current cycle
    unsigned long elapsedInCycle = (currentTime - cycleStartTime) % totalCycleTime;
    
    // Check if we need to move to the next color
    if (currentTime - cycleStartTime >= totalCycleTime) {
        currentColorIndex = (currentColorIndex + 1) % colors.size();
        cycleStartTime = currentTime - elapsedInCycle; // Adjust for any overflow
    }
    
    // Get the current color based on the phase in the cycle
    CHSV currentColor = getCurrentColor(elapsedInCycle, currentColorIndex);
    
    // Update all LEDs with the current color
    for (int i = 0; i < nLeds; i++) {
        leds[i] = currentColor;
    }
    
    // Calculate stem brightness based on current cycle phase
    *stemBrightness = calculateStemBrightness(elapsedInCycle);
    
    lastUpdate = currentTime;
    return true;  // Always update LEDs for this mode
}

// New function to calculate stem brightness based on cycle phase
uint8_t JumpColors::calculateStemBrightness(unsigned long elapsedInCycle) {
    // Convert 0-255 values to actual milliseconds using scale
    float msPerUnit = (scale * 1000.0f) / 255.0f;
    unsigned long fadeInMs = fadeInTime * msPerUnit;
    unsigned long lengthMs = lengthTime * msPerUnit;
    unsigned long fadeOutMs = fadeOutTime * msPerUnit;
    
    // Handle stem brightness based on the current phase in the cycle
    if (elapsedInCycle < fadeInMs) {
        // During fade in, gradually increase stem brightness
        if (fadeInMs > 0) {
            float fadeInProgress = (float)elapsedInCycle / fadeInMs;
            return this->stemBrightness * fadeInProgress;
        }
    } else if (elapsedInCycle < fadeInMs + lengthMs) {
        // Full brightness during the length phase
        return this->stemBrightness;
    } else {
        // During fade out, gradually decrease stem brightness
        unsigned long fadeOutStart = fadeInMs + lengthMs;
        unsigned long fadeOutElapsed = elapsedInCycle - fadeOutStart;
        
        if (fadeOutMs > 0) {
            float fadeOutProgress = 1.0 - ((float)fadeOutElapsed / fadeOutMs);
            return this->stemBrightness * fadeOutProgress;
        }
    }
    
    // Default fallback
    return this->stemBrightness;
}

CHSV JumpColors::getCurrentColor(unsigned long elapsedInCycle, int colorIndex) {
    CHSV baseColor = colors[colorIndex];
    CHSV resultColor = baseColor;
    
    // Convert 0-255 values to actual milliseconds using scale
    // Scale factor makes 255 correspond to 'scale' seconds
    float msPerUnit = (scale * 1000.0f) / 255.0f;
    unsigned long fadeInMs = fadeInTime * msPerUnit;
    unsigned long lengthMs = lengthTime * msPerUnit;
    unsigned long fadeOutMs = fadeOutTime * msPerUnit;
    
    // Calculate total cycle time
    unsigned long totalCycleTime = fadeInMs + lengthMs + fadeOutMs;
    
    // Determine which phase we're in and adjust brightness accordingly
    if (elapsedInCycle < fadeInMs) {
        // Fade in phase
        if (fadeInMs > 0) {
            float fadeInProgress = (float)elapsedInCycle / fadeInMs;
            resultColor.value = baseColor.value * fadeInProgress;
        }
    } else if (elapsedInCycle < fadeInMs + lengthMs) {
        // Full color phase - no adjustment needed
    } else {
        // Fade out phase
        unsigned long fadeOutStart = fadeInMs + lengthMs;
        unsigned long fadeOutElapsed = elapsedInCycle - fadeOutStart;
        
        if (fadeOutMs > 0) {
            float fadeOutProgress = 1.0 - ((float)fadeOutElapsed / fadeOutMs);
            resultColor.value = baseColor.value * fadeOutProgress;
        }
    }
    
    return resultColor;
}