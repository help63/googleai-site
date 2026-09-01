#!/bin/bash

SITE="https://googleai-site.vercel.app"

echo "=============================="
echo " Admin Login API Check"
echo "=============================="

echo ""
echo "[1] Admin Page Status:"
curl -I -s "$SITE/admin" | grep "HTTP"

echo ""
echo "[2] Login API Status:"
curl -I -s "$SITE/api/admin/login" | grep "HTTP"

echo ""
echo "[3] Login Route File:"
if [ -f "app/api/admin/login/route.js" ]; then
  echo "route.js exists ✅"
else
  echo "route.js missing ❌"
fi

echo ""
echo "[4] Required Variables Used:"
grep -E "ADMIN_USER|ADMIN_PASSWORD|ADMIN_SECRET" app/api/admin/login/route.js

echo ""
echo "=============================="
echo " Check Complete"
echo "=============================="
