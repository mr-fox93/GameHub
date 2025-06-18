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
  setSearchText: (searchText: string | null) => void;
  setPlatformId: (platformId: number | string | null) => void;
  setSortOrder: (sortOrder: string) => void;
  setDateReleased: (dateReleased: string) => void;
  setGenreId: (genreId: string | null) => void;
  resetToDefault: () => void;
}

export const useGameQueryStore = create<GameQueryStore>((set) => ({
  gameQuery: {
    searchText: null,
    platformId: "2,3,7",
    sortOrder: "-added",
    dateReleased: getRecentToFutureDateRange(),
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
  resetToDefault: () =>
    set(() => ({
      gameQuery: {
        searchText: null,
        platformId: "2,3,7",
        sortOrder: "-added",
        dateReleased: getRecentToFutureDateRange(),
        genreId: null,
      },
    })),
}));

export default useGameQueryStore;
