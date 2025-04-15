#include <Arduino.h>
#include <esp_err.h>
#include <esp_pm.h>
#include <Logger.h>
#include <Timer.h>

#include "AppManager.cpp"

#define RGB_BRIGHTNESS 20
#define RGB_BUILTIN 21

#define APP_NAME "PetalGlow"
#undef MODULE_NAME
#define MODULE_NAME "PtlGlw"

constexpr int temperature_logging_interval = 30*1000L; // 30 seconds

void print_startup_info() {
    LOG_INFO(MODULE_NAME, "Starting setup");
    LOG_INFO(MODULE_NAME, "CPU Freq = " << getCpuFrequencyMhz() << " MHz");
}

Timer timer;
AppManager appManager(timer, APP_NAME);

void setup() {
    Serial.begin(115200);
    while(!Serial); // Wait for serial to be available
    Serial.println("Starting");

    setCpuFrequencyMhz(80);
    print_startup_info();

    timer.every(temperature_logging_interval, utils::print_temp_stats);

    appManager.setup();
    LOG_INFO(MODULE_NAME, "Finished setup.");
}

void loop() {
    timer.update();
    appManager.loop();
}
