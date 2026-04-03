// SkipToContent component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkipToContent } from './SkipToContent';

const meta: Meta<typeof SkipToContent> = {
  title: 'Components/Utility/SkipToContent',
  component: SkipToContent,
};
export default meta;
type Story = StoryObj<typeof SkipToContent>;

/** Varsayilan kullanim — Tab tusu ile focus alindiginda gorunur olur */
export const Default: Story = {
  args: {
    targetId: 'main-content',
  },
  render: (args) => (
    <div>
      <SkipToContent {...args} />
      <p style={{ color: 'var(--color-content-secondary)', fontSize: '14px' }}>
        Tab tusuna basarak &quot;Icerigi atla&quot; linkini goruntuleyebilirsiniz.
      </p>
      <div id="main-content" style={{ marginTop: '48px' }}>
        <h2>Ana Icerik Alani</h2>
        <p>Bu alan, SkipToContent ile atlanan hedef icerik alanidir.</p>
      </div>
    </div>
  ),
};

/** Ozel etiket ile kullanim */
export const CustomLabel: Story = {
  args: {
    targetId: 'content-area',
    label: 'Ana icerigi goruntule',
  },
  render: (args) => (
    <div>
      <SkipToContent {...args} />
      <p style={{ color: 'var(--color-content-secondary)', fontSize: '14px' }}>
        Ozel etiketli SkipToContent. Tab ile goruntuleyebilirsiniz.
      </p>
      <div id="content-area" style={{ marginTop: '48px' }}>
        <h2>Icerik Alani</h2>
      </div>
    </div>
  ),
};
