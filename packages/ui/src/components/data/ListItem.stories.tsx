// ListItem component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListItem } from './ListItem';

const meta: Meta<typeof ListItem> = {
  title: 'Components/Data/ListItem',
  component: ListItem,
};
export default meta;
type Story = StoryObj<typeof ListItem>;

export const Default: Story = {
  args: { title: 'Liste ogesi', subtitle: 'Aciklama' },
};

export const TitleOnly: Story = {
  args: { title: 'Sadece baslik' },
};

export const Pressable: Story = {
  args: { title: 'Tiklanabilir oge', subtitle: 'Detay icin tiklayin', onPress: () => {} },
};
