#!/bin/bash

echo "================================================"
echo "COMPLETE VIDEO AUDIT - PERSONA FILES"
echo "================================================"
echo ""

# 1. Count all videoUrl fields
echo "1. COUNTING ALL videoUrl FIELDS:"
TOTAL_VIDEO_FIELDS=$(grep -r '"videoUrl"' . --include="*.json" | wc -l | tr -d ' ')
echo "   Total videoUrl fields found: $TOTAL_VIDEO_FIELDS"
echo ""

# 2. Count empty videoUrl fields
echo "2. CHECKING FOR EMPTY VIDEOS:"
EMPTY_COUNT=$(grep -r '"videoUrl": ""' . --include="*.json" | wc -l | tr -d ' ')
echo "   Empty videoUrl fields: $EMPTY_COUNT"
if [ $EMPTY_COUNT -gt 0 ]; then
  echo "   ⚠️  Files with empty videos:"
  grep -r '"videoUrl": ""' . --include="*.json" | cut -d: -f1 | sort -u | head -5
fi
echo ""

# 3. Check for placeholder text
echo "3. CHECKING FOR PLACEHOLDER TEXT:"
PLACEHOLDER_COUNT=$(grep -r '"videoUrl".*placeholder\|"videoUrl".*TODO\|"videoUrl".*example\|"videoUrl".*test' . --include="*.json" -i | wc -l | tr -d ' ')
echo "   Placeholder text found: $PLACEHOLDER_COUNT"
if [ $PLACEHOLDER_COUNT -gt 0 ]; then
  echo "   ⚠️  Placeholder videos:"
  grep -r '"videoUrl".*placeholder\|"videoUrl".*TODO\|"videoUrl".*example\|"videoUrl".*test' . --include="*.json" -i | head -3
fi
echo ""

# 4. Check for rickroll
echo "4. CHECKING FOR RICKROLL:"
RICKROLL_COUNT=$(grep -r 'dQw4w9WgXcQ' . --include="*.json" | wc -l | tr -d ' ')
echo "   Rickroll videos: $RICKROLL_COUNT"
echo ""

# 5. Count filled videoUrl fields (with actual YouTube URLs)
echo "5. COUNTING FILLED VIDEOS:"
FILLED_COUNT=$(grep -r '"videoUrl": "https://www.youtube.com/embed/' . --include="*.json" | wc -l | tr -d ' ')
echo "   Filled with YouTube URLs: $FILLED_COUNT"
echo ""

# 6. Check for non-YouTube video URLs
echo "6. CHECKING FOR NON-YOUTUBE URLS:"
NON_YOUTUBE=$(grep -r '"videoUrl": "http' . --include="*.json" | grep -v 'youtube.com' | grep -v '""' | wc -l | tr -d ' ')
echo "   Non-YouTube video URLs: $NON_YOUTUBE"
if [ $NON_YOUTUBE -gt 0 ]; then
  echo "   ⚠️  Non-YouTube URLs found:"
  grep -r '"videoUrl": "http' . --include="*.json" | grep -v 'youtube.com' | grep -v '""' | head -3
fi
echo ""

# 7. List all unique video IDs
echo "7. ALL UNIQUE VIDEO IDs IN USE:"
grep -rh '"videoUrl": "https://www.youtube.com/embed/' . --include="*.json" | sed 's/.*embed\///' | sed 's/".*//' | sort -u | nl
echo ""

# 8. Summary
echo "================================================"
echo "SUMMARY:"
echo "================================================"
echo "Total videoUrl fields:     $TOTAL_VIDEO_FIELDS"
echo "Filled with YouTube:       $FILLED_COUNT"
echo "Empty fields:              $EMPTY_COUNT"
echo "Placeholder text:          $PLACEHOLDER_COUNT"
echo "Rickroll videos:           $RICKROLL_COUNT"
echo "Non-YouTube URLs:          $NON_YOUTUBE"
echo ""

if [ $EMPTY_COUNT -eq 0 ] && [ $PLACEHOLDER_COUNT -eq 0 ] && [ $RICKROLL_COUNT -eq 0 ] && [ $NON_YOUTUBE -eq 0 ]; then
  echo "✅ STATUS: 100% CLEAN - All videos are from approved CSV!"
else
  echo "⚠️  STATUS: ISSUES FOUND - Some videos need attention"
fi
echo "================================================"
