// PasswordField component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordField } from './PasswordField';

const meta: Meta<typeof PasswordField> = {
  title: 'Components/Input/PasswordField',
  component: PasswordField,
  argTypes: {
    showToggle: { control: 'boolean' },
    autoComplete: {
      control: 'select',
      options: ['current-password', 'new-password'],
    },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof PasswordField>;

/** Varsayilan gorunum — toggle acik */
export const Default: Story = {
  args: {
    label: 'Sifre',
    placeholder: 'Sifrenizi giriniz',
  },
};

/** Yardimci metin ile */
export const WithHint: Story = {
  args: {
    label: 'Yeni Sifre',
    placeholder: 'Sifrenizi giriniz',
    hint: 'En az 8 karakter, bir buyuk harf ve bir rakam icermeli',
    autoComplete: 'new-password',
  },
};

/** Hata durumu */
export const WithError: Story = {
  args: {
    label: 'Sifre',
    placeholder: 'Sifrenizi giriniz',
    error: 'Sifre en az 8 karakter olmali',
  },
};

/** Toggle gizli */
export const WithoutToggle: Story = {
  args: {
    label: 'PIN',
    placeholder: '••••',
    showToggle: false,
  },
};

/** Devre disi durumu */
export const Disabled: Story = {
  args: {
    label: 'Sifre',
    placeholder: 'Sifrenizi giriniz',
    disabled: true,
  },
};
