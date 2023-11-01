import { useInfiniteQuery } from "react-query";
import APIClient from "../services/api-client";
import { Game } from "../entities/Games";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

const apiClient = new APIClient<Game>("/games");

const useGames = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("Error");
  }

  const { searchInput, platform, sort, dateRelesed } = context;

  return useInfiniteQuery({
    queryKey: ["games", searchInput, platform, sort, dateRelesed],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getAll({
        params: {
          page: pageParam,
          search: searchInput,
          parent_platforms: platform,
          ordering: sort,
          dates: dateRelesed,
        },
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
  });
};

export default useGames;
