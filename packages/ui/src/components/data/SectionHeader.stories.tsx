// SectionHeader component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader } from './SectionHeader';

const meta: Meta<typeof SectionHeader> = {
  title: 'Components/Data/SectionHeader',
  component: SectionHeader,
};
export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const Default: Story = {
  args: { title: 'Bolum Basligi' },
};
