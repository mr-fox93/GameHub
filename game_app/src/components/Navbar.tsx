import { HStack, Image } from "@chakra-ui/react";
import Swich from "../common/Swich";
import logo from "../assets/logo.png";
import InputSearch from "./InputSearch";

const Navbar = () => {
  return (
    <HStack justifyContent="space-between" padding="12px">
      <Image boxSize="60px" src={logo} />
      <InputSearch />
      <Swich />
    </HStack>
  );
};

export default Navbar;
