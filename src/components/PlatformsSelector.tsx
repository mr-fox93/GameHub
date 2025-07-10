import useGameQueryStore from "../store";
import { useCallback, useMemo } from "react";
import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import usePlatforms from "../hooks/usePlatforms";

const PlatformSelectors = () => {
  const { data, isLoading, error } = usePlatforms();

  const setPlatformId = useGameQueryStore((state) => state.setPlatformId);
  const platformId = useGameQueryStore((state) => state.gameQuery.platformId);
  const isSearchActive = useGameQueryStore((state) => state.isSearchActive);
  const selectedPlatformId = typeof platformId === "number" ? platformId : undefined;

  const handlePlatformChange = useCallback((id: number | null) => {
    if (isSearchActive) return;
    setPlatformId(id);
  }, [isSearchActive, setPlatformId]);

  const displayPlatform = useMemo(() => {
    if (isSearchActive) return "All Platforms";
    return data?.results.find((item) => item.id === selectedPlatformId)?.name || "Platform";
  }, [isSearchActive, data, selectedPlatformId]);

  if (error) return <Text color="red.500">Failed to load platforms</Text>;
  if (isLoading) {
    return (
      <Button isLoading size="md" variant="outline" disabled cursor="not-allowed">
        Loading Platforms
      </Button>
    );
  }

  return (
    <Menu>
      <MenuButton 
        as={Button} 
        rightIcon={<BsChevronDown />}
        opacity={isSearchActive ? 0.5 : 1}
        cursor={isSearchActive ? "not-allowed" : "pointer"}
      >
        {displayPlatform}
      </MenuButton>

      <MenuList>
        <MenuItem 
          onClick={() => handlePlatformChange(null)}
          disabled={isSearchActive}
          opacity={isSearchActive ? 0.5 : 1}
        >
          All Platforms
        </MenuItem>
        {data?.results.map((platform) => (
          <MenuItem
            onClick={() => handlePlatformChange(platform.id)}
            key={platform.id}
            disabled={isSearchActive}
            opacity={isSearchActive ? 0.5 : 1}
          >
            {platform.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default PlatformSelectors;
