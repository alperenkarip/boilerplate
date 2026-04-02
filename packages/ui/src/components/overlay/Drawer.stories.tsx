// Drawer component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './Drawer';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Overlay/Drawer',
  component: Drawer,
  argTypes: {
    side: { control: 'select', options: ['left', 'right'] },
  },
};
export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    children:
      'Drawer icerigi. Navigasyon linkleri veya filtreleme secenekleri burada yer alabilir.',
  },
};

export const RightSide: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    side: 'right',
    children: 'Sag taraftan acilan drawer icerigi.',
  },
};

export const CustomWidth: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    width: 400,
    children: 'Genis drawer icerigi.',
  },
};
