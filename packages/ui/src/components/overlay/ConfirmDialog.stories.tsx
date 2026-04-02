// ConfirmDialog component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfirmDialog } from './ConfirmDialog';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Components/Overlay/ConfirmDialog',
  component: ConfirmDialog,
  argTypes: {
    variant: { control: 'select', options: ['default', 'destructive'] },
  },
};
export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
    title: 'Emin misiniz?',
    message: 'Bu islemi gerceklestirmek istediginizden emin misiniz?',
  },
};

export const Destructive: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
    title: 'Kaydi Sil',
    message: 'Bu kayit kalici olarak silinecektir. Devam etmek istiyor musunuz?',
    variant: 'destructive',
    confirmLabel: 'Sil',
    cancelLabel: 'Vazgec',
  },
};
