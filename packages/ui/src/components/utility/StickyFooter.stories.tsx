// StickyFooter component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StickyFooter } from './StickyFooter';

const meta: Meta<typeof StickyFooter> = {
  title: 'Components/Utility/StickyFooter',
  component: StickyFooter,
};
export default meta;
type Story = StoryObj<typeof StickyFooter>;

export const Default: Story = {
  args: {
    children: 'Bu footer sayfa altina yapismis durumdadir.',
  },
};

export const WithButtons: Story = {
  render: () => (
    <div style={{ height: '300px', position: 'relative', overflow: 'auto' }}>
      <div style={{ padding: '16px' }}>
        <p>Sayfa icerigi burada yer alir.</p>
        <p>Asagi kaydiginizda footer sabit kalir.</p>
      </div>
      <StickyFooter>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button type="button" style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Iptal
          </button>
          <button
            type="button"
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--color-interactive-primary-bg)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Onayla
          </button>
        </div>
      </StickyFooter>
    </div>
  ),
};
