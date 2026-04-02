// Switch component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Form/Switch',
  component: Switch,
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: { checked: false, onChange: () => {}, label: 'Bildirimler' },
};

export const Checked: Story = {
  args: { checked: true, onChange: () => {}, label: 'Bildirimler' },
};

export const Disabled: Story = {
  args: { checked: false, onChange: () => {}, label: 'Devre disi', isDisabled: true },
};
