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
  const isSearchActive = useGameQueryStore((state) => state.isSearchActive);

  const getRecentToFutureDateRange = () => {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);
    const futureDate = "2030-12-31";
    return `${pastDate.toISOString().split("T")[0]},${futureDate}`;
  };
  
  const handleSortChange = (value: string) => {
    if (isSearchActive) return;
    
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
  
  const displayLabel = isSearchActive 
    ? "Relevance" 
    : (arrayOfSelectors.find((item) => item.value === sort)?.label || "Latest & Most Trending");
  
  return (
    <Menu>
      <MenuButton 
        as={Button} 
        rightIcon={<BsChevronDown />}
        opacity={isSearchActive ? 0.5 : 1}
        cursor={isSearchActive ? "not-allowed" : "pointer"}
      >
        Sort by: {displayLabel}
      </MenuButton>

      <MenuList>
        {arrayOfSelectors.map((selector) => (
          <MenuItem
            onClick={() => handleSortChange(selector.value)}
            key={selector.value}
            disabled={isSearchActive}
            opacity={isSearchActive ? 0.5 : 1}
          >
            {selector.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default SortSelector;
