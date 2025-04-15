#pragma once

#include <vector>
#include <ArduinoJson.h>
#include <FastLed.h>

#include "../ModeController.h"

class FadeColors : public ModeController {
  public:
    FadeColors(int nLeds, JsonObject params);
    bool populateLeds(struct CRGB *leds, uint8_t *stemBrightness) override;
  
  private:
    int nLeds;
    std::vector<CHSV> colors;
    uint8_t speed;       // 0-255, controls transition speed
    uint8_t scale;       // Scale factor for max speed in seconds
    unsigned long lastUpdate;
    float position;      // Current position in the color transition (0.0 to colors.size())
    
    CHSV getInterpolatedColor(float position);
};