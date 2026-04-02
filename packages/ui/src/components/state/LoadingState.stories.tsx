// LoadingState component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingState } from './LoadingState';

const meta: Meta<typeof LoadingState> = {
  title: 'Components/State/LoadingState',
  component: LoadingState,
};
export default meta;
type Story = StoryObj<typeof LoadingState>;

export const Default: Story = {
  args: {},
};

export const CustomMessage: Story = {
  args: { message: 'Veriler hazirlaniyor...' },
};
