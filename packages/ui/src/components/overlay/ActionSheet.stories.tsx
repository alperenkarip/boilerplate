// ActionSheet component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionSheet } from './ActionSheet';

const meta: Meta<typeof ActionSheet> = {
  title: 'Components/Overlay/ActionSheet',
  component: ActionSheet,
};
export default meta;
type Story = StoryObj<typeof ActionSheet>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Islem Secin',
    actions: [
      { label: 'Duzenle', onPress: () => {} },
      { label: 'Paylas', onPress: () => {} },
      { label: 'Sil', onPress: () => {}, destructive: true },
    ],
  },
};

export const WithoutTitle: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    actions: [
      { label: 'Kopyala', onPress: () => {} },
      { label: 'Yapistir', onPress: () => {} },
    ],
  },
};
