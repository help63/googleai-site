#!/bin/bash

SITE="https://googleai-site.vercel.app"

echo "================================="
echo " Website Check Report"
echo "================================="

echo ""
echo "[1] Website Status:"
curl -I -s "$SITE" | grep "HTTP"

echo ""
echo "[2] AdSense Publisher ID:"
curl -s "$SITE" | grep -o "ca-pub-[0-9]*" | head -1

echo ""
echo "[3] ads.txt Check:"
curl -s "$SITE/ads.txt"

echo ""
echo "[4] Response Time:"
curl -o /dev/null -s -w "Time: %{time_total}s\n" "$SITE"

echo ""
echo "[5] Google Index Signal:"
curl -s "https://www.google.com/search?q=site:googleai-site.vercel.app" \
| grep -o "googleai-site.vercel.app" | head -1

echo ""
echo "================================="
echo " Check Complete"
echo "================================="
