// Radio component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Components/Form/Radio',
  component: Radio,
};
export default meta;
type Story = StoryObj<typeof Radio>;

const sampleOptions = [
  { value: 'email', label: 'E-posta ile bildirim' },
  { value: 'sms', label: 'SMS ile bildirim' },
  { value: 'push', label: 'Push bildirim' },
];

export const Default: Story = {
  args: { options: sampleOptions, value: 'email', onChange: () => {}, name: 'notification' },
};

export const NoSelection: Story = {
  args: { options: sampleOptions, value: '', onChange: () => {}, name: 'notification-empty' },
};

export const WithError: Story = {
  args: {
    options: sampleOptions,
    value: '',
    onChange: () => {},
    name: 'notification-error',
    error: 'Lutfen bir secenek belirleyin',
  },
};
