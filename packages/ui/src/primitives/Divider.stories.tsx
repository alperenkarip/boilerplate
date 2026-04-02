// Divider primitive icin Storybook hikaye dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Primitives/Divider',
  component: Divider,
};
export default meta;
type Story = StoryObj<typeof Divider>;

/** Yatay ayirici ornegi */
export const Default: Story = {
  render: () => (
    <div>
      <div style={{ padding: 8 }}>Ust bolum</div>
      <Divider />
      <div style={{ padding: 8 }}>Alt bolum</div>
    </div>
  ),
};

/** Bosluklu ayirici */
export const WithSpacing: Story = {
  render: () => (
    <div>
      <div style={{ padding: 8 }}>Ust bolum</div>
      <Divider spacing={4} color="strong" />
      <div style={{ padding: 8 }}>Alt bolum</div>
    </div>
  ),
};

/** Dikey ayirici */
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'stretch', height: 60 }}>
      <div style={{ padding: 8 }}>Sol</div>
      <Divider direction="vertical" spacing={2} />
      <div style={{ padding: 8 }}>Sag</div>
    </div>
  ),
};
