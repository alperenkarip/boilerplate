// ProgressBar component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/State/ProgressBar',
  component: ProgressBar,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: { value: 45, label: 'Yukleme ilerlemesi' },
};

export const Empty: Story = {
  args: { value: 0, label: 'Baslamadi' },
};

export const Full: Story = {
  args: { value: 100, label: 'Tamamlandi' },
};
