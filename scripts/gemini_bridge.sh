#!/bin/bash

# gemini_bridge.sh - Safe non-interactive bridge for Antigravity sub-agents
# Usage: ./gemini_bridge.sh "The prompt for Gemini"

PROMPT="$1"

if [ -z "$PROMPT" ]; then
    echo "Error: No prompt provided."
    exit 1
fi

# Check if gemini is installed locally
LOCAL_GEMINI="./node_modules/.bin/gemini"
if [ -f "$LOCAL_GEMINI" ]; then
    "$LOCAL_GEMINI" "$PROMPT"
elif command -v gemini &> /dev/null; then
    gemini "$PROMPT"
else
    # Fallback to npx
    npx -y @google/gemini-cli "$PROMPT"
fi
