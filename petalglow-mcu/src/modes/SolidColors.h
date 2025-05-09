#pragma once

#define ARDUINOJSON_USE_LONG_LONG 1
#include <ArduinoJson.h>
#include <FastLed.h>

#include "./ModeController.h"

class SolidColors : public ModeController {
  public:
  SolidColors(int nLeds, JsonObject params);
        bool populateLeds(struct CRGB *leds, uint8_t *stemBrightness) override;
  private:
    bool isInit = false;
    std::vector<CHSV> colors;
};
