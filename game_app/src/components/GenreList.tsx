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
} from "@chakra-ui/react";
import useGameQueryStore from "../store"; // Import the store

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

  if (error) return <div>Error..</div>;
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

// import useGenres from "../hooks/useGenres";
// import { useContext, useState, useEffect } from "react";
// import { GlobalContext } from "../context/GlobalContext";
// import {
//   List,
//   ListItem,
//   Button,
//   HStack,
//   Text,
//   Flex,
//   Image,
//   Spinner,
// } from "@chakra-ui/react";

// const GenreList = () => {
//   const [name, setName] = useState<string>("");
//   const { data, isLoading, error } = useGenres();

//   const context = useContext(GlobalContext);

//   if (!context) {
//     throw new Error("Error");
//   }
//   const { setGenre, genre } = context;

//   useEffect(() => {
//     if (!genre) {
//       setName("");
//     }
//   }, [genre]);

//   if (error) return <div>Error..</div>;
//   if (isLoading) return <Spinner />;

//   return (
//     <>
//       <Flex flexDirection="column" padding={3} justifyContent="flex-start">
//         <Text fontSize="25px" fontWeight="extrabold" mb="7px">
//           Genres
//         </Text>
//         <List>
//           {data?.results.map((item) => (
//             <ListItem key={item.id}>
//               <HStack>
//                 <Image
//                   src={item.image_background}
//                   boxSize={30}
//                   borderRadius="6px"
//                 />
//                 <Button
//                   onClick={() => {
//                     setName(item.name);
//                     setGenre(item.slug);
//                   }}
//                   variant={item.name === name ? "outline" : "link"}
//                   ml="5px"
//                   background="transparent"
//                   transition="transform 0.3s"
//                   _hover={{ transform: "scale(1.1)" }}
//                   fontWeight={item.name === name ? "extrabold" : "bold"}
//                   fontSize={item.name === name ? "17px" : "15px"}
//                   textDecoration="none"
//                   gap="5px"
//                   padding="10px"
//                 >
//                   {item.name}
//                 </Button>
//               </HStack>
//             </ListItem>
//           ))}
//         </List>
//       </Flex>
//     </>
//   );
// };

// export default GenreList;
