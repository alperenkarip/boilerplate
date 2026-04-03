// FormGroup component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormGroup } from './FormGroup';

const meta: Meta<typeof FormGroup> = {
  title: 'Components/Form/FormGroup',
  component: FormGroup,
};
export default meta;
type Story = StoryObj<typeof FormGroup>;

export const Default: Story = {
  args: {
    label: 'Kisisel Bilgiler',
    children: 'Form alanlari bu grubun icinde yer alir.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Adres Bilgileri',
    children: 'Adres alanlari buraya gelecek.',
    error: 'Lutfen tum zorunlu alanlari doldurun',
  },
};

export const WithoutLabel: Story = {
  args: {
    children: 'Etiketsiz grup icerigi.',
  },
};
