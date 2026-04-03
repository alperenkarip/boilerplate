// FormActions component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormActions } from './FormActions';

const meta: Meta<typeof FormActions> = {
  title: 'Components/Form/FormActions',
  component: FormActions,
};
export default meta;
type Story = StoryObj<typeof FormActions>;

export const Default: Story = {
  render: () => (
    <FormActions>
      <button type="button" style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Iptal
      </button>
      <button
        type="submit"
        style={{
          padding: '8px 16px',
          backgroundColor: 'var(--color-interactive-primary-bg)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Kaydet
      </button>
    </FormActions>
  ),
};

export const SingleButton: Story = {
  render: () => (
    <FormActions>
      <button
        type="submit"
        style={{
          padding: '8px 16px',
          backgroundColor: 'var(--color-interactive-primary-bg)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Gonder
      </button>
    </FormActions>
  ),
};
