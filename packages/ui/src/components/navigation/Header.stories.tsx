// Header component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Navigation/Header',
  component: Header,
};
export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: { title: 'Sayfa Basligi' },
};

export const WithActions: Story = {
  args: {
    title: 'Profil',
    leftAction: '← Geri',
    rightAction: '⚙',
  },
};

export const NoBorder: Story = {
  args: { title: 'Kenarlıksız Baslik', bordered: false },
};
