// NetworkStatusBanner component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NetworkStatusBanner } from './NetworkStatusBanner';

const meta: Meta<typeof NetworkStatusBanner> = {
  title: 'Components/Feedback/NetworkStatusBanner',
  component: NetworkStatusBanner,
  argTypes: {
    isOffline: { control: 'boolean' },
    isSlowConnection: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof NetworkStatusBanner>;

/** Cevrimdisi durumu — error gorunumu */
export const Offline: Story = {
  args: {
    isOffline: true,
    isSlowConnection: false,
    onRetry: () => {},
  },
};

/** Yavas baglanti durumu — warning gorunumu */
export const SlowConnection: Story = {
  args: {
    isOffline: false,
    isSlowConnection: true,
    onRetry: () => {},
  },
};

/** Tekrar dene butonu olmadan */
export const WithoutRetry: Story = {
  args: {
    isOffline: true,
    isSlowConnection: false,
  },
};

/** Baglanti normal — hicbir sey render edilmez */
export const Connected: Story = {
  args: {
    isOffline: false,
    isSlowConnection: false,
  },
};
