import useGenres from "../hooks/useGenres";
import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  HStack,
  Text,
  Flex,
  Image,
  Spinner,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import useGameQueryStore from "../store";

const GenreList = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const { data, isLoading, error } = useGenres();

  const setGenreId = useGameQueryStore((state) => state.setGenreId);
  const genreId = useGameQueryStore((state) => state.gameQuery.genreId);
  const isSearchActive = useGameQueryStore((state) => state.isSearchActive);

  const titleColor = useColorModeValue("gray.800", "white");
  const genreNameColor = useColorModeValue("gray.800", "white");
  const hoverBg = useColorModeValue("gray.100", "whiteAlpha.150");
  const selectedBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const borderColor = useColorModeValue("blue.500", "blue.400");

  useEffect(() => {
    if (!genreId || isSearchActive) {
      setSelectedGenre("");
    } else {
      const foundGenre = data?.results.find(item => item.slug === genreId);
      if (foundGenre) {
        setSelectedGenre(foundGenre.name);
      }
    }
  }, [genreId, isSearchActive, data]);

  const handleGenreSelection = (genreName: string, genreSlug: string) => {
    if (isSearchActive) return;
    
    if (selectedGenre === genreName) {
      setSelectedGenre("");
      setGenreId(null);
    } else {
      setSelectedGenre(genreName);
      setGenreId(genreSlug);
    }
  };

  const formatGameCount = (count: number) => {
    const formatted = count.toLocaleString('pl-PL').replace(/,/g, ' ');
    return `${formatted} GAMES`;
  };

  if (error) {
    return (
      <Box p={3}>
        <Text fontSize="xl" color="red.500" mb={2}>
          ⚠️ Failed to load genres
        </Text>
        <Text color="gray.500" fontSize="sm">
          Please try again later
        </Text>
      </Box>
    );
  }
  if (isLoading) return <Spinner />;

  return (
    <>
      <Flex flexDirection="column" padding={3} justifyContent="flex-start">
        <Text fontSize="25px" fontWeight="extrabold" mb="7px" color={titleColor}>
          Genres
        </Text>
        <List spacing={1}>
          {data?.results
            .filter((item) => item.name !== "Massively Multiplayer")
            .map((item) => (
              <ListItem key={item.id}>
                <Box
                  onClick={() => handleGenreSelection(item.name, item.slug)}
                  cursor={isSearchActive ? "not-allowed" : "pointer"}
                  p={2}
                  borderRadius="6px"
                  transition="all 0.2s ease"
                  bg={selectedGenre === item.name && !isSearchActive ? selectedBg : "transparent"}
                  _hover={{
                    bg: isSearchActive ? "transparent" : hoverBg,
                    transform: isSearchActive ? "none" : "translateX(2px)"
                  }}
                  border={selectedGenre === item.name && !isSearchActive ? "1px solid" : "1px solid transparent"}
                  borderColor={selectedGenre === item.name && !isSearchActive ? borderColor : "transparent"}
                  opacity={isSearchActive ? 0.5 : 1}
                >
                  <HStack spacing={3} align="center" h="40px">
                    <Image
                      src={item.image_background}
                      boxSize="40px"
                      borderRadius="6px"
                      objectFit="cover"
                      flexShrink={0}
                    />
                    <Flex direction="column" flex={1} justify="center" h="100%">
                      <Text
                        fontSize="16px"
                        fontWeight="bold"
                        color={genreNameColor}
                        lineHeight="1.1"
                        mb={1}
                        noOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Box
                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        px={2}
                        py={0.5}
                        borderRadius="3px"
                        alignSelf="flex-start"
                        maxW="fit-content"
                      >
                        <Text
                          fontSize="10px"
                          fontWeight="semibold"
                          color="white"
                          letterSpacing="0.3px"
                          opacity={0.9}
                        >
                          {formatGameCount(item.games_count)}
                        </Text>
                      </Box>
                    </Flex>
                  </HStack>
                </Box>
              </ListItem>
            ))}
        </List>
      </Flex>
    </>
  );
};

export default GenreList;
