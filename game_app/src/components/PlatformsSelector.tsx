import useGameQueryStore from "../store"; // Import the store
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import usePlatforms from "../hooks/usePlatforms";

const PlatformSelectors = () => {
  const { data } = usePlatforms();

  const setPlatformId = useGameQueryStore((state) => state.setPlatformId);
  const platformId = useGameQueryStore((state) => state.gameQuery.platformId);

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
            onClick={() => {
              setPlatformId(platform.id);
              console.log(platform.name);
            }}
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

// import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
// import { BsChevronDown } from "react-icons/bs";

// import { useContext } from "react";
// import { GlobalContext } from "../context/GlobalContext";
// import usePlatforms from "../hooks/usePlatforms";

// const PlatformSelectors = () => {
//   const { data } = usePlatforms();
//   const context = useContext(GlobalContext);

//   if (!context) {
//     throw new Error("Error");
//   }

//   const { setPlatform, platform } = context;

//   return (
//     <Menu>
//       <MenuButton as={Button} rightIcon={<BsChevronDown />}>
//         {data?.results.find((item) => item.id === platform)?.name || "Platform"}
//       </MenuButton>

//       <MenuList>
//         <MenuItem onClick={() => setPlatform(null)}>All Platforms</MenuItem>
//         {data?.results.map((platform) => (
//           <MenuItem
//             onClick={() => {
//               setPlatform(platform.id);
//               console.log(platform.name);
//             }}
//             key={platform.id}
//           >
//             {platform.name}
//           </MenuItem>
//         ))}
//       </MenuList>
//     </Menu>
//   );
// };

// export default PlatformSelectors;
