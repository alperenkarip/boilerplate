// DividerWithLabel component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DividerWithLabel } from './DividerWithLabel';

const meta: Meta<typeof DividerWithLabel> = {
  title: 'Components/Utility/DividerWithLabel',
  component: DividerWithLabel,
};
export default meta;
type Story = StoryObj<typeof DividerWithLabel>;

export const Default: Story = {
  args: {
    label: 'Veya',
  },
};

export const WithLongerText: Story = {
  args: {
    label: 'Diger secenekler',
  },
};

export const LoginDivider: Story = {
  args: {
    label: 'veya e-posta ile devam et',
  },
};
