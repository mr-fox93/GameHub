import { useInfiniteQuery } from "react-query";
import APIClient from "../services/api-client";
import { Game } from "../entities/Games";
import { useGameQueryStore } from "../store";
import ms from "ms";

const apiClient = new APIClient<Game>("/games");

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

export default useGames;

// import { useInfiniteQuery } from "react-query";
// import APIClient from "../services/api-client";
// import { Game } from "../entities/Games";
// import { useContext } from "react";
// import { GlobalContext } from "../context/GlobalContext";
// import ms from "ms";

// const apiClient = new APIClient<Game>("/games");

// const useGames = () => {
//   const context = useContext(GlobalContext);

//   if (!context) {
//     throw new Error("Error");
//   }

//   const { searchInput, platform, sort, dateRelesed, genre } = context;

//   return useInfiniteQuery({
//     queryKey: ["games", searchInput, platform, sort, dateRelesed, genre],
//     queryFn: ({ pageParam = 1 }) =>
//       apiClient.getAll({
//         params: {
//           page: pageParam,
//           search: searchInput,
//           parent_platforms: platform,
//           ordering: sort,
//           dates: dateRelesed,
//           genres: genre,
//         },
//       }),
//     staleTime: ms("24h"),
//     getNextPageParam: (lastPage, allPages) => {
//       return lastPage.next ? allPages.length + 1 : undefined;
//     },
//   });
// };

// export default useGames;
