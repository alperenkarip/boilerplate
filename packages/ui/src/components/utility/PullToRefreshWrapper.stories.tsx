// PullToRefreshWrapper component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PullToRefreshWrapper } from './PullToRefreshWrapper';

const meta: Meta<typeof PullToRefreshWrapper> = {
  title: 'Components/Utility/PullToRefreshWrapper',
  component: PullToRefreshWrapper,
};
export default meta;
type Story = StoryObj<typeof PullToRefreshWrapper>;

export const Idle: Story = {
  args: {
    onRefresh: () => {},
    isRefreshing: false,
    children: 'Liste icerigi burada yer alir. Yenilemek icin usteki butona basin.',
  },
};

export const Refreshing: Story = {
  args: {
    onRefresh: () => {},
    isRefreshing: true,
    children: 'Liste icerigi yenileniyor...',
  },
};
