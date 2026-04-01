#!/bin/bash
# PreToolUse hook: Edit/Write öncesi guardrail bağlam tespiti
# stdin'den JSON alır, dosya yoluna göre aktif guardrail'leri belirler
# exit 0 = devam (uyarı stderr'e)
# exit 2 = BLOKLA (kritik risk durumunda)

INPUT=$(cat)

# Dosya yolunu JSON'dan çıkar
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# --- KRİTİK: .env, credential, secret dosyalarına yazma GİRİŞİMİNİ BLOKLA ---
case "$FILE_PATH" in
  *.env|*.env.*|*.pem|*.key|*.keystore|*credentials*|*secret*)
    echo "BLOK: Hassas dosya düzenleme girişimi engellendi: ${FILE_PATH}" >&2
    echo ".env, credential ve secret dosyaları AI tarafından düzenlenemez (.claudeignore)" >&2
    exit 2
    ;;
esac

GUARDRAILS=""

# --- DOSYA BAĞLAMINA GÖRE AKTİF GUARDRAIL TESPİTİ ---
case "$FILE_PATH" in
  *.tsx|*.jsx)
    GUARDRAILS="D-UIX (HIG/UX), D-DSY (Design System), D-A11 (Accessibility)"
    # Firebase bağlamı kontrolü
    if echo "$FILE_PATH" | grep -qi 'firebase\|firestore'; then
      GUARDRAILS="${GUARDRAILS}, D-FIR (Firebase), D-SEC (Security)"
    fi
    # Form bağlamı kontrolü
    if echo "$FILE_PATH" | grep -qi 'form\|input\|field\|validation'; then
      GUARDRAILS="${GUARDRAILS}, D-FRM (Forms)"
    fi
    # Navigation bağlamı kontrolü
    if echo "$FILE_PATH" | grep -qi 'route\|navigation\|screen\|page'; then
      GUARDRAILS="${GUARDRAILS}, D-NAV (Navigation)"
    fi
    # State bağlamı kontrolü
    if echo "$FILE_PATH" | grep -qi 'store\|slice\|state\|zustand'; then
      GUARDRAILS="${GUARDRAILS}, D-STA (State)"
    fi
    ;;
  *.ts)
    # TypeScript dosyası — bağlam kontrol
    if echo "$FILE_PATH" | grep -qi 'firebase\|firestore'; then
      GUARDRAILS="D-FIR (Firebase), D-SEC (Security), D-DAT (Data)"
    elif echo "$FILE_PATH" | grep -qi 'schema\|validation\|zod'; then
      GUARDRAILS="D-FRM (Forms)"
    elif echo "$FILE_PATH" | grep -qi 'store\|slice\|zustand'; then
      GUARDRAILS="D-STA (State)"
    elif echo "$FILE_PATH" | grep -qi 'route\|navigation'; then
      GUARDRAILS="D-NAV (Navigation)"
    elif echo "$FILE_PATH" | grep -qi 'auth\|session\|token'; then
      GUARDRAILS="D-SEC (Security)"
    elif echo "$FILE_PATH" | grep -qi 'hook\|use[A-Z]'; then
      GUARDRAILS="D-TST (Testing — birim testi zorunlu)"
    elif echo "$FILE_PATH" | grep -qi 'api\|fetch\|query\|mutation'; then
      GUARDRAILS="D-DAT (Data), D-SEC (Security), D-TST (Testing)"
    elif echo "$FILE_PATH" | grep -qi 'analytics\|tracking\|event'; then
      GUARDRAILS="D-OBS (Observability), D-SEC (PII koruması)"
    else
      GUARDRAILS="Universal kurallar"
    fi
    ;;
  *.css|*.scss|*.style.*)
    GUARDRAILS="D-STY (Styling), D-DSY (Design System — semantic token zorunlu)"
    ;;
  *.test.ts|*.test.tsx|*.spec.ts|*.spec.tsx)
    GUARDRAILS="D-TST (Testing)"
    ;;
  *.yml|*.yaml)
    if echo "$FILE_PATH" | grep -qi 'ci\|workflow\|pipeline'; then
      GUARDRAILS="A-CONFIG — CI pipeline değişikliği, kırılma riski değerlendir"
    fi
    ;;
  firestore.rules|storage.rules)
    GUARDRAILS="D-FIR (Firebase), D-SEC (Security) — default deny zorunlu!"
    ;;
esac

# Platform bağlamı
case "$FILE_PATH" in
  */apps/mobile/*|*/apps/native/*)
    GUARDRAILS="${GUARDRAILS:+${GUARDRAILS}, }D-PLT (Mobile), D-UIX (HIG — Apple HIG zorunlu)"
    ;;
  */apps/web/*)
    GUARDRAILS="${GUARDRAILS:+${GUARDRAILS}, }D-PLT (Web)"
    ;;
  */packages/*)
    GUARDRAILS="${GUARDRAILS:+${GUARDRAILS}} [Shared kod — import yönü ve boundary kontrolü kritik]"
    ;;
esac

if [ -n "$GUARDRAILS" ]; then
  echo "" >&2
  echo "--- GUARDRAIL: ${GUARDRAILS} ---" >&2
  echo "Dosya: ${FILE_PATH}" >&2
  echo "Universal: hardcoded deger YASAK, any YASAK, inline string YASAK" >&2
  echo "---" >&2
fi

exit 0
