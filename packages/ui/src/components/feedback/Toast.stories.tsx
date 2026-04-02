// Toast component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Feedback/Toast',
  component: Toast,
  argTypes: {
    variant: { control: 'select', options: ['success', 'error', 'warning', 'info'] },
  },
};
export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: { message: 'Islem basarili', variant: 'success' },
};

export const Error: Story = {
  args: { message: 'Islem basarisiz oldu', variant: 'error' },
};

export const Warning: Story = {
  args: { message: 'Baglanti yavas', variant: 'warning' },
};

export const Info: Story = {
  args: { message: 'Guncelleme mevcut', variant: 'info' },
};

export const WithDismiss: Story = {
  args: { message: 'Kapatilabilir bildirim', variant: 'info', onDismiss: () => {} },
};
