// Skeleton component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/State/Skeleton',
  component: Skeleton,
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: { width: '100%', height: 16 },
};

export const Rounded: Story = {
  args: { width: 48, height: 48, rounded: true },
};

export const TextBlock: Story = {
  args: { width: '60%', height: 14 },
};
