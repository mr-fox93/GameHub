import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import useGameQueryStore from "../store";

const SortSelector = () => {
  const arrayOfSelectors = [
    { value: "-added", label: "Latest & Most Trending" },
    { value: "", label: "Relevance" },
    { value: "name", label: "Name" },
    { value: "released", label: "Release Date" },
    { value: "-rating", label: "Average Rating" },
  ];

  const setSort = useGameQueryStore((state) => state.setSortOrder);
  const setDateReleased = useGameQueryStore((state) => state.setDateReleased);
  const setPlatformId = useGameQueryStore((state) => state.setPlatformId);
  const sort = useGameQueryStore((state) => state.gameQuery.sortOrder);

  const getRecentToFutureDateRange = () => {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);
    const futureDate = "2030-12-31";
    return `${pastDate.toISOString().split("T")[0]},${futureDate}`;
  };
  
  const handleSortChange = (value: string) => {
    setSort(value);
    
    if (value === "-added") {
      setPlatformId("2,3,7");
      setDateReleased(getRecentToFutureDateRange());
    } else if (value === "released") {
      setPlatformId(null);
      const today = new Date().toISOString().split("T")[0];
      const futureDate = "2040-12-31";
      setDateReleased(`${today},${futureDate}`);
    } else {
      setPlatformId(null);
      setDateReleased("");
    }
  };
  
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        Sort by:{" "}
        {arrayOfSelectors.find((item) => item.value === sort)?.label ||
          "Latest & Most Trending"}
      </MenuButton>

      <MenuList>
        {arrayOfSelectors?.map((item) => (
          <MenuItem
            onClick={() => {
              handleSortChange(item.value);
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
