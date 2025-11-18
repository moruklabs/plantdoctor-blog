#!/bin/bash
#
# killport.sh - Kill processes listening on a specific port
#
# Usage: ./killport.sh <port_number>
# Example: ./killport.sh 3000
#
# This script is used by `pnpm dev` to ensure port 3000 is available before
# starting the Next.js development server. It prevents "port already in use" errors.
#
# Why bash? We use #!/bin/bash instead of #!/bin/sh because:
# - We use bash-specific syntax: [[ ]] (test command with additional features)
# - We use glob pattern matching: Linux* (not available in POSIX sh)
# - This ensures consistent behavior across macOS, Linux, and WSL
#
# Platform Support:
# - macOS (Darwin): Uses lsof to find processes
# - Linux/WSL: Uses lsof to find processes
# - Windows: Not supported (lsof not available)

# Detect operating system and only run on macOS or Linux
# [[ ]] is bash's enhanced test command (more robust than [ ])
# $(uname) returns OS name: "Darwin" for macOS, "Linux" for Linux/WSL
# Linux* is a glob pattern that matches any string starting with "Linux"
if [[ "$(uname)" == "Darwin" ]] || [[ "$(uname -s)" == Linux* ]]; then
    # Pipeline breakdown:
    # 1. lsof -i :$1
    #    List open files (lsof) for internet connections (-i) on port $1
    #    Output format:
    #    COMMAND   PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
    #    node      1234 user   21u  IPv4 0x1234  0t0      TCP *:3000 (LISTEN)
    #
    # 2. awk 'NR>1 {print $2}'
    #    Skip header row (NR>1 means "row Number > 1")
    #    Print column 2 ($2) which contains the PID
    #    Output: 1234
    #
    # 3. xargs kill -9
    #    Pass PIDs to kill command with SIGKILL (-9) signal
    #    SIGKILL forcefully terminates the process (cannot be caught/ignored)
    #
    # 4. 2>/dev/null
    #    Redirect stderr to /dev/null (suppress error messages)
    #    Prevents "No such process" errors if PID already terminated
    #
    # 5. || true
    #    Ensure script exits with success (0) even if kill fails
    #    This prevents the script from stopping `pnpm dev` if port is already free
    lsof -i :$1 | awk 'NR>1 {print $2}' | xargs kill -9 2>/dev/null || true
fi
