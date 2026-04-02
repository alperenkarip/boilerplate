// Banner component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner } from './Banner';

const meta: Meta<typeof Banner> = {
  title: 'Components/Feedback/Banner',
  component: Banner,
  argTypes: {
    variant: { control: 'select', options: ['success', 'error', 'warning', 'info'] },
  },
};
export default meta;
type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  args: { children: 'Bilgi mesaji', variant: 'info' },
};

export const Success: Story = {
  args: { children: 'Kayit basariyla olusturuldu', variant: 'success' },
};

export const Error: Story = {
  args: { children: 'Bir hata meydana geldi', variant: 'error' },
};

export const Warning: Story = {
  args: { children: 'Oturumunuz sona ermek uzere', variant: 'warning' },
};

export const Dismissible: Story = {
  args: { children: 'Kapatilabilir banner', variant: 'info', onDismiss: () => {} },
};
