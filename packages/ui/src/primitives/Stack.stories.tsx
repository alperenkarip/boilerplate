// Stack primitive icin Storybook hikaye dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';

const meta: Meta<typeof Stack> = {
  title: 'Primitives/Stack',
  component: Stack,
};
export default meta;
type Story = StoryObj<typeof Stack>;

/** Dikey yerlesim ornegi */
export const Default: Story = {
  render: () => (
    <Stack gap={2}>
      <div style={{ padding: 8, background: '#e0e0e0' }}>Eleman 1</div>
      <div style={{ padding: 8, background: '#e0e0e0' }}>Eleman 2</div>
      <div style={{ padding: 8, background: '#e0e0e0' }}>Eleman 3</div>
    </Stack>
  ),
};

/** Genis bosluklu dikey yerlesim */
export const LargeGap: Story = {
  render: () => (
    <Stack gap={6}>
      <div style={{ padding: 8, background: '#d0d0d0' }}>Ust</div>
      <div style={{ padding: 8, background: '#d0d0d0' }}>Orta</div>
      <div style={{ padding: 8, background: '#d0d0d0' }}>Alt</div>
    </Stack>
  ),
};

/** Ortali hizalama */
export const Centered: Story = {
  render: () => (
    <Stack gap={2} align="center">
      <div style={{ padding: 8, background: '#c0c0c0', width: 100 }}>Kisa</div>
      <div style={{ padding: 8, background: '#c0c0c0', width: 200 }}>Uzun eleman</div>
      <div style={{ padding: 8, background: '#c0c0c0', width: 150 }}>Orta</div>
    </Stack>
  ),
};
