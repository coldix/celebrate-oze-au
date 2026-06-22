#!/usr/bin/env bash
# Bump the site version in every spot that matters, in one shot.
# Usage: ./bump-version.sh 1.13
#
# Updates (across root + every event folder):
#   - ?v= cache-busters on <link>/<script> in *.html   (e.g. ?v=1.12 -> ?v=1.13)
#   - VERSION constant in js/celebrate.js               (e.g. 'v1.12' -> 'v1.13')
#   - one-line headers "| vX.Y |" in css/js/html
#   - footer build stamps "file.ext vX.Y"
#   - "Version: X.Y" block headers (e.g. js/confetti.js)
#   - Date headers: ISO "YYYY-MM-DD AEST" one-liners AND "D Month YYYY" blocks
#
# Why a script: the cache-buster is written `?v=1.12` (with `=`), which a naive
# `s/v1.12/.../` pattern misses — that bug silently freezes deploys on the old,
# 1-year-immutable asset URL. Always bump here, then verify live (see PLAYBOOK §3).
set -euo pipefail

NEW="${1:-}"
if [[ -z "$NEW" ]]; then
  echo "Usage: $0 <new-version>   e.g. $0 1.13" >&2
  exit 1
fi
if [[ ! "$NEW" =~ ^[0-9]+\.[0-9]+(\.[0-9]+)?$ ]]; then
  echo "Version must look like 1.13 (or 1.13.0)" >&2
  exit 1
fi

cd "$(dirname "$0")"

# Current version from the VERSION constant (source of truth).
OLD="$(sed -n "s/.*const VERSION = 'v\([0-9.]*\)'.*/\1/p" js/celebrate.js | head -1)"
if [[ -z "$OLD" ]]; then
  echo "Could not detect current version in js/celebrate.js" >&2
  exit 1
fi
echo "Bumping v$OLD -> v$NEW"
OLD_RE="${OLD//./\\.}"

# Touch every source file in root + event folders.
HTML=$(find . -name '*.html' -not -path './legal/*' -not -path './.git/*')
ASSETS=$(find . \( -name '*.css' -o -name '*.js' \) -not -path './.git/*')
ALL="$HTML $ASSETS"

# ?v= cache-busters in HTML  (the `=` is why naive bumps failed)
sed -i '' "s/?v=${OLD_RE}/?v=${NEW}/g" $HTML

# VERSION constant
sed -i '' "s/const VERSION = 'v${OLD_RE}'/const VERSION = 'v${NEW}'/" js/celebrate.js

# one-line "| vX.Y |" headers + footer "file vX.Y" stamps — match ANY version so
# stale per-file headers self-heal onto the unified number.
sed -i '' -E "s/(\| v)[0-9]+\.[0-9]+(\.[0-9]+)?( \|)/\1${NEW}\3/g" $ALL
sed -i '' -E "s/((\.html|\.css|\.js) v)[0-9]+\.[0-9]+(\.[0-9]+)?/\1${NEW}/g" $ALL

# "Version: X.Y" block headers
sed -i '' -E "s/Version: [0-9]+\.[0-9]+(\.[0-9]+)?/Version: ${NEW}/g" $ALL

# Dates — ISO one-liners and long-form block headers, both set to today (AEST).
TODAY_ISO="$(TZ='Australia/Sydney' date '+%Y-%m-%d')"
TODAY_LONG="$(TZ='Australia/Sydney' date '+%-d %B %Y')"
sed -i '' -E "s/[0-9]{4}-[0-9]{2}-[0-9]{2} AEST/${TODAY_ISO} AEST/g" $ALL
sed -i '' -E "s/Date: [0-9]+ [A-Za-z]+ [0-9]{4}/Date: ${TODAY_LONG}/g" $ALL

echo "Done. Remaining stale v$OLD references (should be none):"
if grep -rn "v${OLD_RE}\b" $ALL 2>/dev/null; then
  echo "  ^ check the above" >&2
else
  echo "  none — all at v$NEW"
fi
