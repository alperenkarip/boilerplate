// Inline primitive icin Storybook hikaye dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inline } from './Inline';

const meta: Meta<typeof Inline> = {
  title: 'Primitives/Inline',
  component: Inline,
};
export default meta;
type Story = StoryObj<typeof Inline>;

/** Yatay yerlesim ornegi */
export const Default: Story = {
  render: () => (
    <Inline gap={2}>
      <div style={{ padding: 8, background: '#e0e0e0' }}>Eleman 1</div>
      <div style={{ padding: 8, background: '#e0e0e0' }}>Eleman 2</div>
      <div style={{ padding: 8, background: '#e0e0e0' }}>Eleman 3</div>
    </Inline>
  ),
};

/** Aralarinda bosluk olan yatay yerlesim */
export const SpaceBetween: Story = {
  render: () => (
    <Inline gap={2} justify="between">
      <div style={{ padding: 8, background: '#d0d0d0' }}>Sol</div>
      <div style={{ padding: 8, background: '#d0d0d0' }}>Orta</div>
      <div style={{ padding: 8, background: '#d0d0d0' }}>Sag</div>
    </Inline>
  ),
};

/** Wrap davranisi */
export const Wrapped: Story = {
  render: () => (
    <Inline gap={2} wrap>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} style={{ padding: 8, background: '#c0c0c0', minWidth: 80 }}>
          Eleman {i + 1}
        </div>
      ))}
    </Inline>
  ),
};
