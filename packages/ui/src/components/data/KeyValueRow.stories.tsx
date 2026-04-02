// KeyValueRow component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { KeyValueRow } from './KeyValueRow';

const meta: Meta<typeof KeyValueRow> = {
  title: 'Components/Data/KeyValueRow',
  component: KeyValueRow,
};
export default meta;
type Story = StoryObj<typeof KeyValueRow>;

export const Default: Story = {
  args: { label: 'E-posta', value: 'ornek@email.com' },
};

export const NumericValue: Story = {
  args: { label: 'Siparis sayisi', value: 42 },
};
