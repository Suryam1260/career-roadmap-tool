#!/bin/bash
cd frontend/public/personas

echo "=== EXTRACTING ALL VIDEO IDs FROM PERSONAS ==="
VIDEO_IDS=$(grep -rh "youtube\.com/embed/" . --include="*.json" | sed 's/.*embed\///' | sed 's/".*//' | grep -v '^\s*$' | sort -u)

echo "$VIDEO_IDS"
echo ""
echo "=== CHECKING AGAINST APPROVED CSV ==="

while IFS= read -r vid; do
  if [ -n "$vid" ]; then
    if grep -q "^$vid$" /tmp/approved_videos.txt; then
      echo "✓ $vid"
    else
      echo "✗ $vid (NOT IN CSV!)"
    fi
  fi
done <<< "$VIDEO_IDS"

echo ""
echo "=== SUMMARY ==="
TOTAL=$(echo "$VIDEO_IDS" | grep -v '^$' | wc -l | tr -d ' ')
APPROVED=$(echo "$VIDEO_IDS" | while read vid; do [ -n "$vid" ] && grep -q "^$vid$" /tmp/approved_videos.txt && echo "1"; done | wc -l | tr -d ' ')
echo "Total unique videos: $TOTAL"
echo "From approved CSV: $APPROVED"
