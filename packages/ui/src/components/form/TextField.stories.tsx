// TextField component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Components/Form/TextField',
  component: TextField,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: { label: 'E-posta', placeholder: 'ornek@email.com' },
};

export const WithHint: Story = {
  args: { label: 'Sifre', type: 'password', hint: 'En az 8 karakter olmali' },
};

export const WithError: Story = {
  args: { label: 'E-posta', placeholder: 'ornek@email.com', error: 'Gecersiz e-posta adresi' },
};
