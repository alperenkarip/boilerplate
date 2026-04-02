// DatePicker component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/Input/DatePicker',
  component: DatePicker,
  argTypes: {
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

/** Varsayilan gorunum */
export const Default: Story = {
  args: {
    label: 'Dogum Tarihi',
  },
};

/** Deger girilmis durum */
export const WithValue: Story = {
  args: {
    label: 'Baslangic Tarihi',
    value: '2026-04-02',
  },
};

/** Min/Max sinirli */
export const WithMinMax: Story = {
  args: {
    label: 'Randevu Tarihi',
    min: '2026-04-01',
    max: '2026-12-31',
  },
};

/** Hata durumu */
export const WithError: Story = {
  args: {
    label: 'Dogum Tarihi',
    value: '2030-01-01',
    error: 'Gecerli bir tarih seciniz',
  },
};

/** Devre disi durumu */
export const Disabled: Story = {
  args: {
    label: 'Dogum Tarihi',
    value: '2026-04-02',
    disabled: true,
  },
};
