#!/bin/bash
# verify-ci-yaml.sh

FILE=".github/workflows/ci.yml"

if grep -q "check-config" "$FILE"; then
    echo "Error: 'check-config' step still exists in $FILE"
    exit 1
fi

if ! grep -q "\-\-force" "$FILE"; then
    echo "Error: '--force' flag missing in $FILE"
    exit 1
fi

if ! grep -q "sed -i" "$FILE"; then
    echo "Error: 'sed -i' (config generation) missing in $FILE"
    exit 1
fi

echo "Success: ci.yml refactored for non-interactive deployment."
exit 0
