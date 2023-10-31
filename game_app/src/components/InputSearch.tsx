import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { Input as ChakraInput } from "@chakra-ui/react";

const InputSearch = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("Error");
  }

  const { searchInput, setSearchInput } = context;

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <Search2Icon color="gray.300" />
      </InputLeftElement>
      <ChakraInput
        value={searchInput || ""}
        onChange={(e) => {
          setSearchInput(e.target.value);
        }}
        variant="filled"
        placeholder="Search Games...."
      />
    </InputGroup>
  );
};

export default InputSearch;
