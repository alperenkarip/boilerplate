// Box primitive icin Storybook hikaye dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from './Box';

const meta: Meta<typeof Box> = {
  title: 'Primitives/Box',
  component: Box,
};
export default meta;
type Story = StoryObj<typeof Box>;

/** Varsayilan kutu ornegi */
export const Default: Story = {
  args: {
    children: 'Box icerigi',
    surface: 'subtle',
    padding: 4,
  },
};

/** Kenarlıklı kutu */
export const Bordered: Story = {
  args: {
    children: 'Kenarlikli kutu',
    bordered: true,
    padding: 4,
    rounded: 'md',
  },
};

/** Yukselti yuzey */
export const Elevated: Story = {
  args: {
    children: 'Elevated yuzey',
    surface: 'elevated',
    padding: 6,
    rounded: 'lg',
  },
};
