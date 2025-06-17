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

  return useInfiniteQuery({
    queryKey: ["games", gameQuery],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getAll({
        params: {
          search: gameQuery.searchText,
          parent_platforms: gameQuery.platformId,
          ordering: gameQuery.sortOrder,
          dates: gameQuery.dateReleased,
          genres: gameQuery.genreId,
          page: pageParam,
        },
      }),
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
