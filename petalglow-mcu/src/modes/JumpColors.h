#pragma once

#include <vector>
#define ARDUINOJSON_USE_LONG_LONG 1
#include <ArduinoJson.h>
#include <FastLED.h>

#include "../ModeController.h"

class JumpColors : public ModeController {
  public:
    JumpColors(int nLeds, JsonObject params);
    bool populateLeds(struct CRGB *leds, uint8_t *stemBrightness) override;
  
  private:
    int nLeds;
    std::vector<CHSV> colors;
    uint8_t scale;           // Scale factor for timing in seconds
    uint8_t fadeInTime;      // Time to fade in (0-255)
    uint8_t fadeOutTime;     // Time to fade out (0-255)
    uint8_t lengthTime;      // Time to display full color (0-255)
    
    unsigned long lastUpdate;
    unsigned long cycleStartTime;
    int currentColorIndex;
    
    CHSV getCurrentColor(unsigned long elapsedInCycle, int colorIndex);
    uint8_t calculateStemBrightness(unsigned long elapsedInCycle);
};
