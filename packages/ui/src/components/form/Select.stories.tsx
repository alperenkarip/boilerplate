// Select component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Form/Select',
  component: Select,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: 'Secim',
    options: [
      { value: '1', label: 'Secenek 1' },
      { value: '2', label: 'Secenek 2' },
      { value: '3', label: 'Secenek 3' },
    ],
  },
};

export const WithPlaceholder: Story = {
  args: {
    label: 'Sehir',
    placeholder: 'Bir sehir secin',
    options: [
      { value: 'ist', label: 'Istanbul' },
      { value: 'ank', label: 'Ankara' },
      { value: 'izm', label: 'Izmir' },
    ],
  },
};

export const WithError: Story = {
  args: {
    label: 'Kategori',
    error: 'Lutfen bir kategori secin',
    options: [
      { value: '1', label: 'Kategori 1' },
      { value: '2', label: 'Kategori 2' },
    ],
  },
};
