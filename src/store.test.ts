import { describe, it, expect, beforeEach } from 'vitest';
import { useGameQueryStore } from './store';

describe('GameQueryStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameQueryStore.getState().resetToDefault();
  });

  it('should initialize with default values', () => {
    const state = useGameQueryStore.getState();
    
    expect(state.gameQuery.searchText).toBeNull();
    expect(state.gameQuery.platformId).toBe("2,3,7");
    expect(state.gameQuery.sortOrder).toBe("-added");
    expect(state.gameQuery.genreId).toBeNull();
    expect(state.isSearchActive).toBe(false);
    expect(state.filtersBackup).toBeNull();
    expect(state.gameQuery.dateReleased).toContain('2030-12-31');
  });

  it('should update search text and activate search mode', () => {
    const { setSearchText } = useGameQueryStore.getState();
    
    setSearchText('cyberpunk');
    
    const state = useGameQueryStore.getState();
    expect(state.gameQuery.searchText).toBe('cyberpunk');
    expect(state.isSearchActive).toBe(true);
    expect(state.filtersBackup).not.toBeNull();
    expect(state.filtersBackup?.platformId).toBe("2,3,7");
  });

  it('should backup filters when starting search', () => {
    const { setPlatformId, setSortOrder, setGenreId, setSearchText } = useGameQueryStore.getState();
    
    // Set some filters first
    setPlatformId("1,2");
    setSortOrder("-rating");
    setGenreId("action");
    
    // Start search
    setSearchText('test game');
    
    const state = useGameQueryStore.getState();
    expect(state.filtersBackup).toEqual({
      platformId: "1,2",
      sortOrder: "-rating",
      dateReleased: expect.any(String),
      genreId: "action"
    });
  });

  it('should restore default filters when clearing search', () => {
    const { setSearchText } = useGameQueryStore.getState();
    
    // Start search
    setSearchText('test game');
    
    // Clear search
    setSearchText('');
    
    const state = useGameQueryStore.getState();
    expect(state.gameQuery.searchText).toBeNull();
    expect(state.isSearchActive).toBe(false);
    expect(state.filtersBackup).toBeNull();
    expect(state.gameQuery.platformId).toBe("2,3,7");
    expect(state.gameQuery.sortOrder).toBe("-added");
  });

  it('should handle platform selection', () => {
    const { setPlatformId } = useGameQueryStore.getState();
    
    setPlatformId("1,4");
    
    const state = useGameQueryStore.getState();
    expect(state.gameQuery.platformId).toBe("1,4");
  });

  it('should handle sort order changes', () => {
    const { setSortOrder } = useGameQueryStore.getState();
    
    setSortOrder("-rating");
    
    const state = useGameQueryStore.getState();
    expect(state.gameQuery.sortOrder).toBe("-rating");
  });

  it('should handle genre selection', () => {
    const { setGenreId } = useGameQueryStore.getState();
    
    setGenreId("shooter");
    
    const state = useGameQueryStore.getState();
    expect(state.gameQuery.genreId).toBe("shooter");
  });

  it('should handle date released changes', () => {
    const { setDateReleased } = useGameQueryStore.getState();
    
    setDateReleased("2020-01-01,2024-12-31");
    
    const state = useGameQueryStore.getState();
    expect(state.gameQuery.dateReleased).toBe("2020-01-01,2024-12-31");
  });

  it('should reset to default state', () => {
    const { setSearchText, setPlatformId, setSortOrder, resetToDefault } = useGameQueryStore.getState();
    
    // Change some values
    setSearchText('test');
    setPlatformId("1");
    setSortOrder("-name");
    
    // Reset
    resetToDefault();
    
    const state = useGameQueryStore.getState();
    expect(state.gameQuery.searchText).toBeNull();
    expect(state.gameQuery.platformId).toBe("2,3,7");
    expect(state.gameQuery.sortOrder).toBe("-added");
    expect(state.isSearchActive).toBe(false);
    expect(state.filtersBackup).toBeNull();
  });

  it('should not change search state when updating search text during active search', () => {
    const { setSearchText } = useGameQueryStore.getState();
    
    // Start search
    setSearchText('first search');
    const firstState = useGameQueryStore.getState();
    
    // Update search text
    setSearchText('updated search');
    const secondState = useGameQueryStore.getState();
    
    expect(secondState.gameQuery.searchText).toBe('updated search');
    expect(secondState.isSearchActive).toBe(true);
    expect(secondState.filtersBackup).toEqual(firstState.filtersBackup);
  });
}); 