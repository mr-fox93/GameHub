import { InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { Input as ChakraInput } from "@chakra-ui/react";
import useGameQueryStore from "../store"; // Import the store

const InputSearch = () => {
  const setSearchText = useGameQueryStore((state) => state.setSearchText);
  const searchText = useGameQueryStore((state) => state.gameQuery.searchText);

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <Search2Icon color="gray.300" />
      </InputLeftElement>
      <ChakraInput
        value={searchText || ""}
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        variant="filled"
        placeholder="Search Games...."
      />
    </InputGroup>
  );
};

export default InputSearch;
