#!/bin/bash

SITE="https://googleai-site.vercel.app"

echo "================================="
echo " SEO + Visitor Tracking Report"
echo "================================="

echo ""
echo "[1] Website Status:"
curl -I -s "$SITE" | grep "HTTP"

echo ""
echo "[2] Robots.txt:"
curl -s "$SITE/robots.txt" | head -20

echo ""
echo "[3] Sitemap Check:"
curl -I -s "$SITE/sitemap.xml" | grep "HTTP"

echo ""
echo "[4] Page Title:"
curl -s "$SITE" | grep -o "<title>.*</title>" | head -1

echo ""
echo "[5] Meta Description:"
curl -s "$SITE" | grep -o 'name="description"[^>]*' | head -1

echo ""
echo "[6] Canonical URL:"
curl -s "$SITE" | grep -o 'rel="canonical"[^>]*' | head -1

echo ""
echo "[7] AdSense Check:"
curl -s "$SITE" | grep -o "ca-pub-[0-9]*" | head -1

echo ""
echo "[8] Google Index Signal:"
curl -s "https://www.google.com/search?q=site:googleai-site.vercel.app" \
| grep -o "googleai-site.vercel.app" | head -1

echo ""
echo "[9] Response Time:"
curl -o /dev/null -s -w "Time: %{time_total}s\n" "$SITE"

echo ""
echo "[10] Security Headers:"
curl -I -s "$SITE" | grep -E "strict|x-frame|x-content"

echo ""
echo "================================="
echo " SEO Check Complete"
echo "================================="
