import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactNode } from 'react';
import GameGrid from './GameGrid';
import * as useGamesHook from '../hooks/useGames';

// Mock useGames hook
vi.mock('../hooks/useGames');
const mockUseGames = vi.mocked(useGamesHook.default);

// Mock GameCard component  
vi.mock('./GameCard', () => ({
  default: ({ game }: any) => (
    <div data-testid={`game-card-${game.id}`}>
      <h3>{game.name}</h3>
      <span>{game.rating}</span>
    </div>
  )
}));

// Mock react-infinite-scroll-component
const mockFetchNextPage = vi.fn();
vi.mock('react-infinite-scroll-component', () => ({
  default: ({ children, hasMore, next, loader, endMessage, ...props }: any) => (
    <div data-testid="infinite-scroll" {...props}>
      {children}
      {hasMore && (
        <button onClick={next} data-testid="load-more">
          Load More
        </button>
      )}
      {!hasMore && endMessage}
      {loader}
    </div>
  )
}));

// Mock store
vi.mock('../store', () => ({
  useGameQueryStore: vi.fn(() => ({
    gameQuery: {
      searchText: null,
      platformId: "2,3,7",
      sortOrder: "-added", 
      dateReleased: "2023-01-01,2030-12-31",
      genreId: null
    },
    isSearchActive: false
  }))
}));

const mockGames = [
  {
    id: 1,
    name: 'Test Game 1',
    rating: 4.5,
    background_image: 'https://example.com/game1.jpg',
    released: '2023-01-01',
    ratings_count: 1000,
    added: 2000,
    parent_platforms: [],
    rating_top: 5,
    screenshots_count: 5
  },
  {
    id: 2,
    name: 'Test Game 2', 
    rating: 4.2,
    background_image: 'https://example.com/game2.jpg',
    released: '2023-02-01',
    ratings_count: 1500,
    added: 2500,
    parent_platforms: [],
    rating_top: 5,
    screenshots_count: 8
  }
];

