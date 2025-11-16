#!/bin/bash

# Post-build script to add proper PWA meta tags to index.html

HTML_FILE="dist/index.html"

# Check if dist/index.html exists
if [ ! -f "$HTML_FILE" ]; then
  echo "Error: $HTML_FILE not found"
  exit 1
fi

# Add PWA meta tags after the existing meta tags
sed -i.bak '/<meta name="theme-color"/a\
  <link rel="manifest" href="/manifest.json" />\
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />\
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />\
  <meta name="apple-mobile-web-app-capable" content="yes" />\
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />\
  <meta name="apple-mobile-web-app-title" content="Apollo" />\
  <meta name="application-name" content="Apollo" />\
  <meta name="msapplication-TileColor" content="#2f2f2f" />
' "$HTML_FILE"

# Copy public assets to dist
cp public/*.png dist/ 2>/dev/null || true
cp public/*.json dist/ 2>/dev/null || true

echo "✓ PWA meta tags added to $HTML_FILE"
echo "✓ Public assets copied to dist/"
