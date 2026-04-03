#!/bin/bash
# create-project.sh
# Boilerplate'ten yeni proje turetme araci.
#
# Bu script, boilerplate reposunu klonladiktan sonra calistirilir.
# Tum yapilandirma dosyalarindaki boilerplate referanslarini
# proje-ozel degerlerle degistirir.
#
# Kullanim:
#   ./tooling/derive/create-project.sh \
#     --name "myapp" \
#     --scope "@myapp" \
#     --display-name "My App" \
#     --bundle-id "com.myorg.myapp" \
#     --domain "myapp.com"
#
# Opsiyonel:
#   --description "Proje aciklamasi"
#   --upstream-url "https://github.com/org/boilerplate.git"
#   --skip-install    # pnpm install atla
#   --skip-verify     # dogrulama atla
#
# Referans: docs/implementation/43-derived-project-creation-guide.md

set -euo pipefail

# --- Renkli cikti ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
ok()      { echo -e "${GREEN}[OK]${NC} $1"; }
warn()    { echo -e "${YELLOW}[UYARI]${NC} $1"; }
error()   { echo -e "${RED}[HATA]${NC} $1"; }
step()    { echo -e "\n${CYAN}${BOLD}=== $1 ===${NC}"; }

# --- Parametreleri parse et ---
NAME=""
SCOPE=""
DISPLAY_NAME=""
BUNDLE_ID=""
DOMAIN=""
DESCRIPTION=""
UPSTREAM_URL=""
SKIP_INSTALL=false
SKIP_VERIFY=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --name)          NAME="$2"; shift 2 ;;
    --scope)         SCOPE="$2"; shift 2 ;;
    --display-name)  DISPLAY_NAME="$2"; shift 2 ;;
    --bundle-id)     BUNDLE_ID="$2"; shift 2 ;;
    --domain)        DOMAIN="$2"; shift 2 ;;
    --description)   DESCRIPTION="$2"; shift 2 ;;
    --upstream-url)  UPSTREAM_URL="$2"; shift 2 ;;
    --skip-install)  SKIP_INSTALL=true; shift ;;
    --skip-verify)   SKIP_VERIFY=true; shift ;;
    -h|--help)
      echo "Kullanim: $0 --name <ad> --scope <@scope> --display-name <Ad> --bundle-id <com.org.app> --domain <app.com>"
      echo ""
      echo "Zorunlu parametreler:"
      echo "  --name          Proje slug'i (kucuk harf, tire, alt cizgi)  orn: myapp"
      echo "  --scope         npm scope                                   orn: @myapp"
      echo "  --display-name  Insan-okur proje adi                        orn: My App"
      echo "  --bundle-id     iOS/Android bundle identifier               orn: com.myorg.myapp"
      echo "  --domain        Deep link ve Universal Links domain'i       orn: myapp.com"
      echo ""
      echo "Opsiyonel parametreler:"
      echo "  --description   Proje aciklamasi"
      echo "  --upstream-url  Boilerplate repo URL (upstream remote icin)"
      echo "  --skip-install  pnpm install adimini atla"
      echo "  --skip-verify   Dogrulama adimini atla"
      exit 0
      ;;
    *)
      error "Bilinmeyen parametre: $1"
      echo "Yardim icin: $0 --help"
      exit 1
      ;;
  esac
done

# --- Zorunlu parametre kontrolu ---
MISSING=""
[ -z "$NAME" ]         && MISSING="$MISSING --name"
[ -z "$SCOPE" ]        && MISSING="$MISSING --scope"
[ -z "$DISPLAY_NAME" ] && MISSING="$MISSING --display-name"
[ -z "$BUNDLE_ID" ]    && MISSING="$MISSING --bundle-id"
[ -z "$DOMAIN" ]       && MISSING="$MISSING --domain"

if [ -n "$MISSING" ]; then
  error "Eksik zorunlu parametreler:$MISSING"
  echo "Yardim icin: $0 --help"
  exit 1
fi

