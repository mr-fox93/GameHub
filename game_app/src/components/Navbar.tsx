import { HStack } from "@chakra-ui/react";
import Swich from "../common/Swich";

const Navbar = () => {
  return (
    <HStack justifyContent="space-between" padding="12px">
      <Swich />
    </HStack>
  );
};

export default Navbar;
