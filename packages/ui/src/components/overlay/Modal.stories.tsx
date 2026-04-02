// Modal component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Overlay/Modal',
  component: Modal,
};
export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Modal Basligi',
    children: 'Bu bir modal icerik alanidir. Buraya herhangi bir icerik yerlestirilebilir.',
  },
};

export const WithoutTitle: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    children: 'Basliksiz modal icerigi.',
  },
};
