// TextArea component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Components/Form/TextArea',
  component: TextArea,
  argTypes: {
    rows: { control: { type: 'number', min: 2, max: 20 } },
  },
};
export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: { label: 'Aciklama', placeholder: 'Detaylari buraya yazin...' },
};

export const WithHint: Story = {
  args: {
    label: 'Notlar',
    placeholder: 'Notlarinizi girin',
    hint: 'En fazla 500 karakter girebilirsiniz',
  },
};

export const WithError: Story = {
  args: {
    label: 'Mesaj',
    placeholder: 'Mesajinizi yazin',
    error: 'Bu alan zorunludur',
  },
};

export const CustomRows: Story = {
  args: { label: 'Uzun metin', rows: 8, placeholder: 'Uzun icerik alani...' },
};
