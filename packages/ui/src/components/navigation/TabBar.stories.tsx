// TabBar component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabBar } from './TabBar';

const meta: Meta<typeof TabBar> = {
  title: 'Components/Navigation/TabBar',
  component: TabBar,
};
export default meta;
type Story = StoryObj<typeof TabBar>;

const sampleItems = [
  { key: 'home', label: 'Ana Sayfa', icon: '🏠' },
  { key: 'search', label: 'Arama', icon: '🔍' },
  { key: 'profile', label: 'Profil', icon: '👤' },
  { key: 'settings', label: 'Ayarlar', icon: '⚙' },
];

export const Default: Story = {
  args: { items: sampleItems, activeKey: 'home', onSelect: () => {} },
};

export const SearchActive: Story = {
  args: { items: sampleItems, activeKey: 'search', onSelect: () => {} },
};

export const WithoutIcons: Story = {
  args: {
    items: [
      { key: 'tab1', label: 'Sekme 1' },
      { key: 'tab2', label: 'Sekme 2' },
      { key: 'tab3', label: 'Sekme 3' },
    ],
    activeKey: 'tab1',
    onSelect: () => {},
  },
};
