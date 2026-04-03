// AppLockScreen component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppLockScreen } from './AppLockScreen';

const meta: Meta<typeof AppLockScreen> = {
  title: 'Components/Quality/AppLockScreen',
  component: AppLockScreen,
  argTypes: {
    biometricAvailable: { control: 'boolean' },
    pinLength: { control: 'select', options: [4, 6] },
  },
};
export default meta;
type Story = StoryObj<typeof AppLockScreen>;

/** Biyometrik mevcut — varsayilan 4 haneli PIN */
export const Default: Story = {
  args: {
    onBiometricAuth: () => {},
    onPinSubmit: () => {},
    biometricAvailable: true,
    pinLength: 4,
  },
};

/** 6 haneli PIN modu */
export const SixDigitPin: Story = {
  args: {
    onBiometricAuth: () => {},
    onPinSubmit: () => {},
    biometricAvailable: true,
    pinLength: 6,
  },
};

/** Biyometrik mevcut degil */
export const WithoutBiometric: Story = {
  args: {
    onBiometricAuth: () => {},
    onPinSubmit: () => {},
    biometricAvailable: false,
    pinLength: 4,
  },
};

/** Hata mesaji gosterimi */
export const WithError: Story = {
  args: {
    onBiometricAuth: () => {},
    onPinSubmit: () => {},
    biometricAvailable: true,
    pinLength: 4,
    errorMessage: 'Yanlis PIN kodu. Lutfen tekrar deneyin.',
  },
};
