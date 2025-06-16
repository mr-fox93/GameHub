import useGenres from "../hooks/useGenres";
import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  Button,
  HStack,
  Text,
  Flex,
  Image,
  Spinner,
  Box,
} from "@chakra-ui/react";
import useGameQueryStore from "../store";

const GenreList = () => {
  const [name, setName] = useState<string>("");
  const { data, isLoading, error } = useGenres();

  const setGenreId = useGameQueryStore((state) => state.setGenreId);
  const genreId = useGameQueryStore((state) => state.gameQuery.genreId);

  useEffect(() => {
    if (!genreId) {
      setName("");
    }
  }, [genreId]);

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
        <Text fontSize="25px" fontWeight="extrabold" mb="7px">
          Genres
        </Text>
        <List>
          {data?.results
            .filter((item) => item.name !== "Massively Multiplayer")
            .map((item) => (
              <ListItem key={item.id}>
                <HStack>
                  <Image
                    src={item.image_background}
                    boxSize={30}
                    borderRadius="6px"
                  />
                  <Button
                    onClick={() => {
                      setName(item.name);
                      setGenreId(item.slug);
                    }}
                    variant={item.name === name ? "outline" : "link"}
                    ml="5px"
                    background="transparent"
                    transition="transform 0.3s"
                    _hover={{ transform: "scale(1.1)" }}
                    fontWeight={item.name === name ? "extrabold" : "bold"}
                    fontSize={item.name === name ? "17px" : "15px"}
                    textDecoration="none"
                    gap="5px"
                    padding="10px"
                  >
                    {item.name}
                  </Button>
                </HStack>
              </ListItem>
            ))}
        </List>
      </Flex>
    </>
  );
};

export default GenreList;
