// CountdownTimer component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CountdownTimer } from './CountdownTimer';

const meta: Meta<typeof CountdownTimer> = {
  title: 'Components/Utility/CountdownTimer',
  component: CountdownTimer,
  argTypes: {
    seconds: { control: { type: 'number', min: 0, max: 600 } },
    format: { control: { type: 'select' }, options: ['mm:ss', 'ss'] },
  },
};
export default meta;
type Story = StoryObj<typeof CountdownTimer>;

export const Default: Story = {
  args: {
    seconds: 120,
    format: 'mm:ss',
  },
};

export const ShortTimer: Story = {
  args: {
    seconds: 10,
    format: 'ss',
  },
};

export const OtpTimeout: Story = {
  args: {
    seconds: 60,
    format: 'mm:ss',
    onComplete: () => console.log('OTP suresi doldu!'),
  },
};

export const FlashSale: Story = {
  args: {
    seconds: 300,
    format: 'mm:ss',
  },
};

export const Expired: Story = {
  args: {
    seconds: 0,
    format: 'mm:ss',
  },
};
