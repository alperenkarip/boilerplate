// Tooltip component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Overlay/Tooltip',
  component: Tooltip,
  argTypes: {
    position: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
  // Tooltip'in gorunmesi icin ekranda ortaliyoruz
  decorators: [
    (Story) => (
      <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  args: {
    content: 'Bu bir ipucu metnidir',
    children: 'Uzerime gel',
    position: 'top',
  },
};

export const Bottom: Story = {
  args: {
    content: 'Altta gorunen ipucu',
    children: 'Uzerime gel',
    position: 'bottom',
  },
};

export const Left: Story = {
  args: {
    content: 'Sol tarafta gorunen ipucu',
    children: 'Uzerime gel',
    position: 'left',
  },
};

export const Right: Story = {
  args: {
    content: 'Sag tarafta gorunen ipucu',
    children: 'Uzerime gel',
    position: 'right',
  },
};
