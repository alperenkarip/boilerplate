// BottomSheet component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomSheet } from './BottomSheet';

const meta: Meta<typeof BottomSheet> = {
  title: 'Components/Overlay/BottomSheet',
  component: BottomSheet,
};
export default meta;
type Story = StoryObj<typeof BottomSheet>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Alt Sayfa',
    children: 'BottomSheet icerigi burada gorunur.',
  },
};

export const WithoutTitle: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    children: 'Basliksiz alt sayfa icerigi.',
  },
};
