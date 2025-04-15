// WRAPPER to disable warnings for EasyLogger

#pragma GCC diagnostic push
# pragma GCC diagnostic ignored "-Wformat"
#ifdef endl
#undef endl
#endif
#include "EasyLogger.h"
#pragma GCC diagnostic pop
