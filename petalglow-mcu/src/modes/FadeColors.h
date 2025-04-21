#pragma once

#include <vector>
#define ARDUINOJSON_USE_LONG_LONG 1
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
    uint64_t start;
    uint16_t speedMs;     // milliseconds to shift one color
    bool set = false;
    
    CHSV getInterpolatedColor(float position);
};