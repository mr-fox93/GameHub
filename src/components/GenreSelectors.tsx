import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import { useCallback, useMemo } from "react";
import useGenres from "../hooks/useGenres";
import useGameQueryStore from "../store";

const GenreSelectors = () => {
  const { data, isLoading, error } = useGenres();

  const setGenreId = useGameQueryStore((state) => state.setGenreId);
  const genreId = useGameQueryStore((state) => state.gameQuery.genreId);
  const isSearchActive = useGameQueryStore((state) => state.isSearchActive);

  const displayGenre = useMemo(() => {
    if (isSearchActive) return "All Genres";
    const selectedGenreName = data?.results.find((item) => item.slug === genreId)?.name;
    return selectedGenreName || "Genre";
  }, [isSearchActive, data, genreId]);

  const handleGenreChange = useCallback((slug: string | null) => {
    if (isSearchActive) return;
    setGenreId(slug);
  }, [isSearchActive, setGenreId]);

  if (error) return <Text color="red.500">Failed to load genres</Text>;
  if (isLoading)
    return (
      <Button isLoading size="md" variant="outline" disabled cursor="not-allowed">
        Loading Genres
      </Button>
    );

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<BsChevronDown />}
        opacity={isSearchActive ? 0.5 : 1}
        cursor={isSearchActive ? "not-allowed" : "pointer"}
      >
        {displayGenre}
      </MenuButton>

      <MenuList maxH="350px" overflowY="auto">
        <MenuItem
          onClick={() => handleGenreChange(null)}
          disabled={isSearchActive}
          opacity={isSearchActive ? 0.5 : 1}
        >
          All Genres
        </MenuItem>
        {data?.results
          .filter((item) => item.name !== "Massively Multiplayer")
          .map((genre) => (
            <MenuItem
              key={genre.id}
              onClick={() => handleGenreChange(genre.slug)}
              disabled={isSearchActive}
              opacity={isSearchActive ? 0.5 : 1}
            >
              {genre.name}
            </MenuItem>
          ))}
      </MenuList>
    </Menu>
  );
};

export default GenreSelectors; 