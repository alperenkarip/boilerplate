// Spinner component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/State/Spinner',
  component: Spinner,
};
export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: { size: 24 },
};

export const Large: Story = {
  args: { size: 48 },
};

export const Small: Story = {
  args: { size: 16 },
};
