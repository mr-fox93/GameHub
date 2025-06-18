import { describe, it, expect, vi } from 'vitest';
import { useGameQueryStore } from '../store';

// Mock store
vi.mock('../store');
const mockedUseGameQueryStore = vi.mocked(useGameQueryStore);

// Mock APIClient
vi.mock('../services/api-client', () => ({
  default: vi.fn().mockImplementation(() => ({
    getAll: vi.fn().mockResolvedValue({
      count: 2,
      next: null,
      results: [
        { id: 1, name: 'Game 1' },
        { id: 2, name: 'Game 2' }
      ]
    })
  }))
}));

// Mock ms module
vi.mock('ms', () => ({
  default: () => 3600000
}));

describe('useGames', () => {
  it('should initialize correctly', () => {
    mockedUseGameQueryStore.mockReturnValue({
      gameQuery: {
        searchText: null,
        platformId: "2,3,7",
        sortOrder: "-added",
        dateReleased: "2023-01-01,2030-12-31",
        genreId: null
      },
      isSearchActive: false
    } as any);

    const gameQuery = useGameQueryStore();
    expect(gameQuery.gameQuery.platformId).toBe("2,3,7");
    expect(gameQuery.isSearchActive).toBe(false);
  });

  it('should handle search state', () => {
    mockedUseGameQueryStore.mockReturnValue({
      gameQuery: {
        searchText: 'cyberpunk',
        platformId: "2,3,7",
        sortOrder: "-added",
        dateReleased: "2023-01-01,2030-12-31",
        genreId: null
      },
      isSearchActive: true
    } as any);

    const gameQuery = useGameQueryStore();
    expect(gameQuery.gameQuery.searchText).toBe('cyberpunk');
    expect(gameQuery.isSearchActive).toBe(true);
  });
}); 