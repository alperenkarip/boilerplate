# @project/ui

Cross-platform component kutuphanesi. 85+ component icerir. Primitiflerden karmasik overlay'lere kadar tum UI yapitaslari bu pakette yer alir. Component'ler platform-agnostic tasarlanmistir ve `@project/design-tokens` paketindeki semantic token'lari tuketir.

## Kullanim

```typescript
import { Button, Card, TextField, Modal } from '@project/ui';
```

## Dosya Yapisi

```
src/
  primitives/           # Temel yapi taslari (12 primitif)
    Box.tsx
    Text.tsx
    Heading.tsx
    Stack.tsx
    Inline.tsx
    Spacer.tsx
    Divider.tsx
    Icon.tsx
    Pressable.tsx
    ScrollContainer.tsx
    SafeAreaContainer.tsx
    KeyboardAvoidingContainer.tsx
    index.ts

  components/
    data/               # Veri gosterim component'leri
      Avatar, Badge, Card, Chip, KeyValueRow, ListItem, SectionHeader

    feedback/           # Geri bildirim ve bilgilendirme
      Banner, ConsentBanner, NetworkStatusBanner, Toast

    form/               # Form elemanlari
      Button, Checkbox, FieldShell, FormActions, FormGroup,
      IconButton, Radio, Select, Switch, TextArea, TextField

    input/              # Gelismis giris alanlari
      DatePicker, PasswordField, PhoneInput, SearchBar, Slider

    navigation/         # Navigasyon component'leri
      Header, SegmentedControl, StepIndicator, TabBar

    overlay/            # Katmanli icerik
      ActionSheet, BottomSheet, ConfirmDialog, Drawer, Modal,
      Popover, Tooltip

    quality/            # Kalite ve guvenlik
      AppLockScreen

    state/              # Durum gostergeleri
      EmptyState, ErrorState, LoadingState, ProgressBar,
      Skeleton, Spinner

    utility/            # Yardimci component'ler
      Accordion, CountdownTimer, DividerWithLabel,
      InfiniteScrollList, PullToRefreshWrapper, SkipToContent,
      StickyFooter, WebViewPlaceholder

    index.ts

  providers/
    ThemeProvider.tsx    # Tema yonetimi

  quality/
    AuthGuard.tsx       # Kimlik dogrulama korumasi
    ErrorBoundary.tsx   # Hata siniri
    ScreenContainer.tsx # Ekran sarmalayici

  index.ts              # Ana barrel export
```

Her component'in yaninda `.stories.tsx` dosyasi bulunur.

## Component Isimlendirme

- Tum component'ler PascalCase ile isimlendirilir
- Dosya adi component adiyla birebir eslesir (ornegin `Button.tsx` icindeki component `Button`)
- Story dosyasi: `Button.stories.tsx`

## Yeni Component Ekleme

1. `src/components/{kategori}/` altinda component dosyasini olusturun
2. Ayni dizinde `.stories.tsx` dosyasini olusturun
3. Ilgili kategorinin `index.ts` dosyasina export ekleyin
4. `src/components/index.ts` dosyasina kategori export'unu ekleyin (yoksa)
5. `src/index.ts` ana barrel export'a ekleyin

## Story Yazma

Storybook 10.x convention kullanilir:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'components/form/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Tikla',
  },
};
```

## Platform Adaptasyon

Component'ler platform-agnostic yazilmistir. Platform-spesifik davranis gerektiren durumlarda `docs/design-system/26-platform-adaptation-rules.md` dokumanindaki kurallara uyulmalidir.

## Referans Dokumanlar

- Component governance: `docs/design-system/23-component-governance-rules.md`
- Platform adaptasyon: `docs/design-system/26-platform-adaptation-rules.md`
- Hata/bos/yukleme durumlari: `docs/design-system/25-error-empty-loading-states.md`
- Hareket ve etkilesim: `docs/design-system/24-motion-and-interaction-standard.md`
- Erisilebilirlik: `docs/quality/12-accessibility-standard.md`
