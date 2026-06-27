#!/bin/bash
# PostToolUse hook: Edit/Write sonrası guardrail ihlal taraması
# stdin'den JSON alır, dosyayı gerçek grep ile tarar
# exit 0 = devam (uyarılar stderr'e yazılır)
# Claude bu uyarıları görür ve düzeltme yapabilir

# stdin'den tool output JSON'ını oku
INPUT=$(cat)

# Dosya yolunu JSON'dan çıkar (file_path alanı)
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')

# Dosya yolu yoksa veya dosya mevcut değilse çık
if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# Sadece kaynak kod dosyalarını tara
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.css|*.scss)
    ;;
  *)
    exit 0
    ;;
esac

VIOLATIONS=""
VIOLATION_COUNT=0

# --- UNIVERSAL GUARDRAIL TARAMASI ---

# 1. Hardcoded hex renk (#xxx, #xxxxxx, #xxxxxxxx — CSS/style context'te)
HC_COLORS=$(grep -n '#[0-9a-fA-F]\{3,8\}\b' "$FILE_PATH" 2>/dev/null | grep -v '//' | grep -v '\*' | grep -v 'node_modules' | grep -v '.test.' | head -5)
if [ -n "$HC_COLORS" ]; then
  VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
  VIOLATIONS="${VIOLATIONS}\n[D-DSY] Hardcoded renk değeri tespit edildi — semantic token kullan:\n${HC_COLORS}\n"
fi

# 2. any type kullanımı
ANY_TYPE=$(grep -n ': any\b\|: any;' "$FILE_PATH" 2>/dev/null | grep -v '//' | grep -v '\*' | head -5)
if [ -n "$ANY_TYPE" ]; then
  VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
  VIOLATIONS="${VIOLATIONS}\n[UNIVERSAL] 'any' type tespit edildi — TypeScript strict mode zorunlu:\n${ANY_TYPE}\n"
fi

# 3. Hardcoded secret pattern'ler
SECRET=$(grep -n 'sk-[a-zA-Z0-9]\{20,\}\|AKIA[A-Z0-9]\{16\}\|password\s*=\s*["\x27][^"\x27]\+["\x27]\|api_key\s*=\s*["\x27][^"\x27]\+["\x27]\|secret\s*=\s*["\x27][^"\x27]\+["\x27]' "$FILE_PATH" 2>/dev/null | head -3)
if [ -n "$SECRET" ]; then
  VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
  VIOLATIONS="${VIOLATIONS}\n[D-SEC] KRITIK: Olası secret/credential tespit edildi — HEMEN KALDIR:\n${SECRET}\n"
fi

# 4. console.log ile PII riski
CONSOLE_PII=$(grep -n 'console\.log.*\(token\|password\|email\|user\|credential\|secret\|auth\)' "$FILE_PATH" 2>/dev/null | head -3)
if [ -n "$CONSOLE_PII" ]; then
  VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
  VIOLATIONS="${VIOLATIONS}\n[D-SEC] console.log ile hassas veri yazdırma riski:\n${CONSOLE_PII}\n"
fi

# 5. eslint-disable exception kaydı olmadan
ESLINT_DISABLE=$(grep -n 'eslint-disable\|@ts-ignore\|@ts-expect-error' "$FILE_PATH" 2>/dev/null | head -3)
if [ -n "$ESLINT_DISABLE" ]; then
  VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
  VIOLATIONS="${VIOLATIONS}\n[UNIVERSAL] eslint-disable/@ts-ignore tespit edildi — exception kaydı gerekli (44):\n${ESLINT_DISABLE}\n"
fi

# --- TSX/JSX SPESİFİK KONTROLLER ---
case "$FILE_PATH" in
  *.tsx|*.jsx)
    # 6. dangerouslySetInnerHTML — XSS riski
    XSS=$(grep -n 'dangerouslySetInnerHTML' "$FILE_PATH" 2>/dev/null | head -3)
    if [ -n "$XSS" ]; then
      VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
      VIOLATIONS="${VIOLATIONS}\n[D-SEC] dangerouslySetInnerHTML tespit edildi — XSS riski:\n${XSS}\n"
    fi

    # 7. localStorage/sessionStorage token saklama
    UNSAFE_STORAGE=$(grep -n 'localStorage\.\(set\|get\)Item.*\(token\|jwt\|auth\|session\)\|sessionStorage\.\(set\|get\)Item.*\(token\|jwt\|auth\|session\)' "$FILE_PATH" 2>/dev/null | head -3)
    if [ -n "$UNSAFE_STORAGE" ]; then
      VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
      VIOLATIONS="${VIOLATIONS}\n[D-SEC] localStorage/sessionStorage'da token saklama tespit edildi — HttpOnly cookie veya SecureStore kullan (ADR-010):\n${UNSAFE_STORAGE}\n"
    fi
    ;;
esac

# --- SONUÇ ---
if [ $VIOLATION_COUNT -gt 0 ]; then
  echo "" >&2
  echo "========================================" >&2
  echo " GUARDRAIL UYARI: ${VIOLATION_COUNT} ihlal tespit edildi" >&2
  echo " Dosya: ${FILE_PATH}" >&2
  echo "========================================" >&2
  echo -e "$VIOLATIONS" >&2
  echo "Düzelt veya exception kaydı aç (44-exception-and-exemption-policy.md)" >&2
  echo "========================================" >&2
fi

exit 0
