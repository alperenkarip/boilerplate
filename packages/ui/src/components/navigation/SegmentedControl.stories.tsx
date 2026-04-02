// SegmentedControl component icin Storybook story dosyasi
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl } from './SegmentedControl';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Components/Navigation/SegmentedControl',
  component: SegmentedControl,
};
export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  args: {
    options: [
      { value: 'daily', label: 'Gunluk' },
      { value: 'weekly', label: 'Haftalik' },
      { value: 'monthly', label: 'Aylik' },
    ],
    value: 'daily',
    onChange: () => {},
  },
};

export const TwoOptions: Story = {
  args: {
    options: [
      { value: 'list', label: 'Liste' },
      { value: 'grid', label: 'Izgara' },
    ],
    value: 'list',
    onChange: () => {},
  },
};

/** Interaktif ornek — state yonetimiyle */
export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState('all');
    return (
      <SegmentedControl
        options={[
          { value: 'all', label: 'Tumu' },
          { value: 'active', label: 'Aktif' },
          { value: 'archived', label: 'Arsiv' },
        ]}
        value={selected}
        onChange={setSelected}
      />
    );
  },
};
