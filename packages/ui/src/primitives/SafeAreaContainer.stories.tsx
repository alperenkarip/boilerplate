// SafeAreaContainer primitive icin Storybook hikaye dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SafeAreaContainer } from './SafeAreaContainer';

const meta: Meta<typeof SafeAreaContainer> = {
  title: 'Primitives/SafeAreaContainer',
  component: SafeAreaContainer,
};
export default meta;
type Story = StoryObj<typeof SafeAreaContainer>;

/** Varsayilan safe area ornegi (ust ve alt kenarlar) */
export const Default: Story = {
  render: () => (
    <SafeAreaContainer edges={['top', 'bottom']}>
      <div style={{ padding: 16, background: '#f5f5f5' }}>
        Safe area icerigi — ust ve alt kenarlar korunuyor
      </div>
    </SafeAreaContainer>
  ),
};

/** Tum kenarlar korunmus */
export const AllEdges: Story = {
  render: () => (
    <SafeAreaContainer edges={['top', 'bottom', 'left', 'right']}>
      <div style={{ padding: 16, background: '#f5f5f5' }}>Tum kenarlar korunuyor</div>
    </SafeAreaContainer>
  ),
};
