#pragma once

#include <Arduino.h>

namespace utils {
    float get_temp_stats();
    void print_temp_stats();
    uint64_t get_time_ms();
    void blink(uint8_t r, uint8_t g, uint8_t b);
    void blink(uint32_t time, uint8_t r, uint8_t g, uint8_t b);
    void print_command(uint8_t* data, size_t data_length);
    const char* concat(const char* s1, const char* s2);
    const char* concat(const char* s1, const char* s2, const char* s3);
}
