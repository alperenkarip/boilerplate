// Button component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Form/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'destructive'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    isLoading: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: 'Tikla', variant: 'primary' },
};

export const Secondary: Story = {
  args: { children: 'Ikincil Buton', variant: 'secondary' },
};

export const Ghost: Story = {
  args: { children: 'Ghost Buton', variant: 'ghost' },
};

export const Destructive: Story = {
  args: { children: 'Sil', variant: 'destructive' },
};

export const Loading: Story = {
  args: { children: 'Tikla', variant: 'primary', isLoading: true },
};

export const Disabled: Story = {
  args: { children: 'Tikla', variant: 'primary', isDisabled: true },
};

export const FullWidth: Story = {
  args: { children: 'Tam Genislik', variant: 'primary', fullWidth: true },
};
