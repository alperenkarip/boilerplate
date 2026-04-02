// Card component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Data/Card',
  component: Card,
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: { children: 'Kart icerigi' },
};

export const WithPadding: Story = {
  args: { children: 'Genis padding ile kart icerigi', padding: 8 },
};
