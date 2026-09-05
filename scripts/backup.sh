#!/bin/bash

DATE=$(date +"%Y-%m-%d-%H-%M")
NAME="googleai-backup-$DATE.tar.gz"

tar -czf "$NAME" \
app \
lib \
data \
public \
package.json \
next.config.mjs

echo "✅ Backup created: $NAME"
