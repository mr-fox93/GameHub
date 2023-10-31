import { HStack, Switch, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const Swich = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack>
      {colorMode === "dark" ? (
        <MoonIcon boxSize={5} />
      ) : (
        <SunIcon boxSize={5} />
      )}
      <Switch isChecked={colorMode === "light"} onChange={toggleColorMode} />
    </HStack>
  );
};

export default Swich;
