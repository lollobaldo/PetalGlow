#pragma once

#include <vector>
#include <ArduinoJson.h>
#include <FastLed.h>

#include "../ModeController.h"

class FadeColors : public ModeController {
  public:
    FadeColors(int nLeds, JsonObject params);
    bool populateLeds(struct CRGB *leds, uint8_t *stemBrightness) override;
  
  // Add these private variables to your class definition:
  private:
    int nLeds;
    std::vector<CHSV> colors;
    uint8_t speed;       // 0-255, controls transition speed
    uint8_t scale;       // Scale factor for max speed in seconds
    unsigned long lastUpdate;
    float position;      // Current position in the color transition (0.0 to colors.size())
    float smoothingFactor;  // Controls how much smoothing to apply (0.0-1.0)
    float lastStemBrightness;  // Stores the last calculated brightness for smoothing
    
    CHSV getInterpolatedColor(float position);
};