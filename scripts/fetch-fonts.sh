#!/usr/bin/env bash
# Vuelve a bajar Source Serif 4 desde Google Fonts y la deja en public/fonts.
# Solo hace falta si se quiere actualizar la version de la fuente; el sitio
# no depende de esto en tiempo de build ni de carga.
set -euo pipefail
cd "$(dirname "$0")/.."

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
API="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap"

tmp=$(mktemp)
curl -sS -A "$UA" "$API" -o "$tmp"

# Del CSS solo interesan los bloques del subconjunto latin.
upright=$(grep -A6 '/\* latin \*/' "$tmp" | grep -B2 'font-style: normal' | grep -o 'https://[^)]*\.woff2' | head -1)
italic=$(grep -A6 '/\* latin \*/' "$tmp" | grep -B2 'font-style: italic' | grep -o 'https://[^)]*\.woff2' | head -1)

curl -sS "$upright" -o public/fonts/source-serif-4-upright.woff2
curl -sS "$italic"  -o public/fonts/source-serif-4-italic.woff2
rm -f "$tmp"

echo "Fuentes actualizadas en public/fonts (src/styles/fuentes.css no cambia)."
ls -lh public/fonts
