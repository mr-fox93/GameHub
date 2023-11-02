import { Box, Text, VStack, Link, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsGithub } from "react-icons/bs";

function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <Box as="footer" bg="gray.800" p={2} color="white">
          <VStack spacing={4}>
            {/* <HStack spacing={4}>
              <Button colorScheme="teal">Przycisk 1</Button>
              <Button colorScheme="teal">Przycisk 2</Button>
            </HStack> */}
            <Link href="https://github.com/mr-fox93" color="teal.400">
              <Flex
                justifyContent="center"
                flexDirection="row"
                alignItems="center"
              >
                <BsGithub color="white" />
                <Text color="white" ml="5px">
                  mr-fox93
                </Text>
              </Flex>
            </Link>
          </VStack>
        </Box>
      )}
    </>
  );
}

export default Footer;
