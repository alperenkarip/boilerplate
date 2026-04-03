// InfiniteScrollList component icin Storybook story dosyasi
import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfiniteScrollList } from './InfiniteScrollList';

const meta: Meta<typeof InfiniteScrollList> = {
  title: 'Components/Utility/InfiniteScrollList',
  component: InfiniteScrollList,
};
export default meta;
type Story = StoryObj<typeof InfiniteScrollList>;

export const WithMore: Story = {
  args: {
    onLoadMore: () => {},
    hasMore: true,
    isLoading: false,
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            style={{
              padding: '12px',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: '6px',
            }}
          >
            Liste ogesi {i + 1}
          </div>
        ))}
      </div>
    ),
  },
};

export const Loading: Story = {
  args: {
    onLoadMore: () => {},
    hasMore: true,
    isLoading: true,
    children: 'Mevcut liste icerigi',
  },
};

export const AllLoaded: Story = {
  args: {
    onLoadMore: () => {},
    hasMore: false,
    isLoading: false,
    children: 'Tum ogeler yuklu.',
  },
};
