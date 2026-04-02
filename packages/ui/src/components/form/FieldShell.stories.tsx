// FieldShell component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FieldShell } from './FieldShell';

const meta: Meta<typeof FieldShell> = {
  title: 'Components/Form/FieldShell',
  component: FieldShell,
};
export default meta;
type Story = StoryObj<typeof FieldShell>;

export const Default: Story = {
  args: { label: 'Alan Etiketi', hint: 'Yardimci metin' },
  render: (args) => (
    <FieldShell {...args}>
      <input
        style={{
          height: '40px',
          padding: '0 12px',
          borderRadius: '8px',
          border: '1px solid var(--color-border-default)',
          fontSize: '16px',
        }}
        placeholder="Bir deger girin"
      />
    </FieldShell>
  ),
};

export const WithError: Story = {
  args: { label: 'Zorunlu Alan', error: 'Bu alan zorunludur', required: true },
  render: (args) => (
    <FieldShell {...args}>
      <input
        style={{
          height: '40px',
          padding: '0 12px',
          borderRadius: '8px',
          border: '1px solid var(--color-border-error)',
          fontSize: '16px',
        }}
      />
    </FieldShell>
  ),
};

export const Required: Story = {
  args: { label: 'Zorunlu Alan', required: true },
  render: (args) => (
    <FieldShell {...args}>
      <input
        style={{
          height: '40px',
          padding: '0 12px',
          borderRadius: '8px',
          border: '1px solid var(--color-border-default)',
          fontSize: '16px',
        }}
        placeholder="Zorunlu alan"
      />
    </FieldShell>
  ),
};
