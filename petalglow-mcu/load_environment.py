Import("env")

import os

dotenv = 'DOTENV' in os.environ and os.environ['DOTENV'] or ""

if(dotenv == ""):
    print("No dotenv environment variable set, reading from dotenv file")
    with open('.env') as f:
        dotenv = f.read()

if('CI' not in os.environ):
    print(f"DEBUG enabled.")
    env.Append(CPPDEFINES=[
        "MYDEBUG",
        # "DEBUG_ESP_HTTP_UPDATE",
        # "INFLUXDB_CLIENT_DEBUG_ENABLE",
        # ("CORE_DEBUG_LEVEL", 3),
        # "DEBUG_ESP_HTTP_CLIENT",
        # ("DEBUG_ESP_PORT", "Serial"),
    ])

version = os.environ.get("GITHUB_REF_NAME", "v0.0.1")[1:] # Remove leading "v"
print(f"Setting VERSION: {version}")
env.Append(CPPDEFINES=[("VERSION", env.StringifyMacro(version))])

for line in dotenv.splitlines():
    if line.startswith(';') or line.startswith('#') or not line.strip():
        continue
    key, value = line.strip().split('=', 1)
    print(f"Setting {key}: {value}")
    env.Append(CPPDEFINES=[
        (key, env.StringifyMacro(value)),
    ])

print("Loaded all.")
