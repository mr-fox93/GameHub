import { create } from "zustand";

const getRecentToFutureDateRange = () => {
  const pastDate = new Date();
  pastDate.setFullYear(pastDate.getFullYear() - 1);
  const futureDate = "2030-12-31";
  return `${pastDate.toISOString().split("T")[0]},${futureDate}`;
};

interface GameQuery {
  searchText?: string | null;
  platformId?: number | string | null;
  sortOrder?: string;
  dateReleased?: string;
  genreId?: string | null;
}

interface GameQueryStore {
  gameQuery: GameQuery;
  isSearchActive: boolean;
  filtersBackup: GameQuery | null;
  setSearchText: (searchText: string | null) => void;
  setPlatformId: (platformId: number | string | null) => void;
  setSortOrder: (sortOrder: string) => void;
  setDateReleased: (dateReleased: string) => void;
  setGenreId: (genreId: string | null) => void;
  resetToDefault: () => void;
}

const defaultQuery = {
  searchText: null,
  platformId: "2,3,7",
  sortOrder: "-added",
  dateReleased: getRecentToFutureDateRange(),
  genreId: null,
};

export const useGameQueryStore = create<GameQueryStore>((set) => ({
  gameQuery: defaultQuery,
  isSearchActive: false,
  filtersBackup: null,
  setSearchText: (searchText) =>
    set((store) => {
      const isStartingSearch = searchText && searchText.trim() !== "" && !store.isSearchActive;
      const isEndingSearch = (!searchText || searchText.trim() === "") && store.isSearchActive;

      if (isStartingSearch) {
        return {
          gameQuery: { ...store.gameQuery, searchText },
          isSearchActive: true,
          filtersBackup: {
            platformId: store.gameQuery.platformId,
            sortOrder: store.gameQuery.sortOrder,
            dateReleased: store.gameQuery.dateReleased,
            genreId: store.gameQuery.genreId,
          },
        };
      } else if (isEndingSearch) {
        return {
          gameQuery: {
            ...defaultQuery,
            searchText: null,
          },
          isSearchActive: false,
          filtersBackup: null,
        };
      } else {
        return {
          gameQuery: { ...store.gameQuery, searchText },
        };
      }
    }),
  setPlatformId: (platformId) =>
    set((store) => ({ 
      gameQuery: { ...store.gameQuery, platformId } 
    })),
  setSortOrder: (sortOrder) =>
    set((store) => ({ 
      gameQuery: { ...store.gameQuery, sortOrder } 
    })),
  setDateReleased: (dateReleased) =>
    set((store) => ({ 
      gameQuery: { ...store.gameQuery, dateReleased } 
    })),
  setGenreId: (genreId) =>
    set((store) => ({ 
      gameQuery: { ...store.gameQuery, genreId } 
    })),
  resetToDefault: () =>
    set(() => ({
      gameQuery: defaultQuery,
      isSearchActive: false,
      filtersBackup: null,
    })),
}));

export default useGameQueryStore;
