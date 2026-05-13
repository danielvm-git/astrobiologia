#!/bin/bash
# verify-deployment-docs.sh

FILE="DEPLOYMENT.md"

if ! grep -q "Already built in GHA" "$FILE"; then
    echo "Error: 'Already built in GHA' missing in $FILE"
    exit 1
fi

if ! grep -q "Disconnect Git integration" "$FILE"; then
    echo "Error: 'Disconnect Git integration' missing in $FILE"
    exit 1
fi

echo "Success: DEPLOYMENT.md contains new instructions."
exit 0
