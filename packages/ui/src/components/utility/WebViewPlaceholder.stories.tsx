// WebViewPlaceholder component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { WebViewPlaceholder } from './WebViewPlaceholder';

const meta: Meta<typeof WebViewPlaceholder> = {
  title: 'Components/Utility/WebViewPlaceholder',
  component: WebViewPlaceholder,
  argTypes: {
    height: { control: { type: 'text' } },
  },
};
export default meta;
type Story = StoryObj<typeof WebViewPlaceholder>;

export const Default: Story = {
  args: {
    uri: 'https://example.com',
    title: 'Ornek sayfa',
    height: 400,
  },
};

export const Short: Story = {
  args: {
    uri: 'https://example.com',
    title: 'Kisa gomulu icerik',
    height: 200,
  },
};

export const StringHeight: Story = {
  args: {
    uri: 'https://example.com',
    title: 'Yuzdelik yukseklik',
    height: '50vh',
  },
};
