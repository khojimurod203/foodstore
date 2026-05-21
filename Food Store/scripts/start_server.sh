#!/usr/bin/env bash
# Simple script to serve the project over HTTP on port 8000
cd "$(dirname "$0")/.." || exit 1
python3 -m http.server 8000
