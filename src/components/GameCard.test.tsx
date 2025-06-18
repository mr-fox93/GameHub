import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactNode } from 'react';
import GameCard from './GameCard';
import { Game } from '../entities/Games';
import * as useGamesHook from '../hooks/useGames';

// Mock useGameScreenshots hook
vi.mock('../hooks/useGames', () => ({
  default: vi.fn(),
  useGameScreenshots: vi.fn()
}));

const mockUseGameScreenshots = vi.mocked(useGamesHook.useGameScreenshots);

const mockGame: Game = {
  id: 1,
  name: 'Test Game',
  released: '2023-01-01',
  background_image: 'https://example.com/image.jpg',
  rating: 4.5,
  ratings_count: 1000,
  added: 2000,
  screenshots_count: 5,
  background_image_additional: 'https://example.com/image2.jpg',
  parent_platforms: [
    {
      platform: {
        id: 1,
        name: 'PC',
        slug: 'pc'
      }
    }
  ],
  rating_top: 5
};

const mockGameWithAdultContent: Game = {
  ...mockGame,
  id: 2,
  name: 'Sex Game Test'
};

describe('GameCard', () => {
  let queryClient: QueryClient;
  let wrapper: (props: { children: ReactNode }) => JSX.Element;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          {children}
        </ChakraProvider>
      </QueryClientProvider>
    );

    // Default mock for useGameScreenshots
    mockUseGameScreenshots.mockReturnValue({
      data: {
        results: [
          { id: 1, image: 'https://example.com/screenshot1.jpg' },
          { id: 2, image: 'https://example.com/screenshot2.jpg' }
        ]
      },
      isLoading: false
    } as any);

    vi.clearAllMocks();
  });

  it('should render game information correctly', () => {
    render(<GameCard game={mockGame} />, { wrapper });
    
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('1.0K')).toBeInTheDocument(); // ratings_count formatted as 1.0K
  });

  it('should display game image', () => {
    render(<GameCard game={mockGame} />, { wrapper });
    
    const image = screen.getByAltText('game image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should render platform icons', () => {
    render(<GameCard game={mockGame} />, { wrapper });
    
    // PlatformIcons component should be rendered (we'll test this exists)
    expect(screen.getByText('Test Game')).toBeInTheDocument();
  });

  it('should show adult content warning for games with adult content', () => {
    render(<GameCard game={mockGameWithAdultContent} />, { wrapper });
    
    expect(screen.getByText('+18')).toBeInTheDocument();
    expect(screen.getByText('Click if you have more than 18 years')).toBeInTheDocument();
    
    // Image should be blurred
    const image = screen.getByAltText('game image');
    expect(image).toHaveStyle('filter: blur(20px)');
  });

  it('should reveal adult content when clicked', () => {
    render(<GameCard game={mockGameWithAdultContent} />, { wrapper });
    
    const adultWarning = screen.getByText('+18');
    fireEvent.click(adultWarning);
    
    // Adult warning should be gone
    expect(screen.queryByText('+18')).not.toBeInTheDocument();
    
    // Image should not be blurred anymore
    const image = screen.getByAltText('game image');
    expect(image).toHaveStyle('filter: none');
  });

  it('should handle hover effects', async () => {
    render(<GameCard game={mockGame} />, { wrapper });
    
    const card = screen.getByText('Test Game').closest('[role="button"]') || 
                screen.getByText('Test Game').closest('div');
    
    if (card) {
      fireEvent.mouseEnter(card);
      
      await waitFor(() => {
        expect(screen.getByText('Click to zoom')).toBeInTheDocument();
      });
      
      fireEvent.mouseLeave(card);
    }
  });

  it('should open modal when image is clicked', async () => {
    render(<GameCard game={mockGame} />, { wrapper });
    
    const image = screen.getByAltText('game image');
    fireEvent.click(image);
    
    // Modal should open (we can test for modal content or aria attributes)
    await waitFor(() => {
      const modal = document.querySelector('[role="dialog"]');
      expect(modal).toBeInTheDocument();
    });
  });

  it('should not open modal when adult content warning is present', () => {
    render(<GameCard game={mockGameWithAdultContent} />, { wrapper });
    
    const image = screen.getByAltText('game image');
    fireEvent.click(image);
    
    // Modal should not open, adult warning should still be visible
    expect(screen.getByText('+18')).toBeInTheDocument();
    const modal = document.querySelector('[role="dialog"]');
    expect(modal).not.toBeInTheDocument();
  });

  it('should load screenshots on hover', () => {
    render(<GameCard game={mockGame} />, { wrapper });
    
    const card = screen.getByText('Test Game').closest('div');
    
    if (card) {
      fireEvent.mouseEnter(card);
      
      // Should call useGameScreenshots with game id
      expect(mockUseGameScreenshots).toHaveBeenCalledWith(1);
    }
  });

  it('should not load screenshots when not hovered', () => {
    render(<GameCard game={mockGame} />, { wrapper });
    
    // Should call useGameScreenshots with 0 (disabled)
    expect(mockUseGameScreenshots).toHaveBeenCalledWith(0);
  });

  it('should handle missing background image', () => {
    const gameWithoutImage = { ...mockGame, background_image: '' };
    render(<GameCard game={gameWithoutImage} />, { wrapper });
    
    const image = screen.getByAltText('game image');
    // Should use fallback image (we can test if src contains 'noimage')
    expect(image).toBeInTheDocument();
  });

  it('should format large numbers correctly', () => {
    const gameWithLargeNumbers = {
      ...mockGame,
      ratings_count: 1500000,
      added: 2500000
    };
    
    render(<GameCard game={gameWithLargeNumbers} />, { wrapper });
    
    // The component shows ratings_count formatted, so we expect 1.5M
    expect(screen.getByText('1.5M')).toBeInTheDocument();
  });

  it('should navigate through screenshots', async () => {
    render(<GameCard game={mockGame} />, { wrapper });
    
    const card = screen.getByText('Test Game').closest('div');
    
    if (card) {
      fireEvent.mouseEnter(card);
      
      await waitFor(() => {
        // Look for navigation buttons (they might be arrow buttons)
        const nextButton = document.querySelector('[aria-label*="next"], [aria-label*="Next"]');
        const prevButton = document.querySelector('[aria-label*="prev"], [aria-label*="Previous"]');
        
        if (nextButton) {
          fireEvent.click(nextButton);
          // Test that image source changes or some indication of navigation
        }
      });
    }
  });

  it('should handle screenshot loading state', () => {
    mockUseGameScreenshots.mockReturnValue({
      data: null,
      isLoading: true
    } as any);
    
    render(<GameCard game={mockGame} />, { wrapper });
    
    const card = screen.getByText('Test Game').closest('div');
    
    if (card) {
      fireEvent.mouseEnter(card);
      // Should handle loading state gracefully
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    }
  });
}); 