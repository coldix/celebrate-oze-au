#!/usr/bin/env bash
# Bump the site version everywhere, in one shot.  Usage: ./bump-version.sh 2.1.2
#
# Semver vMAJOR.MINOR.MICRO. Version is pure semver; Date is a separate
# machine-maintained build date (date + time AEST). House standard:
# https://oze.au/docs/PLAYBOOK.md  (§2 header/footer, §4 this script)
#
# Updates in lockstep across html/css/js/README/deploy.sh:
#   - ?v= cache-busters in *.html
#   - VERSION constant in js/celebrate.js (source of truth)
#   - every "Version: X.Y.Z" header comment (any semver self-heals)
#   - every "Date:" header line -> today, date + time AEST
#   - footer build stamp <span class="build-stamp">vX.Y.Z · dd Mon yyyy</span>
set -euo pipefail

NEW="${1:-}"
[[ -z "$NEW" ]] && { echo "Usage: $0 <new-version>  e.g. $0 2.1.2" >&2; exit 1; }
[[ "$NEW" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "Version must be semver, e.g. 2.1.2" >&2; exit 1; }

cd "$(dirname "$0")"
OLD="$(sed -n "s/.*const VERSION = 'v\([0-9.]*\)'.*/\1/p" js/celebrate.js | head -1)"
[[ -z "$OLD" ]] && { echo "Could not detect current version in js/celebrate.js" >&2; exit 1; }
echo "Bumping v$OLD -> v$NEW"
OLD_RE="${OLD//./\\.}"

HTML=$(find . -name '*.html' -not -path './.git/*')
JS=$(find . -name '*.js' -not -path './.git/*')
CSS=$(find . -name '*.css' -not -path './.git/*')
ALL="$HTML $JS $CSS README.md deploy.sh"

DATE_FULL="$(TZ='Australia/Sydney' date '+%-d %b %Y | %-I:%M %p AEST')"
DATE_ONLY="$(TZ='Australia/Sydney' date '+%-d %b %Y')"

sed -i '' "s/?v=${OLD_RE}/?v=${NEW}/g" $HTML
sed -i '' "s/const VERSION = 'v${OLD_RE}'/const VERSION = 'v${NEW}'/" js/celebrate.js
sed -i '' -E "s/Version: [0-9]+\.[0-9]+\.[0-9]+/Version: ${NEW}/g" $ALL
sed -i '' -E "s/(Date: ).*/\1${DATE_FULL}/g" $ALL
sed -i '' -E "s#(<span class=\"build-stamp\">)[^<]*(</span>)#\1v${NEW} · ${DATE_ONLY}\2#g" $HTML

echo "Done. Remaining stale v$OLD references (should be none):"
grep -rn "v\{0,1\}${OLD_RE}\b" $ALL 2>/dev/null && echo "  ^ check above" >&2 || echo "  none — all at v$NEW"
