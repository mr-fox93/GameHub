import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactNode } from 'react';
import InputSearch from '../components/InputSearch';
import GameGrid from '../components/GameGrid';
import { useGameQueryStore } from '../store';

// Mock API responses
const mockGamesResponse = {
  count: 2,
  next: null,
  results: [
    {
      id: 1,
      name: 'Cyberpunk 2077',
      rating: 4.5,
      background_image: 'https://example.com/cyberpunk.jpg',
      released: '2020-12-10',
      ratings_count: 1000000,
      added: 500000,
      parent_platforms: [],
      rating_top: 5,
      screenshots_count: 10
    },
    {
      id: 2, 
      name: 'The Witcher 3',
      rating: 4.8,
      background_image: 'https://example.com/witcher.jpg',
      released: '2015-05-19',
      ratings_count: 2000000,
      added: 1000000,
      parent_platforms: [],
      rating_top: 5,
      screenshots_count: 15
    }
  ]
};

const mockEmptyResponse = {
  count: 0,
  next: null,
  results: []
};

// Mock useGames hook
vi.mock('../hooks/useGames', () => ({
  default: () => ({
    data: { pages: [mockGamesResponse] },
    isLoading: false,
    isError: false,
    error: null,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    isSuccess: true
  }),
  useGameScreenshots: vi.fn(() => ({
    data: { results: [] },
    isLoading: false
  }))
}));

// Mock react-infinite-scroll-component
vi.mock('react-infinite-scroll-component', () => ({
  default: ({ children, ...props }: any) => <div data-testid="infinite-scroll" {...props}>{children}</div>
}));

describe('Search Workflow Integration', () => {
  let queryClient: QueryClient;
  let wrapper: (props: { children: ReactNode }) => JSX.Element;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    
    wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          {children}
        </ChakraProvider>
      </QueryClientProvider>
    );

    user = userEvent.setup();
    
    // Reset store before each test
    useGameQueryStore.getState().resetToDefault();
    vi.clearAllMocks();
  });

  it('should perform complete search workflow', async () => {
    render(
      <div>
        <InputSearch />
        <GameGrid />
      </div>,
      { wrapper }
    );

    // 1. Initial state - should show default games
    expect(screen.getByPlaceholderText(/search games/i)).toBeInTheDocument();
    
    // 2. Start typing search query
    const searchInput = screen.getByPlaceholderText(/search games/i);
    await user.type(searchInput, 'cyberpunk');
    
    // 3. Verify search state is activated
    const store = useGameQueryStore.getState();
    expect(store.gameQuery.searchText).toBe('cyberpunk');
    expect(store.isSearchActive).toBe(true);
    expect(store.filtersBackup).not.toBeNull();
  });

  it('should clear search and restore filters', async () => {
    render(
      <div>
        <InputSearch />
        <GameGrid />
      </div>,
      { wrapper }
    );

    // 1. Set some filters first
    const { setPlatformId, setSortOrder } = useGameQueryStore.getState();
    setPlatformId("1,2");
    setSortOrder("-rating");

    // 2. Perform search
    const searchInput = screen.getByPlaceholderText(/search games/i);
    await user.type(searchInput, 'witcher');
    
    // 3. Verify search is active and filters are backed up
    let store = useGameQueryStore.getState();
    expect(store.isSearchActive).toBe(true);
    expect(store.filtersBackup?.platformId).toBe("1,2");
    expect(store.filtersBackup?.sortOrder).toBe("-rating");

    // 4. Clear search
    await user.clear(searchInput);
    
    // 5. Verify filters are restored
    store = useGameQueryStore.getState();
    expect(store.isSearchActive).toBe(false);
    expect(store.gameQuery.searchText).toBeNull();
    expect(store.gameQuery.platformId).toBe("2,3,7"); // Default restored
    expect(store.filtersBackup).toBeNull();
  });

  it('should handle search with no results', async () => {
    render(
      <div>
        <InputSearch />
        <GameGrid />
      </div>,
      { wrapper }
    );

    // Search for non-existent game
    const searchInput = screen.getByPlaceholderText(/search games/i);
    await user.type(searchInput, 'nonexistentgame123');
    
    // Should still maintain search state
    const store = useGameQueryStore.getState();
    expect(store.gameQuery.searchText).toBe('nonexistentgame123');
    expect(store.isSearchActive).toBe(true);
  });

  it('should handle search API errors gracefully', async () => {
    render(
      <div>
        <InputSearch />
        <GameGrid />
      </div>,
      { wrapper }
    );

    // Perform search that will fail
    const searchInput = screen.getByPlaceholderText(/search games/i);
    await user.type(searchInput, 'test');
    
    // Should maintain search state even with API error
    const store = useGameQueryStore.getState();
    expect(store.gameQuery.searchText).toBe('test');
    expect(store.isSearchActive).toBe(true);
  });

  it('should preserve search text during active search updates', async () => {
    render(
      <div>
        <InputSearch />
        <GameGrid />
      </div>,
      { wrapper }
    );

    const searchInput = screen.getByPlaceholderText(/search games/i);
    
    // Initial search
    await user.type(searchInput, 'cyber');
    let store = useGameQueryStore.getState();
    const initialBackup = store.filtersBackup;
    
    // Update search text
    await user.type(searchInput, 'punk');
    
    // Should maintain same backup but update search text
    store = useGameQueryStore.getState();
    expect(store.gameQuery.searchText).toBe('cyberpunk');
    expect(store.isSearchActive).toBe(true);
    expect(store.filtersBackup).toEqual(initialBackup);
  });

  it('should handle rapid search input changes', async () => {
    render(
      <div>
        <InputSearch />
        <GameGrid />
      </div>,
      { wrapper }
    );

    const searchInput = screen.getByPlaceholderText(/search games/i);
    
    // Rapid typing simulation
    await user.type(searchInput, 'a');
    await user.type(searchInput, 'b');
    await user.type(searchInput, 'c');
    
    // Should handle state updates correctly
    const store = useGameQueryStore.getState();
    expect(store.gameQuery.searchText).toBe('abc');
    expect(store.isSearchActive).toBe(true);
    expect(store.filtersBackup).not.toBeNull();
  });
}); 