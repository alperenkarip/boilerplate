// Text primitive icin Storybook hikaye dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Primitives/Text',
  component: Text,
};
export default meta;
type Story = StoryObj<typeof Text>;

/** Varsayilan body metin ornegi */
export const Default: Story = {
  args: {
    children: 'Ornek metin',
  },
};

/** Farkli varyantlar */
export const Caption: Story = {
  args: {
    children: 'Caption metin',
    variant: 'caption',
  },
};

export const Label: Story = {
  args: {
    children: 'Label metin',
    variant: 'label',
  },
};

export const Overline: Story = {
  args: {
    children: 'Overline metin',
    variant: 'overline',
  },
};

/** Kalin yazi ornegi */
export const Bold: Story = {
  args: {
    children: 'Kalin metin',
    weight: 'bold',
  },
};

/** Hata rengi ornegi */
export const ErrorColor: Story = {
  args: {
    children: 'Hata mesaji',
    color: 'error',
  },
};
