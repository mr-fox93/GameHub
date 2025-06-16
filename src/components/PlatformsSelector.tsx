import useGameQueryStore from "../store"; // Import the store
import { Button, Menu, MenuButton, MenuItem, MenuList, Spinner, Text } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import usePlatforms from "../hooks/usePlatforms";

const PlatformSelectors = () => {
  const { data, isLoading, error } = usePlatforms();

  const setPlatformId = useGameQueryStore((state) => state.setPlatformId);
  const platformId = useGameQueryStore((state) => state.gameQuery.platformId);

  if (error) return <Text color="red.500">Failed to load platforms</Text>;
  if (isLoading) return <Spinner size="sm" />;

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        {data?.results.find((item) => item.id === platformId)?.name ||
          "Platform"}
      </MenuButton>

      <MenuList>
        <MenuItem onClick={() => setPlatformId(null)}>All Platforms</MenuItem>
        {data?.results.map((platform) => (
          <MenuItem
            onClick={() => setPlatformId(platform.id)}
            key={platform.id}
          >
            {platform.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default PlatformSelectors;
