import { create } from "zustand";

interface GameQuery {
  searchText?: string | null;
  platformId?: number | null;
  sortOrder?: string;
  dateReleased?: string;
  genreId?: string | null;
}

interface GameQueryStore {
  gameQuery: GameQuery;
  setSearchText: (searchText: string | null) => void;
  setPlatformId: (platformId: number | null) => void;
  setSortOrder: (sortOrder: string) => void;
  setDateReleased: (dateReleased: string) => void;
  setGenreId: (genreId: string | null) => void;
}

export const useGameQueryStore = create<GameQueryStore>((set) => ({
  gameQuery: {
    searchText: null,
    platformId: null,
    sortOrder: "",
    dateReleased: "",
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
