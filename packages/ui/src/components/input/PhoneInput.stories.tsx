// PhoneInput component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhoneInput } from './PhoneInput';

const meta: Meta<typeof PhoneInput> = {
  title: 'Components/Input/PhoneInput',
  component: PhoneInput,
  argTypes: {
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof PhoneInput>;

/** Varsayilan gorunum — Turkiye ulke kodu secili */
export const Default: Story = {
  args: {
    label: 'Telefon Numarasi',
    defaultCountry: 'TR',
  },
};

/** Deger girilmis durum */
export const WithValue: Story = {
  args: {
    label: 'Telefon Numarasi',
    value: { countryCode: '+90', number: '5321234567' },
  },
};

/** Hata durumu */
export const WithError: Story = {
  args: {
    label: 'Telefon Numarasi',
    value: { countryCode: '+90', number: '123' },
    error: 'Gecersiz telefon numarasi',
  },
};

/** Farkli ulke kodu */
export const DifferentCountry: Story = {
  args: {
    label: 'Telefon Numarasi',
    defaultCountry: 'US',
    placeholder: '(XXX) XXX-XXXX',
  },
};

/** Devre disi durumu */
export const Disabled: Story = {
  args: {
    label: 'Telefon Numarasi',
    disabled: true,
    value: { countryCode: '+90', number: '5321234567' },
  },
};
