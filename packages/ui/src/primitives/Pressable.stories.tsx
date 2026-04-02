// Pressable primitive icin Storybook hikaye dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pressable } from './Pressable';

const meta: Meta<typeof Pressable> = {
  title: 'Primitives/Pressable',
  component: Pressable,
};
export default meta;
type Story = StoryObj<typeof Pressable>;

/** Varsayilan tiklanabilir alan */
export const Default: Story = {
  args: {
    children: 'Tiklanabilir',
    onPress: () => {},
  },
};

/** Devre disi tiklanabilir alan */
export const Disabled: Story = {
  args: {
    children: 'Devre disi',
    onPress: () => {},
    isDisabled: true,
  },
};

/** Erisilebirlik etiketli */
export const WithAccessibilityLabel: Story = {
  args: {
    children: 'Aksiyonu calistir',
    onPress: () => {},
    accessibilityLabel: 'Aksiyonu calistiran buton',
  },
};
