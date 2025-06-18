import { useInfiniteQuery } from "react-query";
import { useQuery } from "react-query";
import APIClient from "../services/api-client";
import { Game } from "../entities/Games";
import { useGameQueryStore } from "../store";
import ms from "ms";

const apiClient = new APIClient<Game>("/games");
const screenshotsClient = new APIClient<{ id: number; image: string }>("");

const useGames = () => {
  const gameQuery = useGameQueryStore((s) => s.gameQuery);
  const isSearchActive = useGameQueryStore((s) => s.isSearchActive);

  return useInfiniteQuery({
    queryKey: ["games", gameQuery, isSearchActive],
    queryFn: ({ pageParam = 1 }) => {
      const params: Record<string, string | number> = {
        page: pageParam,
      };

      if (gameQuery.searchText && gameQuery.searchText.trim() !== "") {
        params.search = gameQuery.searchText;
      } else {
        if (gameQuery.platformId) {
          params.parent_platforms = gameQuery.platformId;
        }
        if (gameQuery.sortOrder) {
          params.ordering = gameQuery.sortOrder;
        }
        if (gameQuery.dateReleased) {
          params.dates = gameQuery.dateReleased;
        }
        if (gameQuery.genreId) {
          params.genres = gameQuery.genreId;
        }
      }

      return apiClient.getAll({ params });
    },
    staleTime: ms("24h"),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
  });
};

export const useGameScreenshots = (gameId: number) => {
  return useQuery({
    queryKey: ["screenshots", gameId],
    queryFn: () => screenshotsClient.getAll({
      params: {},
      url: `/games/${gameId}/screenshots`
    }),
    staleTime: ms("24h"),
    enabled: !!gameId,
  });
};

export default useGames;
