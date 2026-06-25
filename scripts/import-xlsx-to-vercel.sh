#!/bin/bash
# Usage: ./scripts/import-xlsx-to-vercel.sh https://seu-projeto.vercel.app
# Imports all 8950 providers from providers-xlsx.json via the /api/import/xlsx endpoint

BASE_URL="${1:-https://cloud-ten-chi.vercel.app}"
JSON_FILE="src/data/providers-xlsx.json"
BATCH_SIZE=500

echo "Importing to: $BASE_URL"
echo "Reading: $JSON_FILE"

python3 -c "
import json, urllib.request, urllib.parse, math, sys

base_url = '$BASE_URL'
batch_size = $BATCH_SIZE

with open('$JSON_FILE') as f:
    providers = json.load(f)

total = len(providers)
batches = math.ceil(total / batch_size)
print(f'Total: {total} providers in {batches} batches of {batch_size}')

total_imported = 0
total_skipped = 0

for i in range(batches):
    batch = providers[i*batch_size:(i+1)*batch_size]
    payload = json.dumps({'providers': batch}).encode('utf-8')
    req = urllib.request.Request(
        f'{base_url}/api/import/xlsx',
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read())
            total_imported += result.get('imported', 0)
            total_skipped += result.get('skipped', 0)
            print(f'Batch {i+1}/{batches}: {result.get(\"imported\",0)} imported, {result.get(\"skipped\",0)} skipped')
    except Exception as e:
        print(f'Batch {i+1}/{batches}: ERROR - {e}')

print(f'\n✓ TOTAL: {total_imported} importados, {total_skipped} ignorados')
"
