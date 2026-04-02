// Chip component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Components/Data/Chip',
  component: Chip,
};
export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: { label: 'Etiket' },
};

export const Selected: Story = {
  args: { label: 'Secili Etiket', selected: true },
};

export const Removable: Story = {
  args: { label: 'Kaldirilabilir', onRemove: () => {} },
};
