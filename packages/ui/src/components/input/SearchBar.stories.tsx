// SearchBar component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchBar } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/Input/SearchBar',
  component: SearchBar,
  argTypes: {
    placeholder: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof SearchBar>;

/** Varsayilan gorunum — bos arama cubugu */
export const Default: Story = {
  args: {
    placeholder: 'Ara...',
  },
};

/** Deger girilmis — temizle butonu gorunur */
export const WithValue: Story = {
  args: {
    value: 'React Native',
    placeholder: 'Ara...',
  },
};

/** Ozel placeholder */
export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Urun, kategori veya marka ara...',
  },
};

/** Devre disi durumu */
export const Disabled: Story = {
  args: {
    placeholder: 'Ara...',
    disabled: true,
  },
};
