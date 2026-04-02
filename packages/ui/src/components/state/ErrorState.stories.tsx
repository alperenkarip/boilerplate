// ErrorState component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorState } from './ErrorState';

const meta: Meta<typeof ErrorState> = {
  title: 'Components/State/ErrorState',
  component: ErrorState,
};
export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  args: { message: 'Bir hata olustu' },
};

export const WithRetry: Story = {
  args: { message: 'Veri yuklenemedi', onRetry: () => {} },
};

export const CustomTitle: Story = {
  args: {
    title: 'Baglanti hatasi',
    message: 'Sunucuya baglanilamadi, lutfen internet baglantinizi kontrol edin',
  },
};
