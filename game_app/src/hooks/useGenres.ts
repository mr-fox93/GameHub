import { useQuery } from "react-query";
import APIClient from "../services/api-client";
import ms from "ms";
import { Genres } from "../entities/Genres";

const apiClient = new APIClient<Genres>("/genres");

const useGenres = () =>
  useQuery({
    queryKey: ["genres"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
  });

export default useGenres;
