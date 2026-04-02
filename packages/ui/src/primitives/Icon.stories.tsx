// Icon primitive icin Storybook hikaye dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Primitives/Icon',
  component: Icon,
};
export default meta;
type Story = StoryObj<typeof Icon>;

/** Varsayilan ikon (check isareti) */
export const Default: Story = {
  args: {
    children: <polyline points="20 6 9 17 4 12" />,
    size: 24,
    accessibilityLabel: 'Onay ikonu',
  },
};

/** Buyuk ikon */
export const Large: Story = {
  args: {
    children: <circle cx="12" cy="12" r="10" />,
    size: 48,
    accessibilityLabel: 'Daire ikonu',
  },
};

/** Hata rengi ikon */
export const ErrorColor: Story = {
  args: {
    children: <line x1="18" y1="6" x2="6" y2="18" />,
    size: 24,
    color: 'error',
    accessibilityLabel: 'Hata ikonu',
  },
};

/** Dekoratif ikon (a11y etiketsiz) */
export const Decorative: Story = {
  args: {
    children: (
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    ),
    size: 24,
  },
};
