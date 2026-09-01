#!/bin/bash

SITE="https://googleai-site.vercel.app"

echo "================================="
echo " Admin Full Status Report"
echo "================================="

echo ""
echo "[1] Website Status:"
curl -I -s "$SITE" | grep "HTTP"

echo ""
echo "[2] Admin Page Status:"
curl -I -s "$SITE/admin" | grep "HTTP"

echo ""
echo "[3] Admin Login API Route:"
curl -I -s "$SITE/api/admin/login" | grep "HTTP"

echo ""
echo "[4] Local Login File:"
if [ -f "app/api/admin/login/route.js" ]; then
  echo "route.js exists ✅"
else
  echo "route.js missing ❌"
fi

echo ""
echo "[5] Environment Names Used:"
grep -E "ADMIN_USER|ADMIN_PASSWORD|ADMIN_SECRET" app/api/admin/login/route.js

echo ""
echo "[6] Response Time:"
curl -o /dev/null -s -w "Time: %{time_total}s\n" "$SITE/admin"

echo ""
echo "================================="
echo " Admin Check Complete"
echo "================================="
