// Badge component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Data/Badge',
  component: Badge,
  argTypes: {
    variant: { control: 'select', options: ['default', 'success', 'warning', 'error', 'info'] },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: 'Yeni', variant: 'success' },
};

export const Error: Story = {
  args: { children: 'Hata', variant: 'error' },
};

export const Warning: Story = {
  args: { children: 'Beklemede', variant: 'warning' },
};

export const Info: Story = {
  args: { children: 'Bilgi', variant: 'info' },
};
