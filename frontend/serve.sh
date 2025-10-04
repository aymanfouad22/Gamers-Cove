#!/bin/bash

echo "🎮 Starting Gamers Cove Frontend..."
echo ""
echo "Frontend will be available at: http://localhost:8000"
echo "Make sure backend is running on: http://localhost:8081"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m http.server 8000
else
    echo "❌ Python not found. Please install Python or use another method to serve files."
    exit 1
fi