# Scope'tan @ isareti varsa temizle (iç kullanım icin)
SCOPE_CLEAN="${SCOPE#@}"

# --- On kosul kontrolleri ---
step "On Kosul Kontrolleri"

# jq kontrolu
if ! command -v jq &>/dev/null; then
  error "jq bulunamadi. Kurulum:"
  echo "  macOS:  brew install jq"
  echo "  Linux:  sudo apt install jq"
  exit 1
fi
ok "jq mevcut"

# Proje kokunde miyiz?
if [ ! -f "package.json" ] || [ ! -f "pnpm-workspace.yaml" ]; then
  error "Bu script proje kok dizininde calistirilmalidir."
  exit 1
fi
ok "Proje kok dizininde"

# Zaten turetilmis mi kontrol et
if [ -f "BOUNDARY.md" ]; then
  warn "BOUNDARY.md zaten mevcut. Bu proje daha once turetilmis olabilir."
  read -p "Devam etmek istiyor musunuz? (e/h): " -n 1 -r
  echo
  [[ ! $REPLY =~ ^[Ee]$ ]] && exit 0
fi

# --- Ozet ---
echo ""
info "========================================="
info "  PROJE TURETME BASLIYOR"
info "========================================="
echo ""
info "Proje adi:    $NAME"
info "Scope:        $SCOPE"
info "Display name: $DISPLAY_NAME"
info "Bundle ID:    $BUNDLE_ID"
info "Domain:       $DOMAIN"
[ -n "$DESCRIPTION" ] && info "Aciklama:     $DESCRIPTION"
echo ""

# --- FAZ 1: Kimlik Donusumu ---
step "FAZ 1: Kimlik Donusumu"

# 1.1 — Tum package.json dosyalarinda scope rename
info "package.json dosyalarinda scope degistiriliyor..."

