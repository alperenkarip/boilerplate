// EmptyState component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/State/EmptyState',
  component: EmptyState,
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: { title: 'Kayit yok', description: 'Henuz kayit eklenmemis' },
};

export const WithAction: Story = {
  args: {
    title: 'Sonuc bulunamadi',
    description: 'Arama kriterlerinizi degistirin',
  },
};
