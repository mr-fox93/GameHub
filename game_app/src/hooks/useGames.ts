import { useInfiniteQuery } from "react-query";
import APIClient from "../services/api-client";

export interface Game {
  id: number;
  name: string;
  released: string;
  background_image: string;
  rating: number;
  parent_platforms: {
    platform: {
      name: string;
    };
  };
}

const apiClient = new APIClient<Game>("/games");

const useGames = () =>
  useInfiniteQuery({
    queryKey: ["games"],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getAll({
        params: {
          page: pageParam,
        },
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
  });

export default useGames;
