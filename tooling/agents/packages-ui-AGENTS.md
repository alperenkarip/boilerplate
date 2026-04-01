# packages/ui/ Codex Talimatları

> Bu dosya bootstrap sırasında `packages/ui/AGENTS.md` konumuna taşınır.
> Kök AGENTS.md ile çelişmez, yalnızca ek kısıtlama getirir.

## UI Package Review Rules

### Domain Guardrail Uyumu
- D-DSY (Design System): Semantic token zorunlu, hardcoded değer → P0
- D-UIX (UI/UX & HIG): Touch target min 44×44pt, safe area, button hierarchy
- D-A11 (Accessibility): Role, label, focus, contrast → eksiklik P0
- D-MOT (Motion): Reduced motion guard zorunlu, motion token kullan

### Component Governance
- Yeni component açma → 23-component-governance-rules.md kriterlerini kontrol et
- Component naming: PascalCase, dosya adıyla eşleşmeli
- Component prop'ları TypeScript interface ile tanımlı olmalı — `any` yasak
- Her state (idle, hover, focus, active, disabled, error, loading) görünür olmalı

### Token Disiplini
- Sıfır hardcoded renk/spacing/font/radius → P0
- raw token doğrudan kullanılmamalı → semantic token zorunlu
- Token hiyerarşisi: raw → semantic → component

### Test
- Her yeni component için render testi zorunlu
- a11y prop'ları test kapsamında olmalı
