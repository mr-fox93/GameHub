import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import { GlobalContext } from "../context/GlobalContext";
import { useContext } from "react";

const SortSelector = () => {
  const arrayOfSelectors = [
    { value: "", label: "Relevance" },
    { value: "name", label: "Name" },
    { value: "-released", label: "Relesed Date" },
    { value: "-rating", label: "Average Raiting" },
    { value: "-metacritic", label: "Metacritic" },
  ];
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("Error");
  }

  const { sort, setSort } = context;

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
