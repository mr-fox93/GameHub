import { create } from "zustand";

// Helper to generate today date in YYYY-MM-DD format and a range that ends today.
const today = new Date().toISOString().split("T")[0];
const DATE_RANGE_UNTIL_TODAY = `1900-01-01,${today}`;

interface GameQuery {
  searchText?: string | null;
  platformId?: number | string | null;
  sortOrder?: string;
  dateReleased?: string;
  genreId?: string | null;
}

interface GameQueryStore {
  gameQuery: GameQuery;
  setSearchText: (searchText: string | null) => void;
  setPlatformId: (platformId: number | string | null) => void;
  setSortOrder: (sortOrder: string) => void;
  setDateReleased: (dateReleased: string) => void;
  setGenreId: (genreId: string | null) => void;
}

export const useGameQueryStore = create<GameQueryStore>((set) => ({
  gameQuery: {
    searchText: null,
    platformId: "2,3,7",
    sortOrder: "-released",
    dateReleased: DATE_RANGE_UNTIL_TODAY,
    genreId: null,
  },
  setSearchText: (searchText) =>
    set((store) => ({ gameQuery: { ...store.gameQuery, searchText } })),
  setPlatformId: (platformId) =>
    set((store) => ({ gameQuery: { ...store.gameQuery, platformId } })),
  setSortOrder: (sortOrder) =>
    set((store) => ({ gameQuery: { ...store.gameQuery, sortOrder } })),
  setDateReleased: (dateReleased) =>
    set((store) => ({ gameQuery: { ...store.gameQuery, dateReleased } })),
  setGenreId: (genreId) =>
    set((store) => ({ gameQuery: { ...store.gameQuery, genreId } })),
}));

export default useGameQueryStore;