describe('GameGrid', () => {
  let queryClient: QueryClient;
  let wrapper: (props: { children: ReactNode }) => JSX.Element;

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

    vi.clearAllMocks();
    mockFetchNextPage.mockClear();
  });

  it('should render games list successfully', () => {
    mockUseGames.mockReturnValue({
      data: {
        pages: [
          {
            count: 2,
            next: null,
            results: mockGames
          }
        ]
      },
      isLoading: false,
      isError: false,
      error: null,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
      isSuccess: true,
      isFetchingNextPage: false
    } as any);

    render(<GameGrid />, { wrapper });

    // Should render both games
    expect(screen.getByTestId('game-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('game-card-2')).toBeInTheDocument();
    expect(screen.getByText('Test Game 1')).toBeInTheDocument();
    expect(screen.getByText('Test Game 2')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    mockUseGames.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
      isSuccess: false,
      isFetchingNextPage: false
    } as any);

    render(<GameGrid />, { wrapper });

    // Should show loading spinner
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should handle error state', () => {
    const mockError = new Error('Failed to fetch games');
    
    mockUseGames.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
      isSuccess: false,
      isFetchingNextPage: false
    } as any);

    render(<GameGrid />, { wrapper });

    // Should show error message
    expect(screen.getByText(/failed to load games/i)).toBeInTheDocument();
  });

  it('should handle infinite scroll with more pages', async () => {
    mockUseGames.mockReturnValue({
      data: {
        pages: [
          {
            count: 100,
            next: 'page2',
            results: mockGames
          }
        ]
      },
      isLoading: false,
      isError: false,
      error: null,
      hasNextPage: true,
      fetchNextPage: mockFetchNextPage,
      isSuccess: true,
      isFetchingNextPage: false
    } as any);

    render(<GameGrid />, { wrapper });

    // Should render infinite scroll component
    expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
    
    // Should have load more functionality
    const loadMoreButton = screen.getByTestId('load-more');
    expect(loadMoreButton).toBeInTheDocument();
    
    // Trigger load more
    fireEvent.click(loadMoreButton);
    
    expect(mockFetchNextPage).toHaveBeenCalledOnce();
  });

  it('should handle empty results', () => {
    mockUseGames.mockReturnValue({
      data: {
        pages: [
          {
            count: 0,
            next: null,
            results: []
          }
        ]
      },
      isLoading: false,
      isError: false,
      error: null,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
      isSuccess: true,
      isFetchingNextPage: false
    } as any);

    render(<GameGrid />, { wrapper });

    // Should show empty state message
    expect(screen.getByText(/no games found/i) || screen.getByText(/no results/i)).toBeInTheDocument();
  });

  it('should handle next page loading state', () => {
    mockUseGames.mockReturnValue({
      data: {
        pages: [
          {
            count: 100,
            next: 'page2',
            results: mockGames
          }
        ]
      },
      isLoading: false,
      isError: false,
      error: null,
      hasNextPage: true,
      fetchNextPage: mockFetchNextPage,
      isSuccess: true,
      isFetchingNextPage: true // Loading next page
    } as any);

    render(<GameGrid />, { wrapper });

    // Should show current games
    expect(screen.getByTestId('game-card-1')).toBeInTheDocument();
    
    // Should show loading indicator for next page
    expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
  });

  it('should handle end of infinite scroll', () => {
    mockUseGames.mockReturnValue({
      data: {
        pages: [
          {
            count: 2,
            next: null,
            results: mockGames
          }
        ]
      },
      isLoading: false,
      isError: false,
      error: null,
      hasNextPage: false, // No more pages
      fetchNextPage: mockFetchNextPage,
      isSuccess: true,
      isFetchingNextPage: false
    } as any);

    render(<GameGrid />, { wrapper });

    // Should render games
    expect(screen.getByTestId('game-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('game-card-2')).toBeInTheDocument();
    
    // Should not show load more button since hasNextPage is false
    expect(screen.queryByTestId('load-more')).not.toBeInTheDocument();
  });

  it('should handle multiple pages of data', () => {
    const page2Games = [
      {
        id: 3,
        name: 'Test Game 3',
        rating: 4.0,
        background_image: 'https://example.com/game3.jpg',
        released: '2023-03-01',
        ratings_count: 800,
        added: 1800,
        parent_platforms: [],
        rating_top: 4,
        screenshots_count: 6
      }
    ];

    mockUseGames.mockReturnValue({
      data: {
        pages: [
          {
            count: 3,
            next: 'page2',
            results: mockGames
          },
          {
            count: 3,
            next: null,
            results: page2Games
          }
        ]
      },
      isLoading: false,
      isError: false,
      error: null,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
      isSuccess: true,
      isFetchingNextPage: false
    } as any);

    render(<GameGrid />, { wrapper });

    // Should render games from both pages
    expect(screen.getByTestId('game-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('game-card-2')).toBeInTheDocument(); 
    expect(screen.getByTestId('game-card-3')).toBeInTheDocument();
    expect(screen.getByText('Test Game 3')).toBeInTheDocument();
  });

  it('should maintain component performance with large datasets', () => {
    // Simulate large dataset
    const largeGamesList = Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      name: `Game ${index + 1}`,
      rating: 4.0 + (index % 10) / 10,
      background_image: `https://example.com/game${index + 1}.jpg`,
      released: '2023-01-01',
      ratings_count: 1000 + index * 100,
      added: 2000 + index * 50,
      parent_platforms: [],
      rating_top: 5,
      screenshots_count: 5 + (index % 10)
    }));

    mockUseGames.mockReturnValue({
      data: {
        pages: [
          {
            count: 50,
            next: null,
            results: largeGamesList
          }
        ]
      },
      isLoading: false,
      isError: false,
      error: null,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
      isSuccess: true,
      isFetchingNextPage: false
    } as any);

    const startTime = performance.now();
    render(<GameGrid />, { wrapper });
    const endTime = performance.now();

    // Should render efficiently (under 100ms for test environment)
    expect(endTime - startTime).toBeLessThan(100);
    
    // Should render all games
    expect(screen.getByTestId('game-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('game-card-50')).toBeInTheDocument();
  });
}); 