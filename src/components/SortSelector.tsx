import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import useGameQueryStore from "../store"; // Import the store

const SortSelector = () => {
  const arrayOfSelectors = [
    { value: "", label: "Relevance" },
    { value: "name", label: "Name" },
    { value: "-released", label: "Relesed Date" },
    { value: "-rating", label: "Average Raiting" },
    { value: "-metacritic", label: "Metacritic" },
  ];

  const setSort = useGameQueryStore((state) => state.setSortOrder);
  const sort = useGameQueryStore((state) => state.gameQuery.sortOrder);
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        Sort by:{" "}
        {arrayOfSelectors.find((item) => item.value === sort)?.label ||
          "Relevance"}
      </MenuButton>

      <MenuList>
        <MenuItem onClick={() => setSort("")}>All</MenuItem>
        {arrayOfSelectors?.map((item) => (
          <MenuItem
            onClick={() => {
              setSort(item.value);
            }}
            key={item.label}
          >
            {item.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default SortSelector;
