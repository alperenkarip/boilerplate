// Avatar component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Data/Avatar',
  component: Avatar,
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: { name: 'Ali Veli', size: 40 },
};

export const Large: Story = {
  args: { name: 'Mehmet Yilmaz', size: 64 },
};

export const Small: Story = {
  args: { name: 'Ayse Kara', size: 28 },
};

export const WithImage: Story = {
  args: { name: 'Ali Veli', size: 40, src: 'https://i.pravatar.cc/80' },
};
