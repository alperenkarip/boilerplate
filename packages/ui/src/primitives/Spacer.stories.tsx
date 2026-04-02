// Spacer primitive icin Storybook hikaye dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spacer } from './Spacer';

const meta: Meta<typeof Spacer> = {
  title: 'Primitives/Spacer',
  component: Spacer,
};
export default meta;
type Story = StoryObj<typeof Spacer>;

/** Dikey bosluk ornegi */
export const Default: Story = {
  render: () => (
    <div>
      <div style={{ padding: 8, background: '#e0e0e0' }}>Ust icerik</div>
      <Spacer size={4} direction="vertical" />
      <div style={{ padding: 8, background: '#e0e0e0' }}>Alt icerik</div>
    </div>
  ),
};

/** Yatay bosluk ornegi */
export const Horizontal: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ padding: 8, background: '#d0d0d0' }}>Sol</div>
      <Spacer size={6} direction="horizontal" />
      <div style={{ padding: 8, background: '#d0d0d0' }}>Sag</div>
    </div>
  ),
};
