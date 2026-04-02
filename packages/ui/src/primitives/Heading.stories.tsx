// Heading primitive icin Storybook hikaye dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from './Heading';

const meta: Meta<typeof Heading> = {
  title: 'Primitives/Heading',
  component: Heading,
};
export default meta;
type Story = StoryObj<typeof Heading>;

/** Varsayilan h2 baslik */
export const Default: Story = {
  args: {
    children: 'Baslik',
    level: 2,
  },
};

/** h1 baslik */
export const Level1: Story = {
  args: {
    children: 'Ana Baslik (H1)',
    level: 1,
  },
};

/** h3 baslik */
export const Level3: Story = {
  args: {
    children: 'Alt Baslik (H3)',
    level: 3,
  },
};

/** Ters renk baslik */
export const Inverse: Story = {
  args: {
    children: 'Ters Renkli Baslik',
    level: 2,
    color: 'inverse',
  },
};
