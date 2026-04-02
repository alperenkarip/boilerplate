// KeyboardAvoidingContainer primitive icin Storybook hikaye dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { KeyboardAvoidingContainer } from './KeyboardAvoidingContainer';

const meta: Meta<typeof KeyboardAvoidingContainer> = {
  title: 'Primitives/KeyboardAvoidingContainer',
  component: KeyboardAvoidingContainer,
};
export default meta;
type Story = StoryObj<typeof KeyboardAvoidingContainer>;

/** Aktif klavye kacinma wrapper ornegi */
export const Default: Story = {
  render: () => (
    <KeyboardAvoidingContainer enabled>
      <div style={{ padding: 16, background: '#f5f5f5' }}>
        <p>Klavye kacinma alani — web tarafinda minimal wrapper</p>
        <input
          type="text"
          placeholder="Bir seyler yazin..."
          style={{ padding: 8, width: '100%', boxSizing: 'border-box' }}
        />
      </div>
    </KeyboardAvoidingContainer>
  ),
};

/** Devre disi wrapper */
export const Disabled: Story = {
  render: () => (
    <KeyboardAvoidingContainer enabled={false}>
      <div style={{ padding: 16, background: '#f5f5f5' }}>
        <p>Klavye kacinma devre disi</p>
        <input
          type="text"
          placeholder="Bir seyler yazin..."
          style={{ padding: 8, width: '100%', boxSizing: 'border-box' }}
        />
      </div>
    </KeyboardAvoidingContainer>
  ),
};
