// StepIndicator component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StepIndicator } from './StepIndicator';

const meta: Meta<typeof StepIndicator> = {
  title: 'Components/Navigation/StepIndicator',
  component: StepIndicator,
  argTypes: {
    currentStep: { control: { type: 'number', min: 0, max: 4 } },
  },
};
export default meta;
type Story = StoryObj<typeof StepIndicator>;

export const Default: Story = {
  args: {
    steps: ['Hesap', 'Profil', 'Adres', 'Onay'],
    currentStep: 1,
  },
};

export const FirstStep: Story = {
  args: {
    steps: ['Hesap', 'Profil', 'Adres', 'Onay'],
    currentStep: 0,
  },
};

export const LastStep: Story = {
  args: {
    steps: ['Hesap', 'Profil', 'Adres', 'Onay'],
    currentStep: 3,
  },
};

export const AllCompleted: Story = {
  args: {
    steps: ['Hesap', 'Profil', 'Adres', 'Onay'],
    currentStep: 4,
  },
};

export const TwoSteps: Story = {
  args: {
    steps: ['Giris', 'Dogrulama'],
    currentStep: 0,
  },
};
