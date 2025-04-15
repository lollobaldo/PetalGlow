#pragma once

class ModeController {
  public:
    virtual inline ~ModeController() = default;
    virtual bool populateLeds(struct CRGB *leds, uint8_t *stemBrightness) = 0;

  protected:
    uint8_t stemBrightness = 128; // Default to 50% brightness
};
