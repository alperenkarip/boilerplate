// Checkbox component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Form/Checkbox',
  component: Checkbox,
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: { checked: false, onChange: () => {}, label: 'Kullanim kosullarini kabul ediyorum' },
};

export const Checked: Story = {
  args: { checked: true, onChange: () => {}, label: 'Bildirim almak istiyorum' },
};

export const Disabled: Story = {
  args: { checked: false, onChange: () => {}, label: 'Devre disi secenek', isDisabled: true },
};

export const WithError: Story = {
  args: {
    checked: false,
    onChange: () => {},
    label: 'Kosullari kabul edin',
    error: 'Bu alani isaretlemeniz gerekiyor',
  },
};
