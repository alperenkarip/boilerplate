// Popover component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';

const meta: Meta<typeof Popover> = {
  title: 'Components/Overlay/Popover',
  component: Popover,
  decorators: [
    (Story) => (
      <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Popover>;

export const Closed: Story = {
  args: {
    isOpen: false,
    onToggle: () => {},
    content: 'Bu bir popover icerigidir.',
    children: 'Tikla',
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
    onToggle: () => {},
    content: 'Detayli bilgi icerigi burada gorunur. Kapatmak icin disariya tiklayin.',
    children: 'Tikla',
  },
};
