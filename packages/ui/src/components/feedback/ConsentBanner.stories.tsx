// ConsentBanner component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConsentBanner } from './ConsentBanner';

const meta: Meta<typeof ConsentBanner> = {
  title: 'Components/Feedback/ConsentBanner',
  component: ConsentBanner,
};
export default meta;
type Story = StoryObj<typeof ConsentBanner>;

export const Default: Story = {
  args: {
    onAcceptAll: () => {},
    onRejectAll: () => {},
    onManagePreferences: () => {},
  },
};

export const WithPrivacyPolicy: Story = {
  args: {
    onAcceptAll: () => {},
    onRejectAll: () => {},
    onManagePreferences: () => {},
    privacyPolicyUrl: '/gizlilik-politikasi',
  },
};
