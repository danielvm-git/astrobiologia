#!/bin/bash
# verify-appwrite-json.sh

FILE="appwrite.json"

if [ ! -f "$FILE" ]; then
    echo "Error: $FILE does not exist."
    exit 1
fi

# Check for specific placeholders
if ! grep -q "PROJECT_ID" "$FILE"; then
    echo "Error: PROJECT_ID placeholder missing in $FILE"
    exit 1
fi

if ! grep -q "SITE_ID" "$FILE"; then
    echo "Error: SITE_ID placeholder missing in $FILE"
    exit 1
fi

echo "Success: $FILE exists and contains placeholders."
exit 0
