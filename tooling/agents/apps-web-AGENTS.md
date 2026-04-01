# apps/web/ Codex Talimatları

> Bu dosya bootstrap sırasında `apps/web/AGENTS.md` konumuna taşınır.
> Kök AGENTS.md ile çelişmez, yalnızca ek kısıtlama getirir.

## Web App Review Rules

### Platform-Specific
- Web runtime: React + Vite + React Router 7.x (ADR-001)
- Styling: Tailwind CSS 4.x (ADR-007)
- Auth: Backend-managed HttpOnly cookies (ADR-010)
- localStorage/sessionStorage'da token saklama → REDDET

### Navigation
- React Router 7.x route tanımları doğru mu?
- Deep link URL pattern'leri tanımlı mı?
- Back davranışı browser history ile uyumlu mu?

### Responsive & Web Standards
- Responsive layout: Tailwind responsive prefix'leri kullanılıyor mu?
- Keyboard navigation: Tab order mantıklı mı?
- Semantic HTML: div onClick yerine button/a kullanılıyor mu?
- Focus visible state gösteriliyor mu?

### Performance (Web-Specific)
- Route-level lazy loading (React.lazy) uygulanmış mı?
- Bundle size etkisi kabul edilebilir mi?
- Image lazy loading var mı?
