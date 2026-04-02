// IconButton component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Components/Form/IconButton',
  component: IconButton,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'ghost'] },
    isDisabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: <span style={{ fontSize: '18px' }}>✎</span>,
    accessibilityLabel: 'Duzenle',
  },
};

export const Ghost: Story = {
  args: {
    icon: <span style={{ fontSize: '18px' }}>✕</span>,
    accessibilityLabel: 'Kapat',
    variant: 'ghost',
  },
};

export const Disabled: Story = {
  args: {
    icon: <span style={{ fontSize: '18px' }}>✎</span>,
    accessibilityLabel: 'Duzenle',
    isDisabled: true,
  },
};
