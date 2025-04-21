#include <Arduino.h>    
#include <Logger.h>
#include <time.h>

// Hack to detect if temperature sensor is supported
#ifdef TSENS_ADC_FACTOR
    #include <driver/temp_sensor.h>
#endif

#include "utils.h"

#undef MODULE_NAME
#define MODULE_NAME "Utils "

uint64_t utils::get_time_ms() {
    struct timeval tv_now;
    gettimeofday(&tv_now, NULL);
    return (uint64_t)tv_now.tv_sec * 1000L + (uint64_t)tv_now.tv_usec / 1000L;
};

float utils::get_temp_stats() {
    return temperatureRead();
}

void utils::print_temp_stats() {
    float result = get_temp_stats();
    LOG_INFO(MODULE_NAME, "Temperature: " << result << " °C");
}

void utils::blink(uint8_t r, uint8_t g, uint8_t b) {
    blink(500, r, g, b);
}

void utils::blink(uint32_t time, uint8_t r, uint8_t g, uint8_t b) {
    #ifdef RGB_BUILTIN
        neopixelWrite(RGB_BUILTIN, r, g, b);
        delay(time);
        neopixelWrite(RGB_BUILTIN, 0, 0, 0);
    #endif
}

void utils::print_command(uint8_t* data, size_t data_length) {
    Serial.print("Received data: mode ");
    Serial.print(data[0]);
    Serial.print(" #");
    for(int i = 1; i < 4; i++) {
        if (data[i] < 16) {Serial.print("0");}
        Serial.print(data[i], HEX);
    };
    Serial.print(" -> [");
    Serial.print(data_length - 3);
    Serial.print("]");
    for(int i = 4; i < data_length; i++) {
        Serial.print(data[i]);
    };
    Serial.println("");
}

// IMPORTANT: need to allocate memory for the array
const char* utils::concat(const char* s1, const char* s2) {
    std::string s = std::string(s1) + s2;
    char* cstr = new char[s.length()+1];
    strcpy(cstr, s.c_str());
    return cstr;
}

const char* utils::concat(const char* s1, const char* s2, const char* s3) {
    std::string s = std::string(s1) + s2 + s3;
    char* cstr = new char[s.length() + 1];
    strcpy(cstr, s.c_str());
    return cstr;
}