find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/.git/*" | while read -r f; do
  # name alaninda @project -> @{scope}
  jq --arg scope "$SCOPE_CLEAN" '
    if .name then .name |= gsub("@project/"; "@\($scope)/") | .name |= gsub("^boilerplate$"; $scope) else . end |
    if .dependencies then .dependencies |= with_entries(
      if .key | startswith("@project/") then .key = ("@" + $scope + "/" + (.key | ltrimstr("@project/"))) else . end
    ) else . end |
    if .devDependencies then .devDependencies |= with_entries(
      if .key | startswith("@project/") then .key = ("@" + $scope + "/" + (.key | ltrimstr("@project/"))) else . end
    ) else . end |
    if .peerDependencies then .peerDependencies |= with_entries(
      if .key | startswith("@project/") then .key = ("@" + $scope + "/" + (.key | ltrimstr("@project/"))) else . end
    ) else . end
  ' "$f" > "${f}.tmp" && mv "${f}.tmp" "$f"
  ok "  $f"
done

# 1.2 — Kok package.json'da name degistir
info "Kok package.json name alani guncelleniyor..."
jq --arg name "$NAME" '.name = $name' package.json > package.json.tmp && mv package.json.tmp package.json
ok "  package.json name → $NAME"

# 1.3 — Kaynak koddaki import referanslarini guncelle
info "Kaynak kodda @project/ import referanslari guncelleniyor..."
IMPORT_COUNT=0
while IFS= read -r f; do
  if grep -q "@project/" "$f" 2>/dev/null; then
    sed -i.bak "s|@project/|@${SCOPE_CLEAN}/|g" "$f"
    rm -f "${f}.bak"
    ((IMPORT_COUNT++)) || true
  fi
done < <(find apps packages -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -not -path "*/node_modules/*" 2>/dev/null)
ok "  $IMPORT_COUNT dosyada import referansi guncellendi"

# --- FAZ 2: Platform Yapilandirmasi ---
step "FAZ 2: Platform Yapilandirmasi"

# 2.1 — app.json
info "apps/mobile/app.json guncelleniyor..."
if [ -f "apps/mobile/app.json" ]; then
  jq --arg name "$DISPLAY_NAME" \
     --arg slug "$NAME" \
     --arg scheme "$NAME" \
     --arg bundleId "$BUNDLE_ID" \
     --arg domain "$DOMAIN" \
     '
     .expo.name = $name |
     .expo.slug = $slug |
     .expo.scheme = $scheme |
     .expo.ios.bundleIdentifier = $bundleId |
     .expo.ios.associatedDomains = ["applinks:" + $domain] |
     .expo.android.package = $bundleId |
     .expo.android.intentFilters[0].data[0].host = $domain |
     .expo.android.intentFilters[0].data[1].host = $domain
     ' apps/mobile/app.json > apps/mobile/app.json.tmp && mv apps/mobile/app.json.tmp apps/mobile/app.json
  ok "  app.json guncellendi"
fi

# 2.2 — index.html
info "apps/web/index.html guncelleniyor..."
if [ -f "apps/web/index.html" ]; then
  sed -i.bak "s|<title>Boilerplate</title>|<title>${DISPLAY_NAME}</title>|g" apps/web/index.html
  rm -f apps/web/index.html.bak
  ok "  index.html title → $DISPLAY_NAME"
fi

# 2.3 — .env.example
info ".env.example guncelleniyor..."
if [ -f ".env.example" ]; then
  sed -i.bak "s|VITE_APP_NAME=Boilerplate|VITE_APP_NAME=${DISPLAY_NAME}|g" .env.example
  rm -f .env.example.bak
  ok "  .env.example VITE_APP_NAME → $DISPLAY_NAME"
fi

# 2.4 — MoAI project.yaml
info ".moai/config/sections/project.yaml guncelleniyor..."
if [ -f ".moai/config/sections/project.yaml" ]; then
  sed -i.bak "s|name: \"boilerplate\"|name: \"${NAME}\"|g" .moai/config/sections/project.yaml
  if [ -n "$DESCRIPTION" ]; then
    sed -i.bak "s|description: \"\"|description: \"${DESCRIPTION}\"|g" .moai/config/sections/project.yaml
  fi
  rm -f .moai/config/sections/project.yaml.bak
  ok "  project.yaml guncellendi"
fi

# 2.5 — CI workflow'larinda scope guncelle
info "CI workflow'larinda scope guncelleniyor..."
for wf in .github/workflows/*.yml; do
  if [ -f "$wf" ] && grep -q "@project/" "$wf" 2>/dev/null; then
    sed -i.bak "s|@project/|@${SCOPE_CLEAN}/|g" "$wf"
    rm -f "${wf}.bak"
    ok "  $wf"
  fi
done

# CI yorum satirlarindaki "Boilerplate" referanslarini guncelle
for wf in .github/workflows/*.yml; do
  if [ -f "$wf" ]; then
    sed -i.bak "s|Boilerplate Quality Gates|${DISPLAY_NAME} Quality Gates|g" "$wf"
    sed -i.bak "s|Boilerplate Release|${DISPLAY_NAME} Release|g" "$wf"
    rm -f "${wf}.bak"
  fi
done
ok "  CI workflow yorum satirlari guncellendi"

# 2.6 — pnpm-workspace.yaml minimumReleaseAge duzelt
info "pnpm-workspace.yaml guncelleniyor..."
if grep -q "^minimumReleaseAge: 0" pnpm-workspace.yaml 2>/dev/null; then
  sed -i.bak '/^minimumReleaseAge: 0$/d' pnpm-workspace.yaml
  rm -f pnpm-workspace.yaml.bak
  ok "  minimumReleaseAge: 0 kaldirildi (.npmrc policy devrede)"
fi

# --- FAZ 3: Dokumantasyon Uyarlama ---
step "FAZ 3: Dokumantasyon Uyarlama"

# 3.1 — .sync-config.yaml olustur
info ".sync-config.yaml olusturuluyor..."
UPSTREAM_REPO_VALUE="${UPSTREAM_URL:-<boilerplate-repo-url>}"
cat > .sync-config.yaml << EOF
# Upstream Sync Degiskenleri
# Bu dosya adaptive sync sirasinda placeholder substitution icin kullanilir.
# Referans: tooling/sync/upstream-sync-manifest.yaml

project_name: "${NAME}"
org_scope: "${SCOPE}"
upstream_repo: "${UPSTREAM_REPO_VALUE}"
EOF
ok "  .sync-config.yaml olusturuldu"

# 3.2 — BOUNDARY.md olustur
info "BOUNDARY.md olusturuluyor..."
SYNC_DATE=$(date '+%Y-%m-%d')

# Mevcut boilerplate tag'ini bul (varsa)
BP_TAG=$(git tag -l 'bp-v*' --sort=-v:refname 2>/dev/null | head -1 || echo "bp-v1.0.0")
BP_HASH=$(git rev-parse HEAD 2>/dev/null || echo "unknown")

cat > BOUNDARY.md << EOF
# Boundary Contract — ${DISPLAY_NAME}

Bu dosya, projenin boilerplate ile iliskisini ve upstream sync durumunu izler.
Referans: docs/governance/45-boilerplate-project-boundary-contract.md

## Proje Bilgileri

- **Proje:** ${DISPLAY_NAME}
- **Scope:** ${SCOPE}
- **Turetme tarihi:** ${SYNC_DATE}

## Upstream Sync Durumu

<!-- Asagidaki degerler upstream-sync.sh tarafindan otomatik guncellenir -->
- Surum: ${BP_TAG}
- Son sync tarihi: ${SYNC_DATE}
- Upstream hash: ${BP_HASH}

<!-- sync metadata (script tarafindan okunur) -->
<!-- boilerplate_upstream_hash: ${BP_HASH} -->
<!-- last_sync_date: ${SYNC_DATE} -->
<!-- upstream_version: ${BP_TAG} -->

## Sync Gecmisi

| Tarih | Onceki | Yeni | Dosya Sayisi |
|-------|--------|------|--------------|
| ${SYNC_DATE} | — | ${BP_TAG} | ilk turetme |

## Aktif Override'lar

Henuz override bulunmuyor.
Override sureci icin: docs/governance/44-exception-and-exemption-policy.md

## Proje-Ozel Eklemeler

Henuz proje-ozel ekleme bulunmuyor.

## Son Audit

- Tarih: ${SYNC_DATE}
- Sonuc: Ilk turetme, audit bekleniyor
EOF
ok "  BOUNDARY.md olusturuldu"

# 3.3 — CHANGELOG.md uyarla
info "CHANGELOG.md uyarlaniyor..."
cat > CHANGELOG.md << EOF
# CHANGELOG

Tum degisiklikler miras tipine gore kategorize edilir.
Referans: docs/governance/49-upstream-sync-strategy.md

- **ZORUNLU**: Boilerplate'ten gelen zorunlu miras degisiklikleri
- **YAPISAL**: Yapisal miras degisiklikleri
- **FELSEFI**: Bilgilendirme, zorunlu sure yok

---

## [v0.1.0] - ${SYNC_DATE}

### Proje olusturuldu

${DISPLAY_NAME} projesi boilerplate ${BP_TAG} versiyonundan turetildi.

- Scope: ${SCOPE}
- Upstream: ${BP_TAG}
- Tum canonical stack kararlari (ADR-001 → ADR-019) miras alindi
EOF
ok "  CHANGELOG.md uyarlandi"

# 3.4 — CLAUDE.md Proje Kimligi bolumunu guncelle
info "CLAUDE.md Proje Kimligi guncelleniyor..."
if [ -f "CLAUDE.md" ]; then
  # Proje Kimligi bolumunu bul ve guncelle
  # Eski icerik:
  #   ## Proje Kimliği
  #   - Cross-platform boilerplate: React + React Native (Expo)
  #   - Documentation-first, spec-first yaklaşım
  #   - Apple HIG uyumlu, design system merkezli
  # Yeni icerik: proje-ozel
  python3 << PYEOF
import re

with open("CLAUDE.md", "r", encoding="utf-8") as f:
    content = f.read()

old_identity = """## Proje Kimliği
- Cross-platform boilerplate: React + React Native (Expo)
- Documentation-first, spec-first yaklaşım
- Apple HIG uyumlu, design system merkezli"""

new_identity = """## Proje Kimliği
- **Proje:** ${DISPLAY_NAME}
- **Scope:** ${SCOPE}
- Cross-platform uygulama: React (web) + React Native/Expo (mobil)
- Documentation-first, spec-first yaklaşım
- Apple HIG uyumlu, design system merkezli
- Boilerplate: ${BP_TAG} versiyonundan türetildi"""

content = content.replace(old_identity, new_identity)

# Baslik guncelle
content = content.replace(
    "# Boilerplate Proje Talimatları",
    "# ${DISPLAY_NAME} Proje Talimatları"
)

with open("CLAUDE.md", "w", encoding="utf-8") as f:
    f.write(content)
PYEOF
  ok "  CLAUDE.md Proje Kimligi guncellendi"
fi

# 3.5 — AGENTS.md baslik guncelle
info "AGENTS.md baslik guncelleniyor..."
if [ -f "AGENTS.md" ]; then
  sed -i.bak "s|# Boilerplate Codex Talimatları|# ${DISPLAY_NAME} Codex Talimatları|g" AGENTS.md
  rm -f AGENTS.md.bak
  ok "  AGENTS.md basligi guncellendi"
fi

# 3.6 — Projeye ozgu dosyalari uyarla
info "Projeye ozgu dosyalar uyarlaniyor..."

# derived-projects.txt icerigi temizle (yorum basligi korunur)
if [ -f "tooling/sync/derived-projects.txt" ]; then
  cat > tooling/sync/derived-projects.txt << 'EOF'
# Derived Projects — Upstream Sync Bildirim Listesi
# Bu dosya, bu projeden turetilen alt projelerin listesini icerir.
# Eger bu proje baska projelere temel olusturmuyorsa bos kalir.
#
# Format: <org>/<repo> (her satira bir repo)
EOF
  ok "  derived-projects.txt uyarlandi"
fi

# notify-derived-projects.yml — workflow_dispatch only yap
if [ -f ".github/workflows/notify-derived-projects.yml" ]; then
  sed -i.bak 's|^on:$|on:|; s|^  push:|  # push: (turetilen projede devre disi)|; s|^    tags:|    # tags:|; s|^      - .bp-v\*.|      # - '\''bp-v*'\''|' \
    .github/workflows/notify-derived-projects.yml

  # Daha guvenilir yaklasim: python ile
  python3 << 'PYEOF'
with open(".github/workflows/notify-derived-projects.yml", "r", encoding="utf-8") as f:
    content = f.read()

# push trigger'i devre disi birak, workflow_dispatch ekle
content = content.replace(
    """on:
  push:
    tags:
      - 'bp-v*'""",
    """on:
  workflow_dispatch:
    inputs:
      tag:
        description: 'Bildirim gonderilecek tag'
        required: true
        type: string
  # push trigger devre disi — turetilen projede otomatik tetikleme yok
  # push:
  #   tags:
  #     - 'bp-v*'"""
)

with open(".github/workflows/notify-derived-projects.yml", "w", encoding="utf-8") as f:
    f.write(content)
PYEOF
  rm -f .github/workflows/notify-derived-projects.yml.bak
  ok "  notify-derived-projects.yml → workflow_dispatch only"
fi

# project/adr/PDR-*.md — icerik sifirla, sablon birak
info "Proje ADR dosyalari sablona donusturuluyor..."
for pdr in project/adr/PDR-*.md; do
  if [ -f "$pdr" ]; then
    FILENAME=$(basename "$pdr")
    cat > "$pdr" << EOF
# ${FILENAME%.md}

> Bu dosya boilerplate'ten miras alinan bir PDR sablonudur.
> Projenin kendi kararlari icin icerik guncellenmelidir.
> ADR sablonu: docs/adr/18-adr-template.md

## Durum

Draft

## Karar

(Proje-ozel karar buraya yazilir)

## Gerekce

(Kararin gerekceleri buraya yazilir)

## Sonuclar

(Kararin sonuclari buraya yazilir)
EOF
    ok "  $pdr → sablon"
  fi
done

# --- FAZ 4: Upstream Remote ---
step "FAZ 4: Upstream Remote Kurulumu"

if [ -n "$UPSTREAM_URL" ]; then
  if ! git remote get-url upstream &>/dev/null; then
    git remote add upstream "$UPSTREAM_URL"
    git fetch upstream --tags --quiet 2>/dev/null || true
    ok "  upstream remote eklendi: $UPSTREAM_URL"
  else
    warn "  upstream remote zaten tanimli: $(git remote get-url upstream)"
  fi
else
  warn "  --upstream-url belirtilmedi. upstream remote'u daha sonra ekleyebilirsiniz:"
  echo "    git remote add upstream <boilerplate-repo-url>"
fi

# --- FAZ 5: Bagimlilik Kurulumu ---
step "FAZ 5: Bagimlilik Kurulumu"

if [ "$SKIP_INSTALL" = false ]; then
  info "pnpm install calistiriliyor..."
  if pnpm install 2>&1; then
    ok "  pnpm install basarili"
  else
    warn "  pnpm install basarisiz — daha sonra 'pnpm install' calistirin"
  fi
else
  warn "  pnpm install atlandi (--skip-install)"
fi

# --- FAZ 6: Dogrulama ---
step "FAZ 6: Dogrulama"

if [ "$SKIP_VERIFY" = true ]; then
  warn "Dogrulama atlandi (--skip-verify)"
else
  VERIFY_PASS=true

  # 6.1 — @project referansi kalmamis mi?
  info "Kalan @project/ referanslari taraniyor..."
  REMAINING=$(grep -r "@project/" --include="*.json" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.yml" \
    -l . 2>/dev/null | grep -v node_modules | grep -v ".git/" | grep -v "pnpm-lock" || true)
  if [ -n "$REMAINING" ]; then
    warn "Su dosyalarda hala @project/ referansi var:"
    echo "$REMAINING"
    VERIFY_PASS=false
  else
    ok "  @project/ referansi kalmamis"
  fi

  # 6.2 — Config dosyalarinda "boilerplate" kalmamis mi?
  info "Kalan 'boilerplate' referanslari taraniyor..."
  BP_REMAINING=$(grep -ril "boilerplate" package.json apps/mobile/app.json apps/web/index.html .env.example 2>/dev/null || true)
  if [ -n "$BP_REMAINING" ]; then
    warn "Su config dosyalarinda hala 'boilerplate' referansi var:"
    echo "$BP_REMAINING"
    VERIFY_PASS=false
  else
    ok "  Config dosyalarinda 'boilerplate' kalmamis"
  fi

  # 6.3 — Zorunlu dosyalar mevcut mu?
  info "Zorunlu dosyalar kontrol ediliyor..."
  for required in BOUNDARY.md .sync-config.yaml; do
    if [ -f "$required" ]; then
      ok "  $required mevcut"
    else
      error "  $required EKSIK"
      VERIFY_PASS=false
    fi
  done

  # 6.4 — pnpm typecheck (eger install yapildiysa)
  if [ "$SKIP_INSTALL" = false ] && [ -d "node_modules" ]; then
    info "pnpm typecheck calistiriliyor..."
    if pnpm typecheck 2>&1; then
      ok "  typecheck basarili"
    else
      warn "  typecheck basarisiz — daha sonra duzeltilmeli"
      VERIFY_PASS=false
    fi

    info "pnpm build calistiriliyor..."
    if pnpm build 2>&1; then
      ok "  build basarili"
    else
      warn "  build basarisiz — daha sonra duzeltilmeli"
      VERIFY_PASS=false
    fi
  fi

  echo ""
  if [ "$VERIFY_PASS" = true ]; then
    ok "Tum dogrulamalar gecti!"
  else
    warn "Bazi dogrulamalar basarisiz — yukaridaki uyarilari kontrol edin."
  fi
fi

# --- Sonuc Raporu ---
echo ""
step "TURETME TAMAMLANDI"
echo ""
ok   "Proje:         ${DISPLAY_NAME}"
ok   "Scope:         ${SCOPE}"
ok   "Bundle ID:     ${BUNDLE_ID}"
ok   "Domain:        ${DOMAIN}"
ok   "BOUNDARY.md:   Olusturuldu"
ok   ".sync-config:  Olusturuldu"
ok   "CHANGELOG.md:  Uyarlandi"
echo ""
info "Sonraki adimlar:"
echo ""
echo "  ${BOLD}1. Ortam degiskenleri${NC}"
echo "     cp .env.example .env.local"
echo "     # .env.local dosyasini gercek degerlerle doldurun"
echo "     # Ozellikle: VITE_API_BASE_URL, VITE_SENTRY_DSN, EXPO_PUBLIC_SENTRY_DSN"
echo ""
echo "  ${BOLD}2. Expo hesap ve proje kurulumu${NC}"
echo "     npm install -g eas-cli"
echo "     eas login"
echo "     cd apps/mobile && eas init"
echo "     # EAS init ciktisindaki Project ID'yi app.json'daki"
echo "     # expo.updates.url alanina yazin"
echo ""
echo "  ${BOLD}3. Design token'lari projeye ozel degerlerle guncelleyin${NC}"
echo "     # packages/design-tokens/src/raw/colors.ts  → Marka renkleri"
echo "     # packages/design-tokens/src/themes/light.ts → Light tema"
echo "     # packages/design-tokens/src/themes/dark.ts  → Dark tema"
echo ""
echo "  ${BOLD}4. Uygulama ikonlari ve splash ekrani olusturun${NC}"
echo "     # apps/mobile/assets/icon.png         (1024x1024)"
echo "     # apps/mobile/assets/splash.png       (1284x2778)"
echo "     # apps/mobile/assets/adaptive-icon.png (1024x1024)"
echo "     # Arac: https://icon.kitchen veya Figma"
echo ""
echo "  ${BOLD}5. EAS Submit credential'larini doldurun${NC}"
echo "     # apps/mobile/eas.json → appleId, ascAppId (iOS)"
echo "     # google-services-key.json olusturun (Android)"
echo ""
echo "  ${BOLD}6. Upstream remote ekleyin (--upstream-url vermediyseniz)${NC}"
echo "     git remote add upstream <boilerplate-repo-url>"
echo ""
echo "  ${BOLD}7. Ilk commit olusturun${NC}"
echo "     git add -A && git commit -m 'Proje olusturuldu: ${DISPLAY_NAME}'"
echo ""
echo "  ${BOLD}8. README.md'yi projeye ozel iceriginizle guncelleyin${NC}"
echo "     # Proje Tanitimi bolumunu projenizin aciklamasiyla degistirin"
echo ""
info "AI ile yeniden olusturulmasi gereken dosyalar:"
echo "  Asagidaki dosyalar boilerplate icerik tasiyor."
echo "  Claude Code / MoAI ile projeye ozel olarak yeniden uretin:"
echo ""
echo "  ${CYAN}Hemen (turetme sonrasi):${NC}"
echo "    /moai project        → .moai/project/product.md"
echo "                           .moai/project/structure.md"
echo "                           .moai/project/tech.md"
echo "    /moai codemaps       → .moai/project/codemaps/*.md (5 dosya)"
echo ""
echo "  ${CYAN}Ilk hafta:${NC}"
echo "    docs/onboarding/ilk-30-dakika.md"
echo "      → Projeye ozel onboarding rehberi yazin"
echo "    docs/onboarding/rol-bazli-okuma-rehberi.md"
echo "      → Proje ekip yapisina gore uyarlayin"
echo "    .moai/design/system.md"
echo "      → Design token'lar doldurulduktan sonra guncelleyin"
echo ""
info "Detayli rehber: docs/implementation/43-derived-project-creation-guide.md"
echo ""
