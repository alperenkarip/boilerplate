// ScrollContainer primitive icin Storybook hikaye dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollContainer } from './ScrollContainer';

const meta: Meta<typeof ScrollContainer> = {
  title: 'Primitives/ScrollContainer',
  component: ScrollContainer,
};
export default meta;
type Story = StoryObj<typeof ScrollContainer>;

/** Dikey kaydirmali container */
export const Default: Story = {
  render: () => (
    <ScrollContainer maxHeight={200} direction="vertical">
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
          Satir {i + 1}
        </div>
      ))}
    </ScrollContainer>
  ),
};

/** Yatay kaydirmali container */
export const Horizontal: Story = {
  render: () => (
    <ScrollContainer direction="horizontal" style={{ maxWidth: 300 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              padding: 16,
              background: '#e0e0e0',
              minWidth: 120,
              textAlign: 'center',
            }}
          >
            Kart {i + 1}
          </div>
        ))}
      </div>
    </ScrollContainer>
  ),
};
