#!/bin/bash
# block-prebuild.sh — expo prebuild komutunu engeller
# ios/ ve android/ native konfigurasyon dosyalarini korur
#
# Exit code 0 = izin ver
# Exit code 2 = komut engelle

# stdin'den JSON oku
INPUT=$(cat 2>/dev/null || echo "{}")

# Komutu cikart (command alani)
COMMAND=$(echo "$INPUT" | grep -o '"command":"[^"]*"' 2>/dev/null | head -1 | cut -d'"' -f4 2>/dev/null)

# Bos ise alternatif alan dene
if [ -z "$COMMAND" ]; then
  COMMAND=$(echo "$INPUT" | grep -o '"input":"[^"]*"' 2>/dev/null | head -1 | cut -d'"' -f4 2>/dev/null)
fi

# Komut bos ise izin ver
if [ -z "$COMMAND" ]; then
  exit 0
fi

# prebuild komutu var mi kontrol et
if echo "$COMMAND" | grep -qi "prebuild" 2>/dev/null; then
  echo '{"reason":"expo prebuild komutu engellendi. Native konfigurasyon dosyalari (ios/, android/) korunmalidir. Prebuild yerine EAS Build veya expo start kullanin."}'
  exit 2
fi

exit 0
