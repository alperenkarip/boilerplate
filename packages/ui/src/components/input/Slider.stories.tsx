// Slider component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Components/Input/Slider',
  component: Slider,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    showValue: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Slider>;

/** Varsayilan gorunum */
export const Default: Story = {
  args: {
    label: 'Ses Seviyesi',
    value: 50,
    min: 0,
    max: 100,
  },
};

/** Adimli kaydirici */
export const WithStep: Story = {
  args: {
    label: 'Fiyat Filtresi',
    value: 200,
    min: 0,
    max: 1000,
    step: 50,
  },
};

/** Deger gostergesi gizli */
export const WithoutValueDisplay: Story = {
  args: {
    label: 'Parlaklik',
    value: 75,
    showValue: false,
  },
};

/** Devre disi durumu */
export const Disabled: Story = {
  args: {
    label: 'Ses Seviyesi',
    value: 30,
    disabled: true,
  },
};

/** Kucuk aralik */
export const SmallRange: Story = {
  args: {
    label: 'Degerlendirme',
    value: 3,
    min: 1,
    max: 5,
    step: 1,
  },
};